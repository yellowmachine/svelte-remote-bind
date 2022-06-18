import { writable } from 'svelte/store';
import { pipe, buffer, switchMap, from, interval, NEVER, Subject, debounceTime, skip, tap } from 'rxjs';
import { onDestroy } from 'svelte';

const T = 2000;

let schemas = {}

export function register(schema){
  schemas[schema.name] = schema
}

export function fromSchema(path){
  const [schemaName, entity] = path.split(":")
  const schema = schemas[schemaName]

  return {
    delay: schema.delay,
    myfetch: schema.fetch,
    token: schema.token,
    key: schema.entities[entity].key,
    url: schema.baseUrl + schema.entities[entity].path,
    validation: schema.entities[entity].validation,
    errors: schema.entities[entity].errors
  } 
}

export function stream({id, client, delay=T}){
    
    const status = writable('initial')
        
    function pausableInterval(pauser) {    
        return pauser.pipe(switchMap((paused) => {
          if(paused){
            return NEVER
          }else{
            return interval(delay)
          }
        }
      )
    )}
    
    async function handle(values){
        try{
            status.set("saving")	
            //console.log('saving...')
            let response;
            if(id){
              response = await client.put(values, id)
            }else{
              response = await client.post(values)
            }            
            status.set("saved")
            //console.log("saved!")	
            if(!id){
              id = response[client.key]
            }
            return response;            
        } catch(err){
            console.log('error!', err);
            status.set("error")
            return {error: err}
        }finally {
            pauser.next(false)
        }
    }

    const pauser = new Subject()
    const stream = new Subject()
    
    const _pipe = pipe(
      skip(1),
      tap(x=>console.log(1, x)),
      debounceTime(delay),
      tap(x=>console.log(2, x)),
      buffer(pausableInterval(pauser)),
      tap(x=>console.log(3, x)),
      switchMap((x) => {
        if(x.length > 0) return from(handle(x.at(-1)))
        return NEVER  
      }),
      tap(x=>console.log(4, x)),
    ); 

    const subscription = stream.pipe(
      _pipe
    ).subscribe({
      next: (v) => {},
      complete: (v) => console.log('complete'),
      error: (err) => console.log(err)
    });	

    //onDestroy(() => subscription.unsubscribe());
    pauser.next(false)

    return {
        pipe: _pipe,
        status,
        save: (item) => stream.next(item),
        saveImmediately: (x) => handle([x])
    }
}

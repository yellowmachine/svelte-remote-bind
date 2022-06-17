import { writable } from 'svelte/store';
import { buffer, switchMap, from, interval, NEVER, Subject, debounceTime, skip } from 'rxjs';
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
    myfetch: schema.fetch,
    token: schema.token,
    key: schema.entities[entity].key,
    url: schema.baseUrl + schema.entities[entity].path,
    validation: schema.entities[entity].validation,
    errors: schema.entities[entity].errors
  } 
}

export function stream({id, client}){

    const status = writable('initial')
        
    function pausableInterval(pauser) {    
        return pauser.pipe(switchMap((paused) => {
          if(paused){
            return NEVER
          }else{
            return interval(T)
          }
        }
      )
    )}
    
    async function handle(values){
        try{
            status.set("saving")	
            console.log('saving...')
            let response;
            if(id){
              response = await client.put(values, id)
            }else{
              response = await client.post(values)
            }            
            status.set("saved")
            console.log("saved!")	
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
    
    const subscription = stream.pipe(
      skip(1),
      debounceTime(T),
      buffer(pausableInterval(pauser)),
      switchMap((x) => {
        console.log("switchmap x", x, x.length)
        if(x.length > 0) return from(handle(x.at(-1)))
        return NEVER  
      })
    ).subscribe({
      next: (v) => {},
      complete: (v) => console.log('complete'),
      error: (err) => console.log(err)
    });	

    onDestroy(() => subscription.unsubscribe());
    pauser.next(false)

    return {
        status,
        save: (item) => stream.next(item),
        saveImmediately: (x) => handle([x])
    }
}

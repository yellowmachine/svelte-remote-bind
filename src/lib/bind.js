import { writable } from 'svelte/store';
import { pipe, buffer, startWith, switchMap, from, interval,
         NEVER, Subject, debounceTime, skip, tap, take, of } from 'rxjs';
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

export function stream({id, client, delay=T, _test=false}){
    
    const status = writable('initial')
    
    function pausableInterval(pauser) {  
      return pauser.pipe(startWith(false), switchMap((paused) => {
        if(paused){
          return NEVER
        }else{
          return interval(delay)
        }
      }
    )
  )}

    async function handle(values, pauser){
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
  

    function _pipe(h){
      return pipe(
        skip(1),
        tap((v)=>{
          if(_test && v === 'z') pauser.next(false)
        }),
        debounceTime(delay),
        buffer(pausableInterval(pauser)),
        switchMap((x) => {         
          if(x.length > 0) {
            pauser.next(true)
            return h(x.at(-1), pauser)
          }
          return NEVER  
        })
      );
    }

    let subscription;
    if(!_test){
      subscription = stream.pipe(
        _pipe((x)=>from(handle(x, pauser)))
      ).subscribe({
        next: (v) => {},
        complete: (v) => console.log('complete'),
        error: (err) => console.log(err)
      });
    }
    	
    if(!_test) onDestroy(() => subscription.unsubscribe());
    
    return {
        _pipe,
        _setId: (v) => id=v,
        status,
        save: (item) => stream.next(item),
        saveImmediately: (x) => handle([x])
    }
}

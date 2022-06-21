import { writable } from 'svelte/store';
import { catchError, timer, pipe, buffer, startWith, switchMap, from, interval, EMPTY,
         NEVER, Subject, debounceTime, skip, tap, filter, take, of } from 'rxjs';
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
    delay: schema.delay === undefined ? 1000: schema.delay,
    myfetch: schema.fetch,
    token: schema.token || null,
    key: schema.entities[entity].key || "id",
    entitySchema: schema.entities[entity].name,
    url: schema.baseUrl + (schema.entities[entity].path || "id"),
    validation: schema.entities[entity].validation || (()=>true),
    errors: schema.entities[entity].errors || (()=>({}))
  } 
}

export function getInnerStream({id, client, delay=T, _test=false}){
  const status = writable('initial')
    
  function pausableInterval(pauser) {  
      return pauser.pipe(startWith(false), switchMap((paused) => {
        if(paused){
          return NEVER
        }else{
          return timer(delay) //interval(delay).pipe(take(2))
        }
      }
    )
  )}

  async function handle(values, done){
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
          return undefined //{error: err}
          //throw new Error(err)
      }finally {
          done()
      }
  }

  const pauser = new Subject()
  const stream = new Subject()

  let buffering = false;

  function _pipe(h){
    return pipe(
      skip(1),
      ..._test ? [
        tap((v)=>{
          if(v === 'z'){
            pauser.next(false)
            buffering = false
          }
        }),
        filter(v => v !== 'z')
      ]: [],
      debounceTime(delay),
      tap(v => {
        //console.log(v)
        if(!buffering) pauser.next(false)
      }),
      buffer(pausableInterval(pauser)),
      switchMap((x) => {         
        if(x.length > 0) {
          pauser.next(true)
          buffering = true;
          return h(x.at(-1), ()=>{
            buffering = false
            pauser.next(false)
          }).pipe(switchMap(x => {
            if(x === undefined) return NEVER
            return of(x)
          }))
        }
        return NEVER  
      })
    );
  }
  return {stream, status, handle, pauser, _pipe, _setId: (v)=>id=v}
}

export function stream({id, client, delay=T}){
  
    const {stream, status, handle, pauser, _pipe} = getInnerStream({id, client, delay});

    const subscription = stream.pipe(
        _pipe((x, done)=>from(handle(x, done)))
      ).subscribe({
        next: (v) => {},
        complete: (v) => console.log('complete'),
        error: (err) => console.log(err)
      });

    onDestroy(() => subscription.unsubscribe());
  
    return {
        _pipe,
        _setId: (v) => id=v,
        status,
        save: (item) => stream.next(item),
        saveImmediately: (x) => handle([x])
    }
}

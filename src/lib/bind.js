import { writable } from 'svelte/store';
import { buffer, switchMap, from, interval, NEVER, Subject, debounceTime, skip } from 'rxjs';
import { onDestroy } from 'svelte';
//import {error, success} from '$lib/store';

const T = 2000;

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
    
    async function handle(x){
        try{
            status.set("saving")	
            console.log('saving...')
            const c = client()
            let response;
            let values = x.at(-1);
            if(id){
              response = await c.put(values, id)
            }else{
              response = await c.post(values)
            }            
            status.set("saved")
            console.log("saved!", 'background: #222; color: #e62558')	
            //success.timeout("saved!")
            if(!id){
              id = c.setId(response);
            }
            return response;            
        } catch(err){
            console.log('%c error! ', 'background: #222; color: #e62558');
            console.log(err)
            status.set("error")
            //error.timeout("error :(")
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
        if(x.length > 0) return from(handle(x))
        console.log('skiping')
        return NEVER  
      })
    ).subscribe({
      next: (v) => {}, //console.log(`observer: ${JSON.stringify(v)}`),
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

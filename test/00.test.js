// to be run with jasmine because vitest does errors
import { TestScheduler } from 'rxjs/testing';
import { buffer, NEVER, switchMap, of, Subject, skip, interval, startWith, debounceTime } from 'rxjs';
import { stream } from '../src/lib/bind.js';
//import { it, expect } from 'vitest'; 

function pausableInterval(pauser) {    
    return pauser.pipe(startWith(false), switchMap((paused) => {
      if(paused){
        return NEVER
      }else{
        return interval(1)
      }
    }
  )
)}

const testScheduler = new TestScheduler((actual, expected) => {
  console.log(actual)
  console.log(expected)
  expect(actual).toEqual(expected);
});

/*
it("just the basic sample", () => {
    testScheduler.run(({ expectObservable, hot }) => {
        const source = hot(  "-a---b-------c-----|");
        const expected =     "--a---b-------c----|";
     
        expectObservable(source.pipe(debounceTime(1))).toBe(expected);
    });
});
*/

it("testing pipe", ()=>{
    testScheduler.run(({ expectObservable, hot, cold }) => {

        const pauser = new Subject()

        function h(x, pauser){
            _setId(35)
            pauser.next(false)
            return "r"
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = cold(   "-a---b-------c-----|");
        const expected =       "-------r-------r----";

        expectObservable(source.pipe(
            //_pipe((x, pauser) => of(h(x, pauser)))
            
            skip(1),
            debounceTime(1),
            buffer(pausableInterval(pauser)),
            switchMap((x) => {
                if(x.length > 0) {
                    pauser.next(true)
                    return h(x.at(-1), pauser)
                } 
                return NEVER  
            })
            
        )).toBe(expected);
    });
})

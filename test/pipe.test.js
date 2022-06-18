import { marbles } from "rxjs-marbles/mocha";
import { describe, it } from 'vitest';
import { stream } from '../src/lib';
import { pipe, NEVER, Subject } from 'rxjs';
import { map, skip, debounceTime, interval, buffer, switchMap } from "rxjs/operators";

function pausableInterval(pauser) {    
    return pauser.pipe(switchMap((paused) => {
      if(paused){
        return NEVER
      }else{
        return interval(0)
      }
    }
  )
)}

describe("testing main pipe", () => {

    it("should test basic 'a'", marbles(m => {

        const client = {
            put: async () => "b",
            post: async () => "b",
            key: "id",
        }

        //const { pipe } = stream({client, delay: 0})
        const pauser = new Subject()
        const _pipe = pipe(
            skip(1),
            debounceTime(0),
            buffer(pausableInterval(pauser)),
            map(value => 'b')
        )

        const source =  m.hot("--^-a-b-c-|");
        const expected =        "--------(b|)";

        pauser.next(false)
        const destination = source.pipe(
            _pipe
        );
        m.expect(destination).toBeObservable(expected);
        //m.expect(source).toHaveSubscriptions(subs);

        /*
        const source =  m.cold("--x-a|");
        const expected =        "---b|";

        const destination = source.pipe(
            pipe
        );
        m.expect(destination).toBeObservable(expected);
        //m.expect(source).toHaveSubscriptions(subs);
        */
    }));
});
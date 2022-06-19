import { marbles } from "rxjs-marbles/mocha";
import { map, debounceTime, switchMap, skip } from "rxjs/operators";
import { of, pipe } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { stream } from '../src/lib/bind.js';

describe("rxjs-marbles", () => {

    it("should support marble tests", marbles(m => {

        const source =  m.hot("--^-a-b-c-|");
        const expected =        "---b-c-d|";

        const destination = source.pipe(
            debounceTime(1),
            map(value => String.fromCharCode(value.charCodeAt(0) + 1))
        );
        m.expect(destination).toBeObservable(expected);
    }));

    it("just the basic sample", marbles(m => {
        
        function handle(x){
            _setId(35)
            return "r"
        }

        const { /*_pipe,*/ _setId } = stream({ delay: 0, _test: true })
        
        function _pipe(h){
            return pipe(
              skip(1),
              debounceTime(1),
              //buffer(pausableInterval(pauser)),
              switchMap((x) => {
                return h(x)
              })
            );
        }

        const source = m.hot(  "-a---b-------------");
        const expected =       "------r------------";

        const destination = source.pipe(
            _pipe((x) => of(handle(x)))
        );

        m.expect(destination).toBeObservable(expected);
    }));
});
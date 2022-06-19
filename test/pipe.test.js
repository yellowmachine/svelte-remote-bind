import { marbles } from "rxjs-marbles/mocha";
import { map, debounceTime, switchMap, skip, buffer, bufferTime, startWith } from "rxjs/operators";
import { interval, of, pipe, Subject } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { stream } from '../src/lib/bind.js';


describe("rxjs-marbles", () => {

    it("just the basic sample", marbles(m => {
        
        function handle(x){
            _setId(35)
            return "r"
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = m.hot(  "-a---b-------c-----|");
        const expected =       "------r-------r----|";

        const destination = source.pipe(
            _pipe((x) => of(handle(x)))
        );

        m.expect(destination).toBeObservable(expected);
    }));
});
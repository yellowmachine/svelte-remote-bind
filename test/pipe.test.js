// to be run with jasmine because vitest gives no output
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { stream } from '../src/lib/bind.js';

const testScheduler = new TestScheduler((actual, expected) => {
  console.log(actual)
  console.log(expected)
  expect(actual).toEqual(expected);
});

it("testing pipe", ()=>{
    testScheduler.run(({ expectObservable, hot, cold }) => {

        function h(x, pauser){
            _setId(35)
            pauser.next(false)
            return "r"
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = cold(   "-a---b-------c-----|");
        const expected =       "-------r-------r----";

        expectObservable(source.pipe(
            _pipe((x, pauser) => of(h(x, pauser)))
        )).toBe(expected);
    });
})

// to be run with jasmine because vitest gives no output
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { stream } from '../src/lib/bind.js';

function createTestSchedulter(){
    return new TestScheduler((actual, expected) => {
        console.log(actual)
        console.log(expected)
        expect(actual).toEqual(expected);
      });
}

it("testing pipe", ()=>{
    const testScheduler = createTestSchedulter()
    testScheduler.run(({ expectObservable, hot, cold }) => {

        function h(x, pauser){
            _setId(35)
            pauser.next(false)
            return x
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = cold(   "-a---b-------c-----|");
        const expected =       "-------b-------c----";

        expectObservable(source.pipe(
            _pipe((x, pauser) => of(h(x, pauser)))
        )).toBe(expected);
    });
})


it("testing pipe with debounce", ()=>{
    const testScheduler = createTestSchedulter()
    testScheduler.run(({ expectObservable, hot, cold }) => {

        function h(x, pauser){
            _setId(35)
            pauser.next(false)
            return x
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = cold(   "-a---bc------x-----|");
        const expected =       "--------c------x----";

        expectObservable(source.pipe(
            _pipe((x, pauser) => of(h(x, pauser)))
        )).toBe(expected);
    });
})

it("testing pipe with buffering", ()=>{
    const testScheduler = createTestSchedulter()
    testScheduler.run(({ expectObservable, hot, cold }) => {

        function h(x, pauser){
            _setId(35)
            //pauser.next(false)
            return x
        }

        const { _pipe, _setId } = stream({ delay: 1, _test: true })

        const source = cold(   "-a---bc--x--y--z---|");
        const expected =       "--------c-------y--(z|)";

        expectObservable(source.pipe(
            _pipe((x, pauser) => of(h(x, pauser)))
        )).toBe(expected);
    });
})
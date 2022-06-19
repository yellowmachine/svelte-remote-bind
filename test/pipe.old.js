import { cold, hot } from 'jasmine-marbles';
import { of, pipe, skip, switchMap, debounceTime } from 'rxjs';
import { stream } from '../src/lib/bind.js';

describe("testing main pipe", () => {

    it("just the basic sample", () => {
        
        function handle(x){
            _setId(35)
            return {id: 35}
        }

        const { /*_pipe,*/ _setId } = stream({ delay: 0, _test: true })
        
        function _pipe(h){
            return pipe(
              skip(1),
              //debounceTime(1),
              //buffer(pausableInterval(pauser)),
              /*switchMap((x) => {
                return h(x)
              })
              */
            );
        }

        const values = { a: 1, b: 2, c: 3, r: {id: 35} };
        const source = cold(  '-a---b-------------|', values);
        const expected = cold('------r------------|', values);

        const result = source.pipe(
            _pipe((x) => of(handle(x)))
        );

        expect(result).toBeObservable(expected);
    });
});

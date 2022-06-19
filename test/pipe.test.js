import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { stream } from '../src/lib/bind.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

describe("testing main pipe", () => {

    it("just the basic sample", () => {
        
        function handle(x){
            _setId(35)
            return {id: 35}
        }

        const { _pipe, _setId } = stream({ delay: 0, _test: true })
        
        const values = { a: 1, b: 2, c: 3, r: {id: 35} };
        const source = cold(  '-a-b-c-|', values);
        const expected = cold('-r-r-r-|', values);

        const result = source.pipe(
            _pipe((x) => of(handle(x)))
        );
        expect(result).toBeObservable(expected);
    });
});

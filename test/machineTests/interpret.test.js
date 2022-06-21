import { interpret } from "xstate";
import { remoteMachineFactory } from '../../src/lib/machine';
import schema from './schema';
import {jest} from '@jest/globals';

it('should reach initial from initial on TYPE', (done) => {
    const myfetch = jest.fn(async x => x)    
    const remoteMachine = remoteMachineFactory({ schema: {...schema, fetch: myfetch}, entity: 'cat'})

    let count = 0;
    const service = interpret(remoteMachine)
      .onTransition(state => {
        count++
        if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') {
          expect(count).toBe(3)
          expect(myfetch.mock.calls[0][0]).toMatchObject({
            url: 'http://localhost:8080/api/cat',
            method: 'POST',
            token: 'Bearer ABC',
            body: 'xyz'
          });
          done()
        }
      })
      .start();

    service.send('TYPE', {data: "xyz"});
    
});
  
it('should reach initial from initial on two TYPE', (done) => {
  const myfetch = jest.fn()  
  myfetch.mockReturnValueOnce(Promise.resolve({id: 3})).mockReturnValueOnce(Promise.resolve({id: 3}))
  const remoteMachine = remoteMachineFactory({schema: {...schema, fetch: myfetch}, entity: 'cat'})

  let count = 0;
  const service = interpret(remoteMachine)
    .onTransition(state => {
      count++
      if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') {
        expect(count).toBe(5)
        expect(myfetch.mock.calls[0][0]).toMatchObject({
          url: 'http://localhost:8080/api/cat',
          method: 'POST',
          token: 'Bearer ABC',
          body: 'xyz'
        });
        expect(myfetch.mock.calls[1][0]).toMatchObject({
          url: 'http://localhost:8080/api/cat',
          method: 'PUT',
          token: 'Bearer ABC',
          body: 'abc'
        });
        
        done()
      }
    })
    .start();

  service.send('TYPE', {data: "xyz"});
  service.send('TYPE', {data: "abc"});

});
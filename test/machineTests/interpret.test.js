import { interpret } from "xstate";
import { remoteMachineFactory } from '../../src/lib/machine';
import schema from './schema';
import { it, expect, vi } from 'vitest';

it('should reach initial from initial on TYPE', async () => {
 
    let resolve
    const promise = new Promise(_resolve => resolve = _resolve)
    const myfetch = vi.fn()
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
          resolve()
        }
      })
      .start();

    service.send('TYPE', {data: "xyz"});
    await promise
});
  
it('should reach initial from initial on two TYPE', async () => {

  let resolve
  const promise = new Promise(_resolve => resolve = _resolve)

  const myfetch = vi.fn()
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
        
        resolve()
      }
    })
    .start();

  service.send('TYPE', {data: "xyz"});
  service.send('TYPE', {data: "abc"});
    await promise
});
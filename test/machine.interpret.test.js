import { interpret } from "xstate";
import { remoteMachineFactory } from '../src/lib/machine';
import schema from './schema';
import { it, expect, vi } from 'vitest';

it('should reach iddle from init on two TYPE', async () => {
 
    let resolve
    const promise = new Promise(_resolve => resolve = _resolve)
    const myfetch = vi.fn()

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema: {...schema, fetch: myfetch}, entity, validation});

    let count = 0;
    const service = interpret(m)
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
          resolve()
        }
      })
      .start();

    service.send('TYPE', {data: "ignore"});
    service.send('TYPE', {data: "xyz"});
    await promise
});

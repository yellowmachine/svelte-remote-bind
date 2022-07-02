import { interpret } from "xstate";
import { remoteMachineFactory } from '../src/lib/machine';
import schema from './schema';

it('should reach idle from init on two TYPE', (done) => {
 
    const myfetch = jest.fn( x => ({data: {id: 3}}))

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema: {...schema, fetch: myfetch}, entity, validation});

    let count = 0;
    const service = interpret(m)
      .onTransition(state => {
        count++
        if(state.matches("idle") && state.context.buffer.length === 0 && state.context.current !== null) {
          expect(count).toBe(5)
          expect(myfetch.mock.calls[0][0]).toMatchObject({
            url: 'http://localhost:8080/api/cat',
            id: null,
            method: 'POST',
            token: 'Bearer ABC',
            body: 'xyz'
          });
          done()
        }
      })
      .start();

    service.send('TYPE', {data: "ignore"});
    service.send('TYPE', {data: "xyz"});
});

it('should reach idle from init on TYPE and debounce', (done) => {
 
  const myfetch = jest.fn( x => ({data: {id: 3}}))

  const entity = 'cat';
  const validation = schema.entities.cat.validation;

  const m = remoteMachineFactory({schema: {...schema, fetch: myfetch}, entity, validation});

  let count = 0;
  let states = []
  const service = interpret(m)
    .onTransition(state => {
      states.push(state.value)
      count++
      if(state.matches("idle") && state.context.buffer.length === 0 && state.context.current !== null) {
        expect(count).toBe(6)
        expect(myfetch.mock.calls[0][0]).toMatchObject({
          url: 'http://localhost:8080/api/cat',
          method: 'POST',
          id: null,
          token: 'Bearer ABC',
          body: 'xyz'
        });
        expect(states).toEqual(['init', 'idle', 'debouncing', 'debouncing', 'saving', 'idle'])
        done()
      }
    })
    .start();

  service.send('TYPE', {data: "ignore"});
  service.send('TYPE', {data: "abc debounced"});
  service.send('TYPE', {data: "xyz"});
});

it('should reach error from init', (done) => {
 
  const myfetch = jest.fn(x => {throw 'Error'})

  const entity = 'cat';
  const validation = schema.entities.cat.validation;

  const m = remoteMachineFactory({schema: {...schema, fetch: myfetch}, entity, validation});
  let states = [];
  let count = 0;
  const service = interpret(m)
    .onTransition(state => {
      states.push(state.value)
      count++
      if(state.matches("error")) {
        expect(states).toEqual(['init', 'idle', 'debouncing', 'saving', 'error'])
        done()
      }
    })
    .start();

  service.send('TYPE', {data: "ignore"});
  service.send('TYPE', {data: "i want an error"});
});

it('should reach idle from init on two TYPE and it is a PUT', (done) => {
 
  const myfetch = jest.fn( x => ({data: {id: 3}}))

  const entity = 'cat';
  const validation = schema.entities.cat.validation;

  const m = remoteMachineFactory({ id: 1, schema: {...schema, fetch: myfetch}, entity, validation});

  let count = 0;
  const service = interpret(m)
    .onTransition(state => {
      count++
      if(state.matches("idle") && state.context.buffer.length === 0 && state.context.current !== null) {
        expect(count).toBe(5)
        expect(myfetch.mock.calls[0][0]).toMatchObject({
          url: 'http://localhost:8080/api/cat/1',
          id: 1,
          method: 'PUT',
          token: 'Bearer ABC',
          body: 'xyz'
        });
        done()
      }
    })
    .start();

  service.send('TYPE', {data: "ignore"});
  service.send('TYPE', {data: "xyz"});
});
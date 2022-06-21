const { interpret } = require("xstate");
const remoteMachineFactory = require('../../src/lib/machine')


it('should reach initial from initial on TYPE', (done) => {
    const myfetch = jest.fn(async x => x)    
    const remoteMachine = remoteMachineFactory({myfetch})

    let count = 0;
    const service = interpret(remoteMachine)
      .onTransition(state => {
        count++
        if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') {
          expect(count).toBe(3)
          expect(myfetch.mock.results[0].value).resolves.toBe('xyz');
          done()
        }
      })
      .start();

    service.send('TYPE', {data: "xyz"});
    
});
  
it('should reach initial from initial on two TYPE', (done) => {
  const myfetch = jest.fn(async x => x)  
  const remoteMachine = remoteMachineFactory({myfetch})

  let count = 0;
  const service = interpret(remoteMachine)
    .onTransition(state => {
      count++
      if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') {
        expect(count).toBe(5)
        expect(myfetch.mock.results[0].value).resolves.toBe('xyz');
        expect(myfetch.mock.results[1].value).resolves.toBe('abc');
        
        done()
      }
    })
    .start();

  service.send('TYPE', {data: "xyz"});
  service.send('TYPE', {data: "abc"});

});
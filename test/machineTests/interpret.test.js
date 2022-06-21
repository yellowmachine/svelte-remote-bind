const { interpret } = require("xstate");
const remoteMachineFactory = require('../../src/lib/machine')

const myfetch = jest.fn(async x => x)

it('should reach initial from initial on TYPE', (done) => {
    
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
    
    //service.stop();
});
  

const { interpret } = require("xstate");
const remoteMachine = require('../../src/lib/machine')

it('should reach initial from initial on TYPE', (done) => {
    
    const service = interpret(remoteMachine)
      .onTransition(state => {
        if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') done()
      })
      .start();

    service.send('TYPE', {data: "xyz"});
    
    //service.stop();
});
  

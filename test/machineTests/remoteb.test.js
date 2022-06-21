const { interpret } = require("xstate");
const remoteMachine = require('./remote.machine')

it('should reach initial from initial on TYPE', (done) => {
    
    const service = interpret(remoteMachine)
      .onTransition(state => {
        console.log(state.value, state.context)
        if(state.matches("iddle") && state.context.buffer.length === 0 && state.context.current !== 'initial') done()
      })
      .start();

    service.send('TYPE', {data: "xyz"});
    //service.stop();
});
  

const remoteMachineFactory = require('../../src/lib/machine')

const myfetch = (x) => Promise.resolve(1)

it('should reach fetching from initial on TYPE', () => {

    const remoteMachine = remoteMachineFactory({myfetch})
    
    const expectedValue = 'buffering';
  
    let actualState = remoteMachine.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();

    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'b' });
    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'c' });
  
    expect(actualState.context.buffer).toEqual(['c'])
});
  
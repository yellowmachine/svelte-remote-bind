const { remoteMachineFactory } = require('../../src/lib/machine')
const schema = require('./schema')

it('should reach fetching from initial on TYPE', () => {

    const remoteMachine = remoteMachineFactory({schema, path: "endpoint:cat"})
    
    const expectedValue = 'buffering';
  
    let actualState = remoteMachine.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();

    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'b' });
    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'c' });
  
    expect(actualState.context.buffer).toEqual(['c'])
});
  
const remoteMachine = require('./remote.machine')

it('should reach fetching from initial on TYPE', () => {
    const expectedValue = 'buffering.fetching';
  
    let actualState = remoteMachine.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();

    actualState = remoteMachine.transition('buffering.fetching', { type: 'TYPE', data: 'b' });
    actualState = remoteMachine.transition('buffering.fetching', { type: 'TYPE', data: 'c' });
  
    expect(actualState.context.buffer).toEqual(['c'])
});
  
const remoteMachine = require('../../src/lib/machine')

it('should reach fetching from initial on TYPE', () => {
    const expectedValue = 'buffering';
  
    let actualState = remoteMachine.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();

    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'b' });
    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'c' });
  
    expect(actualState.context.buffer).toEqual(['c'])
});
  
import { remoteMachineFactory } from '../../src/lib/machine';
import schema from './schema';
import { it, expect } from 'vitest';

it('should reach fetching from initial on TYPE', () => {

    const remoteMachine = remoteMachineFactory({schema, entity: "cat"})
    
    const expectedValue = 'buffering';
  
    let actualState = remoteMachine.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();

    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'b' });
    actualState = remoteMachine.transition('buffering', { type: 'TYPE', data: 'c' });
  
    expect(actualState.context.buffer).toEqual(['c'])
});
  
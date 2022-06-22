import { remoteMachineFactory } from '../src/lib/machine';
import schema from './schema';
import { it, expect } from 'vitest';

it('should reach iddle from init by TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'iddle';
  
    let actualState = m.transition('init', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
  
it('should reach debouncing from iddle by TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'debouncing';
  
    let actualState = m.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
  

it('should reach debouncing from iddle by two events TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'debouncing';
  
    m.transition('iddle', { type: 'TYPE', data: 'a' });
    let actualState = m.transition('iddle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
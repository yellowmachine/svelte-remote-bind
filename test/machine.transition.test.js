import { remoteMachineFactory } from '../src/lib/machine';
import schema from './schema';

it('should reach idle from init by TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'idle';
  
    let actualState = m.transition('init', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
  
it('should reach debouncing from idle by TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'debouncing';
  
    let actualState = m.transition('idle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
  

it('should reach debouncing from idle by two events TYPE', () => {

    const entity = 'cat';
    const validation = schema.entities.cat.validation;

    const m = remoteMachineFactory({schema, entity, validation});
    
    const expectedValue = 'debouncing';
  
    m.transition('idle', { type: 'TYPE', data: 'a' });
    let actualState = m.transition('idle', { type: 'TYPE', data: 'a' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
});
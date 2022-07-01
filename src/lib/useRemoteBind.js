import { remoteMachineFactory } from './machine'
import { useMachine } from '@xstate/svelte';
import { getContext } from 'svelte';

export default function useRemoteBind({id=null, bind, onCreated}){
    const endpoints = getContext('remoteBindEndpoints')
    const [name, entity] = bind.split(':');
    const schema = endpoints[name]
    const debounceTime = schema.debounceTime;

    const entitySchema = schema.entities[entity];

    const validation = entitySchema.validation || (() => true);
    const errors = entitySchema.errors || (() => ({}))
    
    const m = remoteMachineFactory({ onCreated, id, schema, entity, validation, entitySchema, debounceTime});

    const {state, send} = useMachine(m);

    return {
        state,
        errors,
        reset: () => send('RESET'),
        flush: () => send('FLUSH'),
        update: (item) => send('TYPE', {data: item})
    }
}


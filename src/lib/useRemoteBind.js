import { remoteMachineFactory } from './machine'
import { useMachine } from '@xstate/svelte';
import { getContext } from 'svelte';

export default function useRemoteBind({id=null, bind}){
    const endpoints = getContext('remoteBindEndpoints')
    const [name, entity] = bind.split(':');
    const schema = endpoints[name]
    const debounceTime = schema.debounceTime;

    const { validation, errors } = schema.entities[entity];
    const entitySchema = schema.entities[entity];
    const added = entitySchema.added;
    const m = remoteMachineFactory({ added, id, schema, entity, validation, entitySchema, debounceTime});

    const {state, send} = useMachine(m);

    return {
        state,
        errors,
        reset: () => send('RESET'),
        flush: () => send('FLUSH'),
        update: (item) => send('TYPE', {data: item})
    }
}


import { remoteMachineFactory } from './machine'
import { useMachine } from '@xstate/svelte';
import { getContext } from 'svelte';
import cloneDeep from 'lodash.clonedeep';

export default function useRemoteBind({id=null, bind, onCreated}){
    const endpoints = getContext('remoteBindEndpoints')
    const [name, entity] = bind.split(':');
    const schema = endpoints[name]
    const debounceTime = schema.debounceTime;

    const entitySchema = schema.entities[entity];

    const validation = entitySchema.validation || (() => true);
    const errors = entitySchema.errors || (() => ({}))
    const transform = entitySchema.transform || ( x => x)
    
    const m = remoteMachineFactory({ transform, onCreated, id, schema, entity, validation, entitySchema, debounceTime});

    const {state, send} = useMachine(m);

    return {
        state,
        errors,
        reset: () => send('RESET'),
        flush: () => send('FLUSH'),
        update: (item) => send('TYPE', {data: cloneDeep(item)})
    }
}


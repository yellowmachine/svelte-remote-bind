import { remoteMachineFactory } from './machine'
import { useMachine } from '@xstate/svelte';
import { getContext } from 'svelte';

export default function useRemoteBind({id=null, bind}){
    const endpoints = getContext('machines')
    const [name, entity] = bind.split(':');
    const schema = endpoints[name]

    const { validation, errors } = schema.entities[entity];
    const entitySchema = schema.entities[entity];
    const m = remoteMachineFactory({id, schema, entity, validation, entitySchema});

    const {state, send} = useMachine(m);

    return {
        state,
        errors,
        update: (item) => send('TYPE', {data: item})
    }
}


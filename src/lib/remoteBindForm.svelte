<script>
    import { remoteMachineFactory } from './machine'
    import { useMachine } from '@xstate/svelte';
    import { getContext } from 'svelte';

    export let id = null;
    export let remoteBind;

    const endpoints = getContext('machines')
    const [name, entity] = remoteBind.split(':');
    const schema = endpoints[name]
    
    const { validation, errors } = schema.entities[entity];
    const entitySchema = schema.entities[entity];
    const m = remoteMachineFactory({id, schema, entity, validation, entitySchema});
    
    const { state, send } = useMachine(m);
    export let item;

    $: send('TYPE', {data: {...item}}) 
    
</script>
  
<form>
   <slot state={$state.value} verrors={errors({...item})} />
</form>

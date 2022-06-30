<script>
    import { remoteMachineFactory } from './machine'
    import { useMachine } from '@xstate/svelte';
    import { getContext } from 'svelte';

    export let id = null;
    export let remoteBind;

    const endpoints = getContext('remoteBindEndpoints')
    const [name, entity] = remoteBind.split(':');
    const schema = endpoints[name]
    const debounceTime = schema.debounceTime;
    
    const { validation, errors } = schema.entities[entity];
    const entitySchema = schema.entities[entity];
    const m = remoteMachineFactory({id, schema, entity, validation, entitySchema, debounceTime});
    
    const { state, send } = useMachine(m);
    export let item;

    $: send('TYPE', {data: item}) 
    
</script>
  
<form>
   <slot flush={() => send('FLUSH')} state={$state.value} verrors={errors(item)} />
</form>

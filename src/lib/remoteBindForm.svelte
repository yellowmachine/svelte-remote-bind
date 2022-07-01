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

    const entitySchema = schema.entities[entity];

    const validation = entitySchema.validation || (() => true);
    const errors = entitySchema.errors || (() => ({}))
    const transform = entitySchema.transform || ( x => x)
    
    const onCreated = entitySchema.onCreated;
    const m = remoteMachineFactory({ transform, onCreated, id, schema, entity, validation, entitySchema, debounceTime});
    
    const { state, send } = useMachine(m);
    export let item;

    $: send('TYPE', {data: item}) 
    
</script>
  
<form>
   <slot reset={() => send('RESET')} flush={() => send('FLUSH')} state={$state.value} errors={errors(item)} />
</form>

<script>
    //import { debounce } from "debounce";
    import { remoteMachineFactory } from './machine'
    import { useMachine } from '@xstate/svelte';
    import { getContext } from 'svelte';

    export let id = null;
    export let remoteBind;

    const { machines } = getContext('machines')
    const [name, entity] = remoteBind.split(':');
    const schema = machines[name]
    const T = schema.debounceTime || 1000;
    
    const { validation, errors } = schema.entities[entity];
    const m = remoteMachineFactory({id, schema, entity});
    
    const { state, send } = useMachine(m);
    export let item;
    let pristine = true;

    //const debouncedSend = debounce(send, T)

    $:{
        if(pristine) pristine = false
        else if(validation(item)) send('TYPE', {data: item}) //debouncedSend('TYPE', {data: item}) 
    } 
    
</script>
  
<form>
    <slot state={$state.value} verrors={errors(item)} />
</form>

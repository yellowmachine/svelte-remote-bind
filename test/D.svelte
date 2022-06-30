<script lang="ts">
    import { setContext } from 'svelte';
    import { useRemoteBind } from '../src/lib';
    
    export let endpoint;

    setContext("machines", {
        endpoint
    });

    let cat = {name: 'fuffy', age: 1 }
    
    const {state, update: updateMyCat} = useRemoteBind({bind: 'endpoint:cat'})

    $: updateMyCat(cat)

</script>

<button on:click={() => cat.age++}>age++</button>
<div data-testid="my-state-test-id">State: {$state.value}, age: {cat.age}</div>


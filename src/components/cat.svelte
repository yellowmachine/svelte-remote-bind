<script>
    import { useRemoteBind } from '$lib';
    
    export let onCreated;

    let cat = {name: '', age: 1 } 

    const {state, flush, update, reset} = useRemoteBind({onCreated, bind: 'endpoint:cat'})

    function resetCat(){
        cat = {name: '', age: 1 }
        reset()
    }

    let colors = {
        idle: 'gray',
        fetching: 'orange',
        error: 'red'
    }

    $: update(cat)
</script>

<div>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
    {#if $state.value === 'debouncing'}
        <button class="btn btn-active btn-accent" on:click={flush}>Save!</button>
    {/if}
    <button class="btn btn-error" on:click={resetCat}>Reset!</button>
    <div class={'text-' + colors[$state.value]}>State of cat: {$state.value}</div>
</div>

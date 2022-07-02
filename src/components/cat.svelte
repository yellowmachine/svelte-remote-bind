<script>
    import { useRemoteBind } from '$lib';
    
    export let onCreated;

    let cat = {name: '', age: '' } 

    const {state, errors, flush, update, reset} = useRemoteBind({onCreated, bind: 'endpoint:cat'})

    function resetCat(){
        cat = {name: '', age: '' }
        reset()
    }

    let colors = {
        idle: 'gray',
        debouncing: 'yellow',
        fetching: 'blue',
        error: 'red'
    }

    let formErrors = []

    $: update(cat)
    $: stateColor = `text-[color:${colors[$state.value]}]`
    $: {
        let err = errors(cat).getErrors()
        console.log('***', err)
        formErrors = [].concat(err.name || [], err.age || [])
    }

</script>

<div>
    <div>
        <input placeholder="Name" type="text" bind:value={cat.name} />
    </div>
    <div class="mt-3 mb-3">
        <input placeholder="Age" type="number" bind:value={cat.age} />
    </div>
    <ul class="ml-10 mb-3 text-[color:pink]">
        {#each formErrors as err}
            <li>
                {err}
            </li>
        {/each}
    </ul>
    <div>
        {#if $state.value === 'debouncing'}
            <button class="btn btn-active btn-accent" on:click={flush}>Save!</button>
        {/if}
        <button class="btn btn-error" on:click={resetCat}>Reset!</button>
        <div class={stateColor}>State of cat: {$state.value}</div>
    </div>
</div>

<script>
    import { useRemoteBind } from '$lib';
    import { create, test, enforce } from 'vest';
    
    export let onCreated;

    const suite = create((data = {}) => {
        test('name', 'Name is required', () => {
            enforce(data.name).isNotBlank();
        });

        test('age', 'Age is required', () => {
            enforce(data.age).isNotBlank();
        });

        test('age', 'Age is a number', () => {
            enforce(data.age).isNumeric();
        });

    });

    let cat = {name: '', age: 1 } 

    const {state, flush, update, reset} = useRemoteBind({onCreated, bind: 'endpoint:cat'})

    $: update(cat)
</script>

<div>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
    {#if $state.value === 'debouncing'}
        <button on:click={flush}>Save!</button>
    {/if}
    <div>State of cat: {$state.value}</div>
    <button on:click={reset}>reset!</button>
</div>

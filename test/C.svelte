<script lang="ts">
    import { setContext } from 'svelte';
    import { RemoteForm} from '../src/lib';
    export let endpoint;

    setContext("machines", {
        endpoint
    });

    let cat = {name: 'fuffy', age: 1 } 

</script>

<div data-testid="my-test-id">It's my cat {cat.name}</div>

<button on:click={() => cat.name = 'foo'}>button</button>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:state let:verrors>
    <label for="cat-name">my cat</label>
    Name: <input id="cat-name" type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
    <div>State: {state}</div>
    <div>Errors: {JSON.stringify(verrors.tests)}</div>
</RemoteForm>


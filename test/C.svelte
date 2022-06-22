<script lang="ts">
    import { setContext } from 'svelte';
    import { RemoteForm} from '../src/lib';
    export let endpoint;

    console.log("**************************", endpoint)

    setContext("machines", {
        endpoint
    });

    let cat = {name: 'fuffy', age: 1 } 

</script>

<div>It's my cat ;)</div>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:state let:verrors>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
    <div>State: {state}</div>
    <div>Errors: {JSON.stringify(verrors.tests)}</div>
</RemoteForm>


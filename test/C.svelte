<script lang="ts">
    import {RemoteForm} from '../src/lib';
    import { setContext } from 'svelte';

    let machines = {
        fetch,
        token: async () => "Bearer ABC",
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            cat: {
                path: "/cat",
                validation: () => true,
                errors: () => ({}),
                key: "id"
            }
        }
    }

    setContext("machines", {
        machines
    });
    
    let cat = {name: 'fuffy', age: 1 } 

</script>

<div>{cat.name}: It's my cat ;)</div>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:state let:verrors>
    Name: <input id="name" type="text" bind:value={cat.name} />
    Age: <input id="age" type="number" bind:value={cat.age} />
    <div>State: {state}</div>
    <div>Errors: {JSON.stringify(verrors)}</div>
</RemoteForm>

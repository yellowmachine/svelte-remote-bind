<script lang="ts">
    import { setContext } from 'svelte';
    import { RemoteForm} from '../src/lib';

    let endpoint = {
        fetch,
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            cat: {
                path: "/cat", //default to ""
                validation: (data) => true, //default to () => true
                errors: (data) => ({}), //default to () => ({})
                key: "id" //default to "id", it can be a function like (data) => data.cat.id if your are going to use it yourself in your custom fetch
            }
        }
    }

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


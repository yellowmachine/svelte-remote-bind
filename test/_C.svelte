<script lang="ts">
    import {register, RemoteForm} from '../src/lib';

    let schema = {
        delay: 1,
        token: async () => "Bearer ABC",
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            cat: {
                path: "/cat",
                validation: (data) => data.name.endsWith("ffy"),
                errors: (data) => {
                    if(!data.name.endsWith("ffy"))
                        return {name: "Not valid name"}
                    return {}
                },
                key: "id"
            }
        }
    }

    register(schema)
    let cat = {name: 'fuffy', age: 1 } 

</script>

<div>It's my cat ;)</div>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:status let:verrors>
    Name: <input id="name" type="text" bind:value={cat.name} />
    Age: <input id="age" type="number" bind:value={cat.age} />
    <div>Status: {status}</div>
    <div>Errors: {JSON.stringify(verrors)}</div>
</RemoteForm>

<script lang="ts">
    import {register, RemoteFormMocked} from '$lib';

    let schema = {
        name: "endpoint",
        baseUrl: "http://localhost/api",
        entities: {
            cat: {
                path: "/cat",
                validation: (values) => true,
                setId: (data) => data.id
            }
        }
    }

    register(schema)
    let cat = {name: 'fuffy', age: 1}

</script>

<RemoteFormMocked remoteBind="endpoint:cat" bind:item={cat}>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
</RemoteFormMocked>

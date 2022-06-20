# svelte-remote-bind

### alert: this is a draft, there's still no beta npm package

(this is a svelte-kit project, so: npm i && npm run dev)

[Demo](https://svelte-remote-bind.surge.sh)

Do you want to write some code like?

```js
<script lang="ts">

    import {register, RemoteForm} from '$lib';
    import { create, test, enforce } from 'vest';

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

    let schema = {
        //default to fetch
        fetch: async ({url, headers, method, body, entitySchema}) => {
            //entitySchema is useful when doing a GraphQL query 
            //example:
            let query = method === 'POST' ? entitySchema.addQuery : entitySchema.updateQuery;
            const response = await GraphQLClient.fetch({url, query, headers, variables: body});
            return entitySchema.key(response)
        },
        delay: 1000, //default to 1000
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            cat: {
                path: "/cat", //default to ""
                validation: (data) => suite(data).isValid(), //default to () => true
                errors: (data) => suite(data), //default to () => ({})
                key: "id" //default to "id", it can be a function like (data) => data.cat.id if your are going to use it yourself in your custom fetch
            }
        }
    }

    register(schema)
    let cat = {name: 'fuffy', age: 1 } 

</script>

<div>It's my cat ;)</div>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:status let:verrors>
    Name: <input class="input input-bordered w-full max-w-xs" type="text" bind:value={cat.name} />
    Age: <input class="input input-bordered w-full max-w-xs" type="number" bind:value={cat.age} />
    <div class={`${status}`}>Status: {status}</div>
    <div>Errors: {JSON.stringify(verrors.tests)}</div>
</RemoteForm>
```

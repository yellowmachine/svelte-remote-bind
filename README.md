# svelte-remote-bind

```bash
npm i svelte-remote-bind
```

or

```bash
yarn add svelte-remote-bind
```

(this is a svelte-kit project, so, to see the demo working: yarn && yarn dev)

[Demo](https://svelte-remote-bind.surge.sh)

Do you want to write some code like this?

```js
<script lang="ts">
    import { setContext } from 'svelte';
    import { RemoteForm} from 'svelte-remote-bind';
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

    let endpoint = {
        //default to fetch
        fetch: async ({id, url, headers, method, body, entitySchema}) => {
            //entitySchema is useful when doing a GraphQL query 
            //example:
            let query = method === 'POST' ? entitySchema.addQuery : entitySchema.updateQuery;
            url = method === 'POST' ? url: url + '/' + id;
            const response = await GraphQLClient.fetch({url, query, headers, variables: body});
            return entitySchema.key(response)
        },
        debounceTime: 1000, //default to 1000
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            cat: {
                path: "/cat", //default to ""
                validation: (data) => suite(data).isValid(), //default to () => true
                errors: (data) => suite(data), //default to () => ({})
                key: (data) => data.cat.id //default to "id"
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
    Name: <input class="input input-bordered w-full max-w-xs" type="text" bind:value={cat.name} />
    Age: <input class="input input-bordered w-full max-w-xs" type="number" bind:value={cat.age} />
    <div class={`${state}`}>State: {state}</div>
    <div>Errors: {JSON.stringify(verrors.tests)}</div>
</RemoteForm>
```

Implementation: The actual implementation is with xstate.

![machine](https://stately.ai/registry/machines/f439b6a7-9ede-4efc-96f7-6f34acc4261f.png)

To run tests:

```bash
yarn test
```
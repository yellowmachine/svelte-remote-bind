# svelte-remote-bind

### alert: this is a draft, there's still no beta npm package

(this is a svelte-kit project, so: npm i && npm run dev)

[Demo] (https://svelte-remote-bind.surge.sh)

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
        //fetch: async ({url, headers, method, body}) => , //you can overwrite default fetch
        name: "endpoint",
        baseUrl: "http://localhost/api",
        entities: {
            cat: {
                path: "/cat",
                validation: (data) => suite(data).isValid(),
                errors: (data) => suite(data),
                key: "id"
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

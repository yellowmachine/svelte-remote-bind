# svelte-remote-bind

### alert: this is a draft, there's still no beta npm package

(this is a svelte-kit project, so: npm i && npm run dev)

Do you want to write some code like?

```js
<script lang="ts">
    import {register, RemoteForm} from '$lib';
    import { create, test, enforce } from 'vest';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const suite = create((data = {}) => {
        test('name', 'Name is required', () => {
            enforce(data.name).isNotBlank();
        });

        test('age', 'Age is required', () => {
            enforce(data.name).isNotBlank();
        });

        test('age', 'Age is a number', () => {
            enforce(data.name).isNumeric();
        });

    });

    ...

    let schema = {
        fetch: async ({url, headers, method, body}) => {
            await sleep(2000)
            if(returnCode === 400)
                throw "Error"
            else 
                return {id: 1}
        },
        name: "endpoint",
        baseUrl: "http://localhost/api",
        entities: {
            cat: {
                path: "/cat",
                validation: (data) => suite(data).isValid(),
                key: "id"
            }
        }
    }

    register(schema)
    let cat = {name: 'fuffy', age: 1}

</script>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat}>
    Name: <input class="input input-bordered w-full max-w-xs" type="text" bind:value={cat.name} />
    Age: <input class="input input-bordered w-full max-w-xs" type="number" bind:value={cat.age} />
</RemoteForm>
```

This is the core of the package:

```js
async function handle(x){

```

In other words, item data is buffered till the stream is busy saving, then when it finish, the last item of the buffer is taken and goes on to be saved.

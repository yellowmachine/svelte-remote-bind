# svelte-remote-bind

This is a svelte-kit project, so to see the demo working: ```yarn dev```.

[Demo](https://svelte-remote-bind.surge.sh)

The aim of this project is to bind an object to a remote endpoint so a POST or PUT is done automatically while typing. There's a state machine with states: idle, debouncing, saving, error and saved.

You can even have related entities, like parent and child, and if a child is created, the array parent field is updated remotely. For example a person have an array of owned cats, and that person buys a new cat.

```svelte
//person.svelte
<script>
let person = {name: 'yellowman', cats: []}

function addCat(cat){
    person.cats = [...person.cats, cat]
}

const { update} = useRemoteBind({id: 1, bind: 'endpoint:person'})

$: update(person)
</script>

<div>Buy a new cat</div>

<Cat onCreated={addCat} />

<div>
    <span>Cats of yellow man:</span>
    <ul>
	{#each person.cats as cat}
		<li>
			{cat.id}, {cat.name}
		</li>
	{/each}
    </ul>
</div>
```

```svelte
// cat.svelte
<script>
export let onCreated;

let cat = {name: '', age: 1 } 

const {state, flush, errors, update, reset} = useRemoteBind({onCreated, bind: 'endpoint:cat'})

$: update(cat)
</script>

<div>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
    {#if $state.value === 'debouncing'}
        <button on:click={flush}>Save!</button>
    {/if}
    <button on:click={reset}>Reset</button>
</div>
```

The rest of the code would be:

```svelte
<script lang="ts">
    import Person from './person.svelte';
    import { setContext } from 'svelte';
    import { create, test, enforce } from 'vest';

    //vest for example for validation
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
        fetch: async ({id, url, headers, method, body, entitySchema}) => {
            //entitySchema is useful when doing a GraphQL query 
            //example:
            const query = method === 'POST' ? entitySchema.addQuery : entitySchema.updateQuery;
            const variables = // create with id and body
            const response = await GraphQLClient.fetch({url, query, headers, variables});
            return entitySchema.key(response)
        },
        debounceTime: 1000, //default to 1000
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "https://my-backend/api",
        entities: {
            person: {
                path: "/person", 
                transform: (data) => {
                    return {...data, cats: data.cats.map(x=>x.id)}
                }
                ...
            },
            cat: {
                path: "/cat", //default to ""
                addQuery: ...,
                updateQuery: ...,
                validation: (data) => suite(data).isValid(), //default to () => true
                errors: (data) => suite(data).getErrors(), //default to () => ({})
                key: (data) => data.cat.id //default to "id"
            }
        }
    }

    setContext("remoteBindEndpoints", {
        endpoint
    }); 

</script>

<Person />
```

This is an alternative (not recommended and maybe will not exist on production ready package):

```svelte
<RemoteForm remoteBind="endpoint:cat" bind:item={cat} let:state let:errors let:flush >
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
</RemoteForm>
```

Implementation: The actual implementation is with [xstate](https://xstate.js.org/).

[Link to state machine](https://stately.ai/viz/f439b6a7-9ede-4efc-96f7-6f34acc4261f)

The example uses [vest](https://vestjs.dev/) to validate forms.

TODO:

a demo with a model (one source of truth) like 

```js
let person = {
    id: 9,
    name: 'yellow man',
    cats: [{name: 'fuffy', age: 1}]
}
```

and the svelte files *person.svelte*, *catList.svelte* and *cat.svelte*. If you add or remove a cat, person triggers automatically a save, but not when you change the name of an owned cat. 

There's no need to add extra functionality to the package to do that demo. The key is to have:

```js
transform: (data) => {
    return {...data, cats: data.cats.map(x => x.id).filter(x => x !== undefined)}
}
...

function onCreatedCat(cat){
    //update the cat in the array without id
    person.cats[0].id = cat.id
    person = person
}
...
//so you guess there's a need to unsifht a cat clicking on a button for example inside catList
```

To run tests:

```bash
yarn test
```

### Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/yellowmachine>
            <img src=https://avatars.githubusercontent.com/u/107049630?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=yellowmachine/>
            <br />
            <sub style="font-size:14px"><b>yellowmachine</b></sub>
        </a>
    </td>
</tr>
</table>


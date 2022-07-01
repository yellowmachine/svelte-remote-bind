<script>
    import "../app.css";
    import { setContext } from 'svelte';
    
    import { useRemoteBind } from '$lib';
    import Cat from '../components/cat.svelte'

    import { create, test, enforce } from 'vest';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

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

    let returnCode = 200;
    
    function setOk(){
        returnCode = 200;
    }

    function setError(){
        returnCode = 400;
    }

    let count = 1;

    let endpoint = {
        //default to fetch
        fetch: async ({url, token, method, body}) => {
            //mock fetch
            await sleep(2000)
            if(returnCode === 400)
                throw "Error"
            else 
                return {id: count++}
        },
        debounceTime: 1000, //default to 1000
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "http://localhost:8080/api",
        entities: {
            person: {
                path: "/person"
            },
            cat: {
                path: "/cat", //default to ""
                validation: (data) => suite(data).isValid(), //default to () => true
                errors: (data) => suite(data), //default to () => ({})
                key: "id" //default to "id", it can be a function like (data) => data['cat']['id']
            }
        }
    }

    setContext("remoteBindEndpoints", {
        endpoint
    });


    let person = {name: 'yellowman', cats: []}

    function addCat(cat){
        console.log('*** add cat called')
        person.cats.push(cat)
        person = person
    }

    const { state, update} = useRemoteBind({id: 1, bind: 'endpoint:person'})

    $: update(person)
</script>

<a class="link" href="https://github.com/yellowmachine/svelte-remote-bind">Link to repo</a>

<p/>

<Cat onCreated={addCat} />

<div>
    <span>Id cats of yellow man:</span>
    <ul>
	{#each person.cats as cat}
		<li>
			Id: {cat.id}
		</li>
	{/each}
    </ul>
    <div>State of Person: {$state.value}</div>
</div>

<div>
    <div class={returnCode === 200 ? 'success': 'failed'}>return code: {returnCode}</div>
    <button class="btn btn-error" on:click={setError}>I want server to return error</button>
    <button class="btn btn-success" on:click={setOk}>I want server to return success</button>    
</div>


<style>
    .success{
        color: green;
    }

    .failed{
        color: red;
    }

    .idle{
        color: gray;
    }

    .fetching{
        color: orange;
    }

    .error{
        color: red;
    }

    .alert{
        color: red;
    }

</style>

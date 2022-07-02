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
            console.log('fetch is called with:', url, token, method, body)
            await sleep(2000)
            if(returnCode === 400)
                throw "Error"
            else 
                return {id: count++}
        },
        debounceTime: 1000, //default to 1000
        token: async () => "Bearer ABC", //default to null
        name: "endpoint",
        baseUrl: "http://my-backend/api",
        entities: {
            person: {
                path: "/person",
                transform: (data) => {
                    console.log('data on person transform', data)
                    return {...data, cats: data.cats.map(x=>x.id)}
                }
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

    let colors = {
        idle: 'gray',
        fetching: 'orange',
        error: 'red'
    }

    let person = {name: 'yellowman', cats: []}

    function addCat(cat){
        person.cats.push(cat)
        person = person
    }

    const { state, update} = useRemoteBind({id: 1, bind: 'endpoint:person'})

    $: update(person)
</script>

<a class="link" href="https://github.com/yellowmachine/svelte-remote-bind">Github repo</a>

<div class="flex h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
    <div class="m-auto">
        <div>
            <span>Cats of yellow man:</span>
            <ul>
            {#each person.cats as cat}
                <li>
                    {cat.id}, {cat.name} 
                    (cat name is not updated because yellow man is only informed on created. See TODO on documentation.
                    )
                </li>
            {/each}
            </ul>
        </div>
        <div>Buy a new cat</div>
        <Cat onCreated={addCat} />
        <div class={'text-' + colors[$state.value]}>State of Yellow Man: {$state.value}</div>
        
        <div>
            <button class="btn btn-error" on:click={setError}>I want server to return error</button>
            <button class="btn btn-success" on:click={setOk}>I want server to return success</button>    
            <div class={returnCode === 200 ? 'text-green': 'text-red'}>return code: {returnCode}</div>
        </div>
    </div>
</div>

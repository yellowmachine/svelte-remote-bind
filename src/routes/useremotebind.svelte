<script>
    import "../app.css";
    import { setContext } from 'svelte';
    import Person from '../components/person.svelte'
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));

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
        fetch: async ({url, body}) => {
            //mock fetch
            await sleep(2000)
            console.log(`fetch called with body ${body} and url ${url}`)
            if(returnCode === 400)
                throw "Error"
            else 
                return {...body, id: count++}
        },
        debounceTime: 3000, //default to 1000
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
</script>

<a class="link" href="https://github.com/yellowmachine/svelte-remote-bind">Link to repo</a>

<div class="alert">(debounce time is 3 seconds)</div>

<Person />

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

<script lang="ts">
    import "../app.css";

    import {register, RemoteForm} from '$lib';
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

    let schema = {
        /*
        fetch: async ({url, headers, method, body}) => {
            await sleep(2000)
            if(returnCode === 400)
                throw "Error"
            else 
                return {id: 1}
        },
        */
        token: async () => "ABC",
        name: "endpoint",
        baseUrl: "http://localhost/api:8080",
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

    .initial{
        color: gray;
    }

    .saving{
        color: orange;
    }

    .error{
        color: red;
    }

    .saved{
        color: green;
    }

</style>

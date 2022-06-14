<script lang="ts">
    import {register, RemoteForm} from '$lib';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    let returnCode = 200;
    
    function setOk(){
        returnCode = 200;
    }

    function setError(){
        returnCode = 400;
    }

    let schema = {
        fetch: async () => {
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
                validation: () => true,
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

</style>
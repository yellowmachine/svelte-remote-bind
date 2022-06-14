<script>
    import fetchMock from 'fetch-mock';
    import {register, RemoteForm} from '$lib';

    let serverStatus;
    
    function setOk(){
        serverStatus = 200;
        fetchMock.post('http://localhost/api/cat', { id: 1 }, {
            delay: 1000, 
        });

        fetchMock.put('http://localhost/api/cat/1', { id: 1 }, {
            delay: 1000, 
        });
    }

    function setError(){
        serverStatus = 400;
        fetchMock.post('http://localhost/api/cat', 400, {
            delay: 1000, 
        });

        fetchMock.put('http://localhost/api/cat/1', 400, {
            delay: 1000, 
        });
    }

    setOk()

    schema = {
        name: "endpoint",
        baseUrl: "http://localhost/api",
        entities: {
            cat: {
                path: "/cat",
                validation: (values) => true,
                setId: (data) => data.id
            }
        }
    }

    register(schema)
    let cat = {name: 'fuffy', age: 1}

</script>

<RemoteForm remoteBind="endpoint:cat" bind:item={cat}>
    Name: <input type="text" bind:value={cat.name} />
    Age: <input type="number" bind:value={cat.age} />
</RemoteForm>

<div>
    <div class={serverStatus === 200 ? 'success': 'failed'}>server status: {serverStatus}</div>
    <button class="btn btn-error" on:click={setError()}>I want server to return error</button>
    <button class="btn btn-success" on:click={setOk()}>I want server to return success</button>    
</div>

<style>
    .success{
        color: green;
    }

    .failed{
        color: red;
    }

</style>
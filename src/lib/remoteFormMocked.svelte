<script>
    import {RESTClientMocked, stream, fromSchema} from '$lib'
    
    export let id = null;
    export let remoteBind;
    
    let {url, validation, setId} = fromSchema(remoteBind)
    
    const client = RESTClientMocked({url, setId});
    const { save, status} = stream({client, id})
    
    export let item;
    
    let serverStatus;
    
    function setOk(){
        serverStatus = 200;
        client.setOk()
    }

    function setError(){
        serverStatus = 400;
        client.setError()
    }

    $: if(validation(item)) save(id, item)
</script>
    
<form>
    <slot {status} />
</form>

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

<script lang="ts">
    import "../app.css";
    //import {error, success} from './store'
    import {mockClient} from '$lib'
    import Cat from '$components/catForm.svelte'

    let serverStatus = 200
    mockClient.setOk()

    function serverReturnsError(){
        serverStatus = 500
        mockClient.setError()
    }

    function serverReturnsSuccess(){
        serverStatus = 200
        mockClient.setOk()
    }

</script>
    
<a class="link" href="/restcat">Go to REST example</a>
<p />
<h1 class="text-xl">GraphQL example</h1>

<Cat />

<div>
    <div class={serverStatus === 200 ? 'success': 'failed'}>server status: {serverStatus}</div>
    <button class="btn btn-error" on:click={serverReturnsError}>I want server to return error</button>
    <button class="btn btn-success" on:click={serverReturnsSuccess}>I want server to return success</button>    
</div>

<!--
<div class="alert alert-error shadow-lg">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error.msg}</span>
    </div>
</div>

<div class="alert alert-success shadow-lg">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{success.msg}</span>
    </div>
</div>
-->

<style>
    .success{
        color: green;
    }

    .failed{
        color: red;
    }

</style>
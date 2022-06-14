<script lang="ts">
    import "../app.css";
    import {mockClient} from '$lib'
    import Cat from '$components/catForm.svelte'
    //import { apiServerUrl } from '$components/apiServerUrl'

    let serverStatus = 200

    function serverReturnsError(){
        serverStatus = 500
        mockClient.setError()
    }

    function serverReturnsSuccess(){
        mockClient.setOk()
        serverStatus = 200
    }

</script>
    
<Cat />

server status: {serverStatus}

<button class="btn" on:click={serverReturnsError}>I want server to return error</button>
<button class="btn" on:click={serverReturnsSuccess}>I want server to return success</button>

<script lang="ts">
    import {mockClient} from '$lib'
    import Cat from '$components/catForm.svelte'
    //import { apiServerUrl } from '$components/apiServerUrl'

    let serverStatus = 200

    function serverReturnsError(){
        serverStatus = 500
        mockClient.setError = true
    }

    function serverReturnsSuccess(){
        mockClient.setError = false
        serverStatus = 200
    }

</script>
    
<Cat />

server status: {serverStatus}

<button on:click={serverReturnsError}>I want server to return error</button>
<button on:click={serverReturnsSuccess}>I want server to return success</button>

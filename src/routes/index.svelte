<script lang="ts">
    import fetchMock from 'fetch-mock';
    import Cat from '$components/catForm.svelte'
    import { apiServerUrl } from '$components/apiServerUrl'

    let serverStatus = 200

    function serverReturnsError(){
        serverStatus = 500
        fetchMock.mock(apiServerUrl, serverStatus)
    }

    function serverReturnsSuccess(){
        serverStatus = 200
        fetchMock.mock(apiServerUrl, serverStatus)
    }

</script>
    
<Cat />

server status: {serverStatus}

<button on:click={serverReturnsError}>I want server to return error</button>
<button on:click={serverReturnsSuccess}>I want server to return success</button>

<script lang="ts">
    import fetchMock from 'fetch-mock';
    import Cat from '$components/catForm.svelte'
    import { apiServerUrl } from '$components/apiServerUrl'

    function serverReturnsError(){
        fetchMock
        .mock(apiServerUrl, 500)
    }

    function serverReturnsSuccess(){
        fetchMock
        .mock(apiServerUrl, 200)
    }

</script>
    
<Cat />

<button on:click={serverReturnsError}>I want server to return error</button>
<button on:click={serverReturnsSuccess}>I want server to return success</button>

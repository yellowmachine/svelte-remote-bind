<script>
import {RESTClient, stream, fromSchema} from '$lib'

export let id = null;
export let remoteBind;

let {url, validation, setId} = fromSchema(remoteBind)

const client = RESTClient({url, setId});
const { save, status} = stream({client, id})

export let item;

$: if(validation(item)) save(id, item)
</script>

<form>
    <slot {status} />
</form>

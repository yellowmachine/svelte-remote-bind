<script>
import {RESTClient, stream, fromSchema} from '$lib'

export let id = null;
export let remoteBind;

let {url, validation, key, myfetch} = fromSchema(remoteBind)

const client = RESTClient({url, key, myfetch});
const { save, status} = stream({client, id})

export let item;

$: if(validation(item)) save(id, item)
</script>

<form>
    <slot {status} />
</form>

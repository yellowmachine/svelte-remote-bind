<script>
import {RESTClient, stream, fromSchema} from '$lib'

export let id = null;
export let remoteBind;

let {url, validation, errors, key, myfetch} = fromSchema(remoteBind)

const client = RESTClient({url, key, myfetch});
const { save, status} = stream({client, id})

export let item;

$: if(validation(item)) save(id, item)
$: {
    item._status = $status
    item = item
}
/*
$: {
    item._verrors = errors(item)
    item = item
}
*/
</script>

<form>
    <slot {status} verrors={errors(item)} />
</form>

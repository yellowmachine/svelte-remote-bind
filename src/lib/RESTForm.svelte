<script>
import {RESTClient} from './clients';
import {stream, fromSchema} from './bind';

export let id = null;
export let remoteBind;

let {url, validation, errors, key, myfetch} = fromSchema(remoteBind)

const client = RESTClient({url, key, myfetch});
const { save, status} = stream({client, id})

export let item;

$: if(validation(item)) save(item) //id, item

</script>

<form>
    <slot status={$status} verrors={errors(item)} />
</form>

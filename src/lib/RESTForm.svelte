<script>
import {RESTClient} from './clients';
import {stream, fromSchema} from './bind';

export let id = null;
export let remoteBind;

let {url, validation, errors, key, myfetch, token, delay, entitySchema} = fromSchema(remoteBind)

const client = RESTClient({url, key, myfetch, token, entitySchema});
const { save, status} = stream({client, id, delay})

export let item;

$: if(validation(item)) save(item) //id, item

</script>

<form>
    <slot status={$status} verrors={errors(item)} />
</form>

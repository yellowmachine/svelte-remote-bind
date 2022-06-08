<script>
import streamFn, {GQClient} from '$lib/bind'
import { apiServerUrl } from '$components/apiServerUrl'
import { gql } from 'graphql-request'
import { create, test, enforce } from 'vest';
//import { useAuth0 } from "$src/services/auth0";

//const { getAccessToken } = useAuth0;


const postQuery = gql`
mutation MyMutation($input: [AddCatInput!]!) {
  addCat(input: $input) {
    numUids
    cat {
      catID
      name
      age
    }
  }
}
`

const putQuery = gql`
mutation MyMutation2($input: UpdateCatInput!) {
  updateCat(input: $input) {
    cat {
      age
      catID
      name
    }
  }
}
`

const put = (values, id, c) => c.request(putQuery, {
                "input": {
                  "filter": {"catID": id},
                  "set": values
                }
              })

const post = (values, c) => c.request(postQuery, {
                "input": [
                  values
                ]
              })

const setId = (data) => data.addCat.cat[0].catID

const client = GQClient({apiServerUrl, token: null, put, post, setId})

const suite = create((data = {}) => {
  test('name', 'Username is required', () => {
    enforce(data.name).isNotBlank();
  });

  test('age', 'Age is required', () => {
    enforce(data.name).isNotBlank();
  });

  test('age', 'Age is a number', () => {
    enforce(data.name).isNumeric();
  });

});
 
//const client = Client({apiServerUrl, token: null})
const { saveImmediately, save, status} = streamFn({client, id: null})

let item = {name: null, age: null};

function isValid(item){
    console.log(suite(item))
    return suite(item).isValid()
}

$: if(isValid(item)) save(item)

</script>
  
<form>
    <div>
        <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
        <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
    </div>
</form>

{$status}

{#if $status === 'error' && isValid(item)}
    <button on:click={()=>saveImmediately(item)} class="btn btn-active btn-accent">Guardar inmediatamente</button>
{/if}

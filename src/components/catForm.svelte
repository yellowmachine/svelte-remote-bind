<script>
import {mockClient, GQClient, stream} from '$lib'
//import {error, success} from './store'
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

//const setId = (data) => data.addCat.cat[0].catID
//const client = GQClient({apiServerUrl, token: null, put, post, setId})

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
 
const { saveImmediately, save, status} = stream({client: mockClient, id: null})

let item = {name: null, age: null};

function isValid(item){
    return suite(item).isValid()
}

$: if(isValid(item)) save(item)
//$: if(status === 'error') error.timeout("Error saving data :(")
//$: if(status === 'saved') success.timeout("Data saved!")

</script>
  
<form>
    <div class={`${status}`}>
        Name: <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
        Age: <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
    </div>
</form>

<div>
  Cat status: {$status}

  {#if $status === 'error' && isValid(item)}
      <button on:click={()=>saveImmediately(item)} class="btn btn-active btn-accent">Guardar inmediatamente</button>
  {/if}
</div>

<style>
  .saved{
      color: green;
  }

  .saving{
    color: orange;
  }

  .error{
      color: red;
  }

</style>
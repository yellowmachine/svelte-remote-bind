# svelte-remote-bind

### alert: this is beta version

Do you want to write some code like?

```js
//cat.svelte
<script>
// const { save, status} = ...
let item = {name: null, age: null};

function isValid(item){
    return ...//
}

$: if(isValid(item)) save(item) //it saves to your remote database

</script>
  
<form>
    <div>
        <input type="text" bind:value={item.name} />
        <input type="number" bind:value={item.age} />  
    </div>
</form>
```

I can give you a client (for example a GraphQL Client)

and you instantiate like this:

```js
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

const { saveImmediately, save, status} = streamFn({client, id: null})
```

where:

```js
import streamFn, {GQClient} from '$lib/bind'
import { apiServerUrl } from '$components/apiServerUrl'

const postQuery = gql`
mutation mutadd($input: [AddCatInput!]!) {
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
mutation mutupdate($input: UpdateCatInput!) {
  updateCat(input: $input) {
    cat {
      age
      catID
      name
    }
  }
}
`
```
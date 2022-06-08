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

This is the core of the package:

```js
async function handle(x){
  try{
      status.set("saving")	
      const c = client()
      let response;
      let values = x.at(-1);
      if(id){
        response = await c.put(values, id)
      }else{
        response = await c.post(values)
      }            
      status.set("saved")	
      success.timeout("saved!")
      if(!id){
        id = c.setId(response);
      }
      return response;            
  } catch(err){
      console.log('%c error! ', 'background: #222; color: #e62558');
      console.log(err)
      status.set("error")
      error.timeout("error :(")
      return {error: err}
  }finally {
      pauser.next(false)
  }
}

//...

const pauser = new Subject()
const stream = new Subject()

const subscription = stream.pipe(
  skip(1),
  debounceTime(T),
  buffer(pausableInterval(pauser)),
  switchMap((x) => {
    if(x.length > 0) return from(handle(x))
    return NEVER  
  })
).subscribe({
  //...
});	

//...

function pausableInterval(pauser) {    
    return pauser.pipe(switchMap((paused) => {
      if(paused){
        return NEVER
      }else{
        return interval(T)
      }
    }
  )
)}
```

In other words, item data is buffered till the stream is busy saving, then when it finish, the last item of the buffer is taken and goes on to be saved.
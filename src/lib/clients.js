import { GraphQLClient } from 'graphql-request'

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function MockClient({setId}){
  let error = false  
  return {
    setError: () => error = true,
    setOk: () => error = false,  
    put: async (values) => {
      await sleep(1000)
      if(error)
          throw "Error"
      else return 'ok'
    },
    post: async (values) => {
      await sleep(1000)
      if(error)
          throw "Error"
      else return {id: 1}
    },
    setId
  }
}

export const mockClient = MockClient({setId: (data) => data.id}) 

export async function GQClient({apiServerUrl, token, put, post, setId}){
  if(token){
    const t = await token();
    let c = new GraphQLClient(apiServerUrl, { headers: {Authorization: `Bearer ${t}`} })
  }else{
    let c = new GraphQLClient(apiServerUrl)
  }
  return {
      put: async (values, id) => await put(values, id, c),
      post: async (values) => await post(values, c),
      setId
  }
}
import { GraphQLClient } from 'graphql-request'

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function MockClient({setId}){
    return async function(){
      return {
          put: async (values) => {
            await sleep(1000)
            throw "Error"
          },
          post: async (values) => {
            await sleep(1000)
            return {id: 1}
          },
          setId
      }
    }
  }

export function GQClient({apiServerUrl, token, put, post, setId}){
    return async function(){
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
  }
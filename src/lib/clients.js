//import { GraphQLClient } from 'graphql-request'

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function RESTClient({token, url, key, myfetch, entitySchema}){
  
  return {
      put: async (values, id) => {
        let headers = {}
        if(token){
          const t = await token()
          headers = {Authorization: `Bearer ${t}`}
        }
        if(myfetch)
          return await myfetch({url, headers, method: 'PUT', body: values, entitySchema})
        else 
          return await fetch(url + `/${id}`, {headers, method: 'PUT', body: JSON.stringify(values)})
      },
      post: async (values) => {
        let headers = {}
        if(token){
          const t = await token()
          headers = {Authorization: `Bearer ${t}`}
        }
        if(myfetch)
          return await myfetch({url, headers, method: 'POST', body: values, entitySchema})
        else
          return await fetch(url, {headers, method: 'POST', body: JSON.stringify(values)})
      },
      key
  }
}
 
/*
export async function GQClient({apiServerUrl, token, put, post, key}){
  if(token){
    const t = await token();
    let c = new GraphQLClient(apiServerUrl, { headers: {Authorization: `Bearer ${t}`} })
  }else{
    let c = new GraphQLClient(apiServerUrl)
  }
  return {
      put: async (values, id) => await put(values, id, c),
      post: async (values) => await post(values, c),
      key
  }
}
*/
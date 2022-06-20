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
 
import { stream, register, fromSchema } from './bind'
import { GQClient, MockClient, mockClient, RESTClient, RESTClientMocked } from './clients'
import RemoteForm from './declarativeRESTForm.svelte'
import RemoteFormMocked from './remoteFormMocked.svelte'

export {    RESTClient, GQClient, MockClient, RESTClientMocked, 
            mockClient, register, stream, fromSchema, RemoteForm,
            RemoteFormMocked
        }

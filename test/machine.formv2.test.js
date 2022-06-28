import '@testing-library/jest-dom'
import  userEvent from '@testing-library/user-event'
import {render, screen, waitFor } from '@testing-library/svelte'

let endpoint = {
    token: async () => "Bearer ABC", //default to null
    name: "endpoint",
    baseUrl: "http://localhost:8080/api",
    entities: {
        cat: {
            path: "/cat", //default to ""
            validation: (data) => true, //default to () => true
            errors: (data) => ({}), //default to () => ({})
            key: "id" //default to "id", it can be a function like (data) => data.cat.id if your are going to use it yourself in your custom fetch
        }
    }
}


import C from './C.svelte';

test('changes button text on click', async () => {
    const user = userEvent.setup()

    const myfetch = jest.fn( x => ({data: {id: 3}}))

    const {getByLabelText} = render(C, {endpoint: {...endpoint, fetch: myfetch}})
    const input = getByLabelText("my cat")
    await user.type(input, 'foo')
    await waitFor(() => expect(screen.getByTestId('my-test-id')).toHaveTextContent("It's my cat fuffyfoo"));
    await waitFor(() => expect(screen.getByTestId('my-state-test-id')).toHaveTextContent("iddle")); //saved

    expect(myfetch.mock.calls[0][0]).toMatchObject({
        url: 'http://localhost:8080/api/cat',
        id: null,
        method: 'POST',
        token: 'Bearer ABC',
        body: {name: 'fuffyfoo', age: 1}
    });
})
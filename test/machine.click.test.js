import '@testing-library/jest-dom'
import {render, waitFor, screen } from '@testing-library/svelte'

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


import D from './D.svelte';

test('changes age on button click', async () => {

    const myfetch = jest.fn( x => ({data: {id: 3}}))

    const {getByRole} = render(D, {endpoint: {...endpoint, fetch: myfetch}})
    const button = getByRole("button")
    await button.click()
    await waitFor(() => expect(screen.getByTestId('my-state-test-id')).toHaveTextContent("idle")); //saved

    expect(myfetch.mock.calls[0][0]).toMatchObject({
        url: 'http://localhost:8080/api/cat',
        id: null,
        method: 'POST',
        token: 'Bearer ABC',
        body: {name: 'fuffy', age: 2}
    });
})
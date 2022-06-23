import '@testing-library/jest-dom'
import  userEvent from '@testing-library/user-event'
import {render, fireEvent, screen, waitFor } from '@testing-library/svelte'

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

    const myfetch = jest.fn()
    const {getByLabelText, getByText} = render(C, {endpoint: {...endpoint, fetch: myfetch}})
    const input = getByLabelText("my cat")
    //const button = getByText('button')
    //await fireEvent.click(button)
    //await userEvent.type(input, 'foo')
    await user.type(input, 'foo')
    //await fireEvent.change(input, {target: {value: 'foo'}})
    //expect(input).toHaveValue('foo')
    //expect(screen.getByTestId('my-test-id')).toHaveTextContent("It's my cat fuffy");
    await waitFor(() => expect(screen.getByTestId('my-test-id')).toHaveTextContent("It's my cat fuffyfoo"))
})
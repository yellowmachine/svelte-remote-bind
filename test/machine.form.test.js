// @vitest-environment jsdom
//import 'vi-fetch/setup';
//import { tick } from 'svelte';
import { test, expect, vi } from 'vitest';
//import { mockFetch, mockPost, prepareFetch } from 'vi-fetch';

/*
beforeAll(() => {
    prepareFetch(globalThis, 'fetch');
    mockFetch.setOptions({ baseUrl: 'http://localhost:8080/api' });
  });
  
beforeEach(() => {
    mockFetch.clearAll();
});
*/

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

const sleep = ms => new Promise(r => setTimeout(r, ms));

test('endpoint was called', async () => {
    //const mock = mockPost('/cat').
    //withHeaders([['Authorization', 'Bearer ABC']]).
    //willResolve({ id: 1 });

    const myfetch = vi.fn()

    const host = document.createElement('div');
    document.body.appendChild(host);
    new C({
        props: {
            endpoint: {...endpoint, fetch: myfetch}
        }, 
        target: host 
    });

    const input = host.getElementsByTagName('input')[0];   
    input.setAttribute("value", "fooo")

    await expect(host.innerHTML).toContain("It's my cat fooo");

    /*
    await sleep(3000);
    await expect(host.innerHTML).toContain("iddle");

    expect(myfetch.mock.calls[0][0]).toMatchObject({
        url: 'http://localhost:8080/api/cat',
        method: 'POST',
        token: 'Bearer ABC',
        body: {name: 'fooo', age: 1}
      });
      */
});

// @vitest-environment jsdom
import 'vi-fetch/setup';
import { test, expect, beforeAll, beforeEach } from 'vitest';
import { mockFetch, mockPost, prepareFetch } from 'vi-fetch';

beforeAll(() => {
    prepareFetch(globalThis, 'fetch');
    mockFetch.setOptions({ baseUrl: 'http://localhost:8080/api' });
  });
  
beforeEach(() => {
    mockFetch.clearAll();
});
  
import C from './C.svelte';

const sleep = ms => new Promise(r => setTimeout(r, ms));

test('apples endpoint was called', async () => {
    mockPost('/cat').willResolve({ id: 1 });

    const host = document.createElement('div');
    document.body.appendChild(host);
    new C({ target: host });

    const input = host.getElementsByTagName('input')[0];   
    input.setAttribute("value", "fooo")
    
    await expect(host.innerHTML).toContain("fooo");

    await sleep(3000);
    await expect(host.innerHTML).toContain("iddle");

});
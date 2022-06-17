import 'vi-fetch/setup';
import { test, expect, beforeAll, beforeEach } from 'vitest';
import { mockFetch, mockGet, prepareFetch } from 'vi-fetch';

beforeAll(() => {
    prepareFetch(globalThis, 'fetch');
    mockFetch.setOptions({ baseUrl: 'https://api.com' });
  });
  
beforeEach(() => {
    mockFetch.clearAll();
});
  
import { callApi } from './_api'

test('apples endpoint was called', async () => {
    mockGet('/apples').willResolve({ apples: 33 });

    await expect(callApi('/apples')).resolves.toEqual({ apples: 33 });
    /*await expect(callApi('/apples', { method: 'GET' })).resolves.toEqual({
      apples: 33,
    });
    */
});
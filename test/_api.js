//import fetch from "node-fetch";

const baseUrl = 'https://api.com';

export const callApi = (url, ...args) => {
    return fetch(baseUrl + url, ...args).then((r) => r.json());
  };
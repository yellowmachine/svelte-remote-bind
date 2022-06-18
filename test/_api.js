//import fetch from "node-fetch";

const baseUrl = 'https://api.com';

export const callApi = (url) => {
    return fetch(baseUrl + url).then((r) => r.json());
  };

export const callApiPost = (url) => {
    return fetch(baseUrl + url, {method: "POST"}).then((r) => r.json());
  };
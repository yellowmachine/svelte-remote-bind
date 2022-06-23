export default {
    //fetch: jest.fn(async x => x),
    token: async () => "Bearer ABC", //default to null
    name: "endpoint",
    baseUrl: "http://localhost:8080/api",
    entities: {
        cat: {
            path: "/cat", //default to ""
            validation: (data) => true, //suite(data).isValid(), //default to () => true
            errors: (data) => ({}), //suite(data), //default to () => ({})
            key: "id" //default to "id", it can be a function like (data) => data.cat.id if your are going to use it yourself in your custom fetch
        }
    }
  }
const { assign, createMachine } = require("xstate");

const schemas = {}

module.exports = {
  remoteMachineFactory: ({ schema, path}) => {

    const [name, entity] = path.split(':')
    const myfetchv2 = schema.fetch
    const url = schema.baseUrl + schema.entities[entity].path
    const token = schema.token

    return createMachine({
      id: "toggle",
      initial: "iddle",
      context: {
        buffer: [],
        current: "initial",
      },
      states: {
        iddle: {
          always: [
              { target: 'buffering', cond: (context) => context.buffer.length > 0 }
          ],
          on: {
            TYPE: {
              target: "buffering",
              actions: assign({
                buffer: (context, event) => [...context.buffer, event.data],
              }),
            },
          },
        },
        buffering: {
          entry: assign({
            buffer: () => [],
            current: (context) => context.buffer.at(-1),
          }),
          on: {
            TYPE: {
              internal: true,
              target: "buffering",
              actions: assign({
                buffer: (context, event) => [...context.buffer, event.data],
              }),
            },
          },
          invoke: {
            src: async (context, event) => await myfetchv2({url, token: await token(), method: 'PUT', body: context.current}),
            onDone: {
              target: "iddle",
            },
          },
        },
      },
    });
  },
  register: (schema) => {
    schemas[schema.name] = schema
  }
}

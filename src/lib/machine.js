//const { assign, createMachine } = require("xstate");
import { assign, createMachine } from 'xstate'

export const remoteMachineFactory = ({ id=null, schema, entity}) => {

    const myfetchv2 = schema.fetch
    const url = schema.baseUrl + schema.entities[entity].path
    const token = schema.token

    return createMachine({
      id: "remote-bind",
      initial: "iddle",
      context: {
        id,
        buffer: [],
        current: "initial", //TODO: try to put null and pass tests
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
        error: {
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
            src: async (context, event) => await myfetchv2({
              url, 
              token: await token(), 
              method: context.id !== null ? 'PUT': 'POST', 
              body: context.current
            }),
            onDone: {
              target: "iddle",
              actions: assign({id: (context, event) => event.id})
            },
            onError: "error"
          },
        },
      },
    });
  }

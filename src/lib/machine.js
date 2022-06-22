import { assign, createMachine, actions } from 'xstate';
const { log } = actions;

export const remoteMachineFactory = ({ id=null, schema, entity}) => {

    const myfetchv2 = schema.fetch
    const url = schema.baseUrl + schema.entities[entity].path
    const token = schema.token

    return createMachine({
      id: "remote-bind",
      initial: "ini",
      context: {
        id,
        buffer: [],
        current: "initial", //TODO: try to put null and pass tests
      },
      states: {
        ini: {
          entry: log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'ini'
          ),
          on: {
            TYPE: 'iddle'
          }
        },
        iddle: {
          entry: log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'iddle'
          ),
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
          entry: log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'error'
          ),
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
          entry: [
            log(
              (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
              'buffering'
            ),
            assign({
              buffer: () => [],
              current: (context) => context.buffer.at(-1),
            })
          ],
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
              url, //pass url/:id when PUT
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

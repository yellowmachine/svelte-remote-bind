import { assign, createMachine, actions } from 'xstate';
const { log, cancel, send } = actions;

export const remoteMachineFactory = ({ id=null, schema, entity, validation}) => {

    const myfetchv2 = schema.fetch
    const url = schema.baseUrl + schema.entities[entity].path
    const token = schema.token

    return createMachine({
      id: "remote-bind",
      initial: "init",
      context: {
        id,
        buffer: [],
        current: null,
      },
      states: {
        init: {
          entry: log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'init'
          ),
          on: {
            TYPE: 'iddle'
          }
        },
        debouncing: {
          entry: [
            log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'debouncing'
          ),
          cancel('debouncing'),
          send("FETCH", {
            delay: 1000,
            id: "debouncing"
          })
            ],
          on: {
            FETCH: "fetching",
            TYPE: {
              actions: "bufferIfValidItem",
              target: "debouncing" 
            }
          }
        },
        saved: {
          entry: log(
            (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'saved'
          ),
          always: "iddle"
        },
        iddle: {
          entry: log(
            (context, event) => `buffer.length: ${context.buffer.length} current: ${context.current}, event: ${JSON.stringify(event)}`,
            'iddle'
          ),
          always: [
              { target: 'debouncing', cond: (context) => context.buffer.length > 0 }
          ],
          on: {
            TYPE: {
              target: "iddle", //"debouncing",
              actions: "bufferIfValidItem"
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
              target: "iddle", //"debouncing",
              actions: "bufferIfValidItem"
            },
          },
        },
        fetching: {
          entry: [
            log(
              (context, event) => `buffer: ${context.buffer} current: ${context.current}, event: ${JSON.stringify(event)}`,
              'fetching'
            ),
            assign({
              buffer: () => [],
              current: (context) => context.buffer.at(-1),
            })
          ],
          on: {
            TYPE: {
              internal: true,
              target: "fetching",
              actions: "bufferIfValidItem"
            },
          },
          invoke: {
            src: async (context, event) => await myfetchv2({
              url: context.id !== null ? url + '/' + context.id : url,
              id: context.id,
              token: await token(), 
              method: context.id !== null ? 'PUT': 'POST', 
              body: context.current
            }),
            onDone: {
              target: "saved",
              actions: [
                log((context, event ) => console.log('event.data onDone', event.data), 'onDone'),
                assign({id: (context, event) => event.data.id})
              ]
            },
            onError: "error"
          },
        },
      },
    },
    {
      actions: {
        bufferIfValidItem: assign({
          buffer: (context, event) => {
            console.log('buffer if valid item', event.data, validation(event.data))
            if(validation(event.data))
              return [...context.buffer, event.data]
            else
              return [...context.buffer]
          }
        })
      }
    }
  )
}
import { assign, createMachine, actions } from 'xstate';
const { cancel, send } = actions;

export const remoteMachineFactory = ({ onCreated=()=>{}, id=null, schema, entity, validation, debounceTime=1000}) => {

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
          on: {
            TYPE: 'idle'
          }
        },
        debouncing: {
          entry: [
              cancel('debouncing'),
              send("FETCH", {
                delay: debounceTime,
                id: "debouncing"
              })
            ],
          on: {
            FLUSH: {
              actions: [cancel('debouncing')/*, log()*/] ,
              target: 'fetching'
            },
            FETCH: "fetching",
            TYPE: {
              actions: "bufferIfValidItem",
              target: "debouncing" 
            }
          }
        },
        saved: {
          always: "idle"
        },
        idle: {
          always: [
              { target: 'debouncing', cond: (context) => context.buffer.length > 0 }
          ],
          on: {
            RESET: {
              on: {
                actions: assign({
                  buffer: () => [],
                  current: (context) => null,
                })
              }
            },
            TYPE: {
              target: "idle", 
              actions: "bufferIfValidItem"
            },
          },
        },
        error: {
          on: {
            TYPE: {
              target: "idle",
              actions: "bufferIfValidItem"
            },
          },
        },
        fetching: {
          entry: [
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
                assign({id: (context, event) => {
                  if(context.id === null) onCreated({...context.current, id: event.data.id})
                  return event.data.id
                }})
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
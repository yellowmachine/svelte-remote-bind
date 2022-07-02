import { assign, createMachine, actions } from 'xstate';
import equal from 'deep-equal';

const { log, cancel, send } = actions;

export const remoteMachineFactory = ({ transform=(x) => x, onCreated=()=>{}, 
                                       id=null, schema, entity, validation, 
                                       debounceTime=1000}) => {

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
        latest: {},
      },
      states: {
        init: {
          entry: log(),
          on: {
            TYPE: {
              target: 'idle',
              actions: assign({latest: (context, event) => event.data})
            }
          }
        },
        debouncing: {
          entry: [
              log(),
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
          entry: log(),
          always: [
              { target: 'debouncing', cond: (context) => context.buffer.length > 0 }
          ],
          on: {
            RESET: {
              target: "idle",
              actions: assign({
                id: () => null,
                latest: () => ({}),
                buffer: () => [],
                current: () => null,
              })
            },
            TYPE: {
              target: "idle", 
              actions: "bufferIfValidItem"
            },
          },
        },
        error: {
          entry: log(),
          on: {
            TYPE: {
              target: "idle",
              actions: "bufferIfValidItem"
            },
          },
        },
        fetching: {
          entry: [
            log(),
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
            src: async (context, event) => {
              if(!equal(context.latest, transform(context.current))){  
                return await myfetchv2({
                  url: context.id !== null ? url + '/' + context.id : url,
                  id: context.id,
                  token: await token(), 
                  method: context.id !== null ? 'PUT': 'POST', 
                  body: transform(context.current)
                })
              }else{
                return {data: {id: context.id}}
              }
            },
            onDone: {
              target: "saved",
              actions: [
                assign({
                  id: (context, event) => {
                    if(context.id === null) onCreated({...context.current, id: event.data.id})
                    return event.data.id
                  },
                  latest: (context) => {
                    console.log('latest context.current', context.current)
                    return transform(context.current)
                  }
                })
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
              return context.buffer
          }
        })
      }
    }
  )
}
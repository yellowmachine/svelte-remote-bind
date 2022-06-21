const { assign, createMachine } = require("xstate");

/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const myfetch = (x) => Promise.resolve(1)
*/

module.exports = function myMachine({myfetch}){
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
          src: (context, event) => myfetch(context.current),
          onDone: {
            target: "iddle",
          },
        },
      },
    },
  });
}

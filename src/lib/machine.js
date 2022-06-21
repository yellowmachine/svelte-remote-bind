const { assign, createMachine } = require("xstate");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const myfetch = (x) => Promise.resolve(1)

module.exports = createMachine({
  id: "toggle",
  initial: "iddle",
  context: {
    buffer: [],
    current: "initial",
  },
  states: {
    iddle: {
      always: [
          { target: 'buffering', cond: 'isBuffer' }
      ],
      on: {
        TYPE: {
          target: "buffering.fetching",
          actions: assign({
            buffer: (context, event) => [...context.buffer, event.data],
          }),
        },
      },
    },
    buffering: {
      initial: "fetching",
      invoke: {
        src: (context, event) => myfetch(context.current),
        onDone: {
          target: "iddle",
        },
      },
      states: {
        fetching: {
          entry: assign({
            buffer: () => [],
            current: (context) => context.buffer.at(-1),
          }),
          on: {
            TYPE: {
              internal: true,
              target: "fetching",
              actions: assign({
                buffer: (context, event) => [...context.buffer, event.data],
              }),
            },
          },
        },
      },
    },
  },
},
{
    guards: {
      isBuffer: (context) => {
        return context.buffer.length > 0;
      }
    }
  });

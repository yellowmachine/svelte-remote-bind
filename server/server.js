const createError = require('http-errors')
const fastify = require('fastify')({ logger: true })

let status = '200';

fastify.post('/api/serverstatus/:status', async (request, reply) => {
  status = request.params.status
  return { status }
})

fastify.post('/api/cat', async (request, reply) => {
  console.log(request.headers)
  if(status === '200')
    return { id: 1 }
  else
    throw createError(500)
})

fastify.put('/api/cat/1', async (request, reply) => {
  console.log(request.headers)
  if(status === '200')
    return { id: 1 }
  else
    throw createError(status)
})

const start = async () => {
  try {
    await fastify.listen(8080)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
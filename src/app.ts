import fastify from 'fastify'
import { ZodError } from 'zod'
import { routes } from './http/routes'
import fastifyMultipart from '@fastify/multipart'
import cors from '@fastify/cors'
// import fastifyJwt from '@fastify/jwt'
// import { env } from './env'
// import { S3ClientSingleton } from './lib/s3Client.js'

export const app = fastify()
app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

// const s3Config = {
//   credentials: { accessKeyId: '123456', secretAccessKey: 'abcdef' },
//   region: 'us-east-1',
//   endpoint: 'http://0.0.0.0:4566',
//   forcePathStyle: true,
// }

// const s3ClientSingleton = S3ClientSingleton.getInstance(s3Config)
// export const s3ClientConnect = s3ClientSingleton.getClient()

app.register(fastifyMultipart)
app.register(routes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  // if (env.NODE_ENV !== 'production') {
  //   console.error(error)
  // }

  return reply.status(500).send({ message: 'Internal server error' })
})

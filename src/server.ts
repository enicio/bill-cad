import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: 3335,
  })
  .then((url) => {
    console.log(`Server listening on ${url}`)
  })

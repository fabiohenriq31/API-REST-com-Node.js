/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from './env'

import { app } from './app'


app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server running!')
  })

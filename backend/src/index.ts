import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { serve } from '@hono/node-server' 

const app = new Hono()
const prisma = new PrismaClient()

app.use('/*', cors())

app.get('/todos', async (c) => {
  const todos = await prisma.todo.findMany()
  return c.json(todos)
})

app.get('/', (c) => c.text('Hono server is running!'))

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
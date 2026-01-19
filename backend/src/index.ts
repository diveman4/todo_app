import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { serve } from '@hono/node-server'

const app = new Hono()
const prisma = new PrismaClient()

app.use('/*', cors())

// 一覧取得 (GET)
app.get('/todos', async (c) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return c.json(todos)
  } catch (error) {
    return c.json({ error: 'Failed to fetch todos', details: String(error) }, 500)
  }
})

// 新規作成 (POST)
app.post('/todos', async (c) => {
  try {
    const body = await c.req.json()
    if (!body.title) {
      return c.json({ error: 'Title is required', details: 'The request body must include a title.' }, 400)
    }
    const todo = await prisma.todo.create({
      data: { title: body.title }
    })
    return c.json(todo, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create todo', details: String(error) }, 500)
  }
})

// 更新 (PUT) 
app.put('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  try {
    const body = await c.req.json()

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        completed: body.completed !== undefined ? body.completed :undefined,
      }
    })
    return c.json(todo)
  } catch (error) {
    return c.json({ error: 'Update failed', details: 'Todo not found or invalid data' }, 404)
  }
})

// 削除 (DELETE)
app.delete('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  try {
    await prisma.todo.delete({ where: { id } })
    return c.json({ message: 'Deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Delete failed', details: 'Target todo not found' }, 404)
  }
})

// サーバー起動
const port = 3001
console.log(`Server is running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
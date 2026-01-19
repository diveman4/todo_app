import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient, Priority } from '@prisma/client'
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
      data: { 
        title: body.title,
        description: body.description || null,
        //日付文字列をDataオブジェクトへ変換
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        priority: (body.priority as Priority) || Priority.medium
       }
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
        description: body.description !== undefined ? body.description : undefined,
        dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : undefined,
        priority: body.priority !== undefined ? (body.priority as Priority) : undefined
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
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient, Priority } from '@prisma/client'
import { serve } from '@hono/node-server'
import { openApiSpec } from './openapi'

const app = new Hono()
const prisma = new PrismaClient()

// CORS設定 別ドメインからのリクエストを許可
app.use('/*', cors())

// OpenAPI (Swagger) JSON
app.get('/docs/openapi.json', (c) => {
  return c.json(openApiSpec)
})

// Swagger UI
app.get('/docs', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Todo API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: '/docs/openapi.json',
          dom_id: '#swagger-ui',
        });
      };
    </script>
  </body>
  </html>
  `)
})

// TODO一覧の取得 (GET)　 キーワード検索追加　大文字小文字を区別しない
app.get('/todos', async (c) => {
  try {
    const keyword = c.req.query('keyword')
    const todos = await prisma.todo.findMany({
      where: keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return c.json(todos)
  } catch (error) {
    return c.json({ error: 'Failed to fetch todos', details: String(error) }, 500)
  }
})

// 特定TODOの取得 (GET)
app.get('/todos/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const todo = await prisma.todo.findUnique({ where: { id } })

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404)
    }

    return c.json(todo)
  } catch (error) {
    return c.json({ error: 'Failed to fetch todo', details: String(error) }, 500)
  }
})

// TODOの新規作成 (POST)
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
        priority: (body.priority as Priority) || Priority.MEDIUM
       }
    })
    return c.json(todo, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create todo', details: String(error) }, 500)
  }
})

// TODOの更新 (PUT) 
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

// TODOの削除 (DELETE)
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
const express = require('express')
const tasksRouter = require('./routes/tasks')
const healthRouter = require('./routes/health')
const logging = require('./middleware/logging')

const app = express()

app.use(express.json())
app.use(logging)

app.use('/health', healthRouter)
app.use('/tasks', tasksRouter)

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

module.exports = app

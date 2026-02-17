let tasks = []
let nextId = 1

exports.getTasks = (req, res) => {
  res.json(tasks)
}

exports.createTask = (req, res) => {
  const { title, completed = false } = req.body
  const task = { id: String(nextId++), title, completed }
  tasks.push(task)
  res.status(201).json(task)
}

exports.getTask = (req, res) => {
  const t = tasks.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
}

exports.updateTask = (req, res) => {
  const t = tasks.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  const { title, completed } = req.body
  if (title !== undefined) t.title = title
  if (completed !== undefined) t.completed = completed
  res.json(t)
}

exports.deleteTask = (req, res) => {
  const idx = tasks.findIndex(x => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  tasks.splice(idx, 1)
  res.status(204).end()
}

// For tests: allow reset
exports._reset = () => { tasks = []; nextId = 1 }

exports.validateTask = (req, res, next) => {
  const { title } = req.body
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid task: title is required' })
  }
  next()
}

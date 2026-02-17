import { useState } from 'react'
import styles from '../styles/tasks.module.css'

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), priority })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create task')
      onCreate && onCreate(data)
      setTitle('')
      setDescription('')
      setPriority('medium')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      {error && <div style={{color:'var(--accent)', marginBottom:8}}>{error}</div>}
      <input
        className={styles.input}
        placeholder="Task title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        disabled={loading}
      />
      <textarea
        className={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChange={e=>setDescription(e.target.value)}
        disabled={loading}
      />
      <div className={styles.controls}>
        <select value={priority} onChange={e=>setPriority(e.target.value)} disabled={loading}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className={styles.button} type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add Task'}</button>
      </div>
    </form>
  )
}

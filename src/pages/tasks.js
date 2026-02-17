import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/tasks.module.css'
import TaskForm from '../../components/TaskForm'

function TaskItem({ task, onToggle }) {
  const toggle = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    const res = await fetch(`/api/tasks/${task.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    if (res.ok) {
      const updated = await res.json()
      onToggle(updated)
    } else {
      const err = await res.json()
      alert(err.error || 'Failed to update status')
    }
  }

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return ''
    }
  }

  return (
    <div className={`${styles.taskItem} ${task.status === 'completed' ? styles.completed : ''}`}>
      <div className={styles.left}>
        <input type="checkbox" checked={task.status==='completed'} onChange={toggle} />
        <div>
          <div className={styles.title}>{task.title}</div>
          {task.description && <div className={styles.desc}>{task.description}</div>}
        </div>
      </div>
      <div className={`${styles.meta} ${styles[getPriorityClass(task.priority)]}`}>{task.priority}</div>
    </div>
  )
}

export default function TasksPage(){
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const limit = 10

  async function load(){
    const res = await fetch(`/api/tasks?limit=${limit}&offset=${page*limit}`)
    if (res.ok){
      const data = await res.json()
      setTasks(data.tasks || [])
      setTotal(data.total || 0)
    } else {
      console.error('Failed to load tasks')
    }
  }

  useEffect(()=>{ load() }, [page])

  function handleCreate(task){
    // prepend
    setTasks(prev=>[task, ...prev])
    setTotal(t=>t+1)
  }

  function handleToggle(updated){
    setTasks(prev=>prev.map(t=>t.id===updated.id?updated:t))
  }

  return (
    <>
      <Header />
      <main className="container">
        <h1>Tasks</h1>
        <div className={styles.grid}>
          <div className={styles.col}>
            <h2>Create</h2>
            <TaskForm onCreate={handleCreate} />
          </div>
          <div className={styles.col}>
            <h2>All Tasks</h2>
            {tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started!</p>
              </div>
            ) : (
              <>
                <div className={styles.list}>
                  {tasks.map(t => (
                    <TaskItem key={t.id} task={t} onToggle={handleToggle} />
                  ))}
                </div>
                {total > limit && (
                  <div className={styles.pager}>
                    <button disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Previous</button>
                    <span>Page {page+1} / {Math.ceil(Math.max(1,total)/limit)}</span>
                    <button disabled={(page+1)*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

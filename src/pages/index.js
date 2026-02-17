import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/home.module.css'

const sample = [
  { id: '1', title: 'Plan weekly goals', meta: 'Due tomorrow' },
  { id: '2', title: 'Buy groceries', meta: 'Medium priority' },
  { id: '3', title: 'Read 20 pages', meta: 'Low priority' }
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="container">
        <section className={styles.hero}>
          <div>
            <h1>Focus on what matters.</h1>
            <p>Beautiful, lightweight task management to keep your day organized and calm.</p>
            <a className={styles.cta} href="/tasks">Create your first list</a>

            <div className={styles.features} id="features">
              <div className={styles.feature}>
                <strong>Quick to use</strong>
                <div className="taskMeta">Add tasks in seconds</div>
              </div>
              <div className={styles.feature}>
                <strong>Minimal</strong>
                <div className="taskMeta">No distractions — just tasks</div>
              </div>
              <div className={styles.feature}>
                <strong>Fast</strong>
                <div className="taskMeta">Optimized for speed</div>
              </div>
            </div>
          </div>

          <aside className={styles.taskCard} id="tasks">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
              <div style={{fontWeight:700}}>Today</div>
              <div className="taskMeta">3 tasks</div>
            </div>
            {sample.map(t => (
              <div key={t.id} className={styles.taskItem}>
                <input type="checkbox" aria-hidden style={{width:18, height:18, borderRadius:4}} />
                <div>
                  <div className={"taskTitle"} style={{color:'var(--fg)'}}>{t.title}</div>
                  <div className="taskMeta">{t.meta}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:16, textAlign:'center'}}>
              <a href="/tasks" style={{color:'var(--accent)', textDecoration:'none', fontWeight:600}}>View All Tasks →</a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}

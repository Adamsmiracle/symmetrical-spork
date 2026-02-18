import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/home.module.css'

const sample = [
  { id: '1', title: 'Plan weekly goals', meta: 'Due tomorrow', priority: 'high' },
  { id: '2', title: 'Buy groceries', meta: 'Medium priority', priority: 'medium' },
  { id: '3', title: 'Read 20 pages', meta: 'Low priority', priority: 'low' }
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
            <a className={styles.cta} href="/tasks">View Tasks</a>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>Simple & Clean</div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <div className={styles.featureText}>Fast & Efficient</div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <div className={styles.featureText}>Goal Focused</div>
              </div>
            </div>
          </div>
          <aside className={styles.taskCard}>
            <h3 className={styles.taskCardTitle}>Sample Tasks</h3>
            <div className={styles.taskList}>
              {sample.map(task => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={`${styles.taskPriority} ${styles[task.priority]}`}></div>
                  <div className={styles.taskContent}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={styles.taskMeta}>{task.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.taskCardFooter}>
              <a href="/tasks" className={styles.viewAllLink}>View all tasks →</a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}

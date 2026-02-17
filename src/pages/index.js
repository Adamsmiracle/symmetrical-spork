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
            <a className={styles.cta} href="/tasks">Tasks</a>
            </div>
          <aside className={styles.taskCard} id="tasks">
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}

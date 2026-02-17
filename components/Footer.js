export default function Footer(){
  return (
    <footer style={{padding:'3rem 0 6rem', color:'var(--muted)'}}>
      <div className="container" style={{textAlign:'center'}}>
        <div style={{marginBottom:'0.5rem'}}>Made with ♥ — Task Manager</div>
        <small>© {new Date().getFullYear()} Task Manager</small>
      </div>
    </footer>
  )
}

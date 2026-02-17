export default function Header() {
  return (
    <header style={{padding: '1rem 0'}}>
      <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
          <div style={{width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,var(--accent),var(--accent-2))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>TM</div>
          <div>
            <div style={{fontWeight:700}}>Task Manager</div>
            <div style={{fontSize:12, color:'var(--muted)'}}>Organize your day beautifully</div>
          </div>
        </div>
        <nav style={{display:'flex', gap:'1rem', alignItems:'center'}}>
          <a href="#features" style={{color:'var(--muted)', textDecoration:'none'}}>Features</a>
          <a href="#tasks" style={{color:'var(--muted)', textDecoration:'none'}}>Sample</a>
          <a href="/tasks" style={{background:'linear-gradient(90deg,var(--accent),var(--accent-2))', color:'#021026', padding:'0.5rem 0.9rem', borderRadius:8, fontWeight:600, textDecoration:'none'}}>Get Started</a>
        </nav>
      </div>
    </header>
  )
}

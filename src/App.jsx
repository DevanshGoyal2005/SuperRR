import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Home, Player, RRAnalysis, Methodology } from './pages.jsx'

const NAV = [['/', 'Home', true], ['/rr-analysis', 'RR Analysis'], ['/model-methodology', 'Model & Methodology']]
const GATE = 'ria_demo_gate'

function Login({ onEnter }) {
  const nav = useNavigate()
  const enter = () => { sessionStorage.setItem(GATE, '1'); onEnter(); nav('/') }
  return (
    <main className="login">
      <div className="card login-card">
        <p className="eyebrow">Super RR Challenge · Rajasthan Royals</p>
        <h1>Royal Auction Intelligence</h1>
        <p>Evidence-based auction analytics: the locked Top 10 Batters and Top 10 Bowlers, with every recommendation traceable to its data.</p>
        <button className="btn primary big" onClick={enter}>Demo Login</button>
        <p className="muted small">Opens a read-only judge view. No credentials needed.</p>
        <form onSubmit={(e) => e.preventDefault()} className="disabled-form" aria-label="Email and password login (not available in this demo)">
          <label>Email<input type="email" disabled placeholder="Not available in front-end demo" /></label>
          <label>Password<input type="password" disabled placeholder="Not available in front-end demo" /></label>
        </form>
        <p className="muted small">This is a client-side gate, not real authentication. There is no server, session, role enforcement or protected download in this build. Email/password sign-in and backend 403s from the PRD require a server and are not implemented.</p>
      </div>
    </main>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(GATE) === '1')
  const [theme, setTheme] = useState(() => localStorage.getItem('ria_theme') || 'light')
  const loc = useLocation()
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('ria_theme', theme) } catch {} }, [theme])
  useEffect(() => { if (!loc.pathname.startsWith('/player')) window.scrollTo(0, 0) }, [loc.pathname])

  if (!authed) return <Routes><Route path="*" element={<Login onEnter={() => setAuthed(true)} />} /></Routes>
  return (
    <>
      <header className="top">
        <div className="top-in">
          <NavLink to="/" className="brand"><span className="mark">RR</span><span>Royal Auction Intelligence</span></NavLink>
          <nav aria-label="Primary">{NAV.map(([to, label, end]) => <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>)}</nav>
          <div className="actions">
            <button className="btn ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '☾ Dark' : '☀ Light'}</button>
            <button className="btn ghost" onClick={() => { sessionStorage.removeItem(GATE); setAuthed(false) }}>Log out</button>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/rr-analysis" element={<RRAnalysis />} />
        <Route path="/model-methodology" element={<Methodology />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="foot">Recommendations are analytical recruitment priorities, not a guarantee of auction acquisition or future match output.</footer>
    </>
  )
}

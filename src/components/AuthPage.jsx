import { useEffect, useState } from 'react'
import AuthModal from './AuthModal'
import UserDashboard from './UserDashboard'
import { supabase } from '../lib/supabase'

export default function AuthPage({ path }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setUser(data.session?.user || null); setLoading(false) }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user || null)
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [])

  if (loading) return <div className="app-loading"><a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a><i/></div>
  if (path === '/account' && user) return <UserDashboard user={user} onExit={() => setUser(null)}/>

  const mode = path === '/signup' ? 'signup' : 'login'
  return <>
    <div className="auth-page-shell">
      <a className="brand" href="/" aria-label="Back to MechLab home"><i/><b>MECH<span>LAB</span></b></a>
      <p>Performance intelligence for Rocket League players.</p>
    </div>
    <AuthModal initialMode={mode} onClose={() => { window.location.href = path === '/account' ? '/' : '/' }}/>
  </>
}

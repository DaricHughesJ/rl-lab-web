import { useEffect, useState } from 'react'
import { getBetaProfile, supabase } from '../lib/supabase'
import { BETA_DOWNLOAD_URL, BETA_RELEASE_PAGE, BETA_VERSION } from '../lib/release'

export default function UserDashboard({ user, onExit }) {
  const meta = user.user_metadata || {}
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState('')
  const name = profile?.display_name || meta.display_name || user.email?.split('@')[0] || 'Player'
  const approved = profile?.beta_access === true

  useEffect(() => {
    let active = true
    getBetaProfile()
      .then((data) => active && setProfile(data))
      .catch(() => active && setProfileError('We could not refresh your beta status. Try signing in again.'))
    return () => { active = false }
  }, [])

  return <main className="account-shell">
    <aside className="account-sidebar"><Logo/><div><button className="active">⌁ <span>Overview</span></button><button disabled>◎ <span>Mechanics</span></button><button disabled>⌗ <span>Sessions</span></button><button disabled>◇ <span>Profile</span></button></div><button onClick={async () => { await supabase.auth.signOut(); onExit() }}>↪ <span>Sign out</span></button></aside>
    <section className="account-main"><header><div><p>PLAYER DASHBOARD</p><h1>Welcome, {name}.</h1></div><div className="account-user"><span>{name.slice(0,2).toUpperCase()}</span><div><b>{name}</b><small>{profile?.rank_bucket || meta.rocket_league_rank || 'Beta player'}</small></div></div></header>
      <div className={`beta-banner ${approved ? 'approved' : ''}`}><i>✦</i><div><b>{approved ? `${BETA_VERSION} is ready` : 'Beta access requested'}</b><span>{approved ? 'Download the Windows app, sign in, and begin with Training Lab.' : profileError || (profile ? 'Your account is in the approval queue. We’ll email you when access is granted.' : 'Checking your access…')}</span></div>{approved ? <a href={BETA_DOWNLOAD_URL}>Download for Windows ↓</a> : <em>IN REVIEW</em>}</div>
      <div className="beta-setup">
        <article><span>01</span><div><b>Download MechLab</b><p>{approved ? 'Use the official Windows beta build above.' : 'The download unlocks after your beta account is approved.'}</p></div></article>
        <article><span>02</span><div><b>Sign in</b><p>Use this same email and password in the desktop app.</p></div></article>
        <article><span>03</span><div><b>Open Training Lab</b><p>Start with the bundled offline trainer; BakkesMod is optional.</p></div></article>
      </div>
      <article className="dashboard-empty"><span>YOUR TRAINING DATA</span><i>◇</i><h2>No sessions synced yet</h2><p>Your real mechanic scores, reps, and progress will appear here after you complete and sync your first training session.</p>{approved && <a href={BETA_RELEASE_PAGE}>Read install notes and known beta limits →</a>}</article>
    </section>
  </main>
}

function Logo(){return <a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a>}

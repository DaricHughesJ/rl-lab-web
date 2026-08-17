import { useEffect, useState } from 'react'
import { getBetaProfile, supabase } from '../lib/supabase'
import { BETA_DOWNLOAD_URL, BETA_VERSION } from '../lib/release'

export default function UserDashboard({ user, onExit }) {
  const meta = user.user_metadata || {}
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const name = profile?.display_name || meta.display_name || user.email?.split('@')[0] || 'Player'
  const approved = profile?.beta_access === true

  useEffect(() => {
    let active = true
    getBetaProfile()
      .then((data) => active && setProfile(data))
      .catch(() => active && setProfileError('We could not refresh your beta status. Try signing in again.'))
    return () => { active = false }
  }, [])

  const signOut = async () => {
    setMobileMenu(false)
    await supabase.auth.signOut()
    onExit()
  }

  return <main className="account-shell">
    <style>{dashboardNavCss}</style>
    <aside className="account-sidebar">
      <Logo/>
      <div>
        <button className="active" aria-current="page">⌁ <span>Overview</span></button>
        <button disabled>◎ <span>Mechanics</span></button>
        <button disabled>⌗ <span>Sessions</span></button>
        <a className="account-nav-link" href="/">⌂ <span>Website</span></a>
      </div>
      <button onClick={signOut}>↪ <span>Sign out</span></button>
    </aside>

    <section className="account-main">
      <header>
        <div><p>PLAYER DASHBOARD</p><h1>Welcome, {name}.</h1></div>
        <div className="account-header-actions">
          <div className="account-user"><span>{name.slice(0,2).toUpperCase()}</span><div><b>{name}</b><small>{profile?.rank_bucket || meta.rocket_league_rank || 'Beta player'}</small></div></div>
          <button className="account-menu-button" aria-label="Open account menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu((open) => !open)}>{mobileMenu ? '×' : '☰'}</button>
        </div>
        {mobileMenu && <div className="account-mobile-menu">
          <button onClick={() => setMobileMenu(false)}>⌁ Overview</button>
          <a href="/">⌂ Main website</a>
          <button className="signout" onClick={signOut}>↪ Sign out</button>
        </div>}
      </header>

      <div className={`beta-banner ${approved ? 'approved' : ''}`}><i>✦</i><div><b>{approved ? `${BETA_VERSION} is ready` : 'Beta access requested'}</b><span>{approved ? 'Download the Windows app, sign in, and begin with Training Lab.' : profileError || (profile ? 'Your account is in the approval queue. We’ll email you when access is granted.' : 'Checking your access…')}</span></div>{approved ? <button onClick={downloadBeta}>Download for Windows ↓</button> : <em>IN REVIEW</em>}</div>
      <div className="beta-setup">
        <article><span>01</span><div><b>Download MechLab</b><p>{approved ? 'Use the official Windows beta build above.' : 'The download unlocks after your beta account is approved.'}</p></div></article>
        <article><span>02</span><div><b>Sign in</b><p>Use this same email and password in the desktop app.</p></div></article>
        <article><span>03</span><div><b>Open Training Lab</b><p>Start with the bundled offline trainer; BakkesMod is optional.</p></div></article>
      </div>
      <article className="dashboard-empty"><span>YOUR TRAINING DATA</span><i>◇</i><h2>No sessions synced yet</h2><p>Your real mechanic scores, reps, and progress will appear here after you complete and sync your first training session.</p>{approved && <p className="beta-note">Windows 10/11 · Unsigned beta · Start with Training Lab</p>}</article>
    </section>
  </main>
}

const dashboardNavCss = `
.account-nav-link{border:0;background:none;color:#737583;text-align:left;padding:12px;font-size:11px;display:flex;gap:13px;text-decoration:none}
.account-nav-link:hover{color:#fff}
.account-header-actions{display:flex;align-items:center;gap:10px}
.account-menu-button,.account-mobile-menu{display:none}
@media(max-width:700px){
  .account-sidebar{display:none!important}
  .account-main{padding-bottom:28px!important}
  .account-main>header{position:relative;gap:12px}
  .account-header-actions{margin-left:auto}
  .account-menu-button{display:grid;width:42px;height:42px;place-items:center;border:1px solid #30323d;background:#11131c;color:#f5f2fa;font-size:20px;line-height:1;cursor:pointer}
  .account-mobile-menu{display:grid;position:absolute;z-index:40;top:54px;right:0;width:min(260px,calc(100vw - 30px));background:#0d0f16;border:1px solid #343641;box-shadow:0 18px 50px #000c;padding:8px}
  .account-mobile-menu button,.account-mobile-menu a{display:block;width:100%;padding:14px 12px;border:0;border-bottom:1px solid #ffffff0d;background:none;color:#d8d5de;text-decoration:none;text-align:left;font:11px var(--mono);cursor:pointer}
  .account-mobile-menu .signout{border-bottom:0;color:#ff9cae}
}
`

async function downloadBeta() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return
  const response = await fetch(BETA_DOWNLOAD_URL, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) {
    window.alert(response.status === 403 ? 'Your account does not have beta download access yet.' : 'The beta download is temporarily unavailable. Please try again shortly.')
    return
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'MechLab.exe'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function Logo(){return <a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a>}

import { useEffect, useMemo, useState } from 'react'
import {
  changePassword,
  getBetaProfile,
  getDashboardData,
  getUserSettings,
  supabase,
  updateProfile,
  updateUserSettings,
} from '../lib/supabase'
import { BETA_DOWNLOAD_URL, BETA_VERSION } from '../lib/release'

const tabs = [
  ['overview', '⌁', 'Overview'],
  ['mechanics', '◎', 'Mechanics'],
  ['sessions', '⌗', 'Sessions'],
  ['profile', '◇', 'Profile'],
]

export default function UserDashboard({ user, onExit }) {
  const meta = user.user_metadata || {}
  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [settings, setSettings] = useState(null)
  const [dashboard, setDashboard] = useState({ sessions: [], progress: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const name = profile?.display_name || meta.display_name || user.email?.split('@')[0] || 'Player'
  const approved = profile?.beta_access === true

  async function refresh() {
    setLoading(true); setError('')
    try {
      const [nextProfile, nextSettings, nextDashboard] = await Promise.all([
        getBetaProfile(), getUserSettings(), getDashboardData(),
      ])
      setProfile(nextProfile)
      setSettings(nextSettings)
      setDashboard(nextDashboard)
    } catch (err) {
      setError(err.message || 'We could not refresh your account data.')
    } finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [])

  const signOut = async () => {
    setMobileMenu(false)
    await supabase.auth.signOut()
    onExit()
  }

  const selectTab = (next) => {
    setTab(next)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <main className="account-shell account-v2">
    <style>{dashboardCss}</style>
    <aside className="account-sidebar account-sidebar-v2">
      <Logo/>
      <div>{tabs.map(([id, icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => selectTab(id)} aria-current={tab === id ? 'page' : undefined}>{icon} <span>{label}</span></button>)}</div>
      <a className="account-nav-link" href="/">⌂ <span>Website</span></a>
      <button className="account-signout" onClick={signOut}>↪ <span>Sign out</span></button>
    </aside>

    <section className="account-main account-main-v2">
      <header className="account-topbar">
        <div><p>PLAYER DASHBOARD</p><h1>{tab === 'overview' ? `Welcome, ${name}.` : tabs.find(x => x[0] === tab)?.[2]}</h1></div>
        <div className="account-header-actions">
          <div className="account-user"><span>{initials(name)}</span><div><b>{name}</b><small>{profile?.rank_bucket || meta.rocket_league_rank || 'Beta player'}</small></div></div>
          <button className="account-menu-button" aria-label="Open account menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu(v => !v)}>{mobileMenu ? '×' : '☰'}</button>
        </div>
        {mobileMenu && <div className="account-mobile-menu">
          {tabs.map(([id, icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => selectTab(id)}>{icon} {label}</button>)}
          <a href="/">⌂ Main website</a>
          <button className="signout" onClick={signOut}>↪ Sign out</button>
        </div>}
      </header>

      {error && <div className="account-alert"><span>{error}</span><button onClick={refresh}>Retry</button></div>}
      {loading ? <DashboardLoading/> : <>
        {tab === 'overview' && <Overview profile={profile} dashboard={dashboard} approved={approved} onDownload={downloadBeta}/>} 
        {tab === 'mechanics' && <Mechanics progress={dashboard.progress}/>} 
        {tab === 'sessions' && <Sessions sessions={dashboard.sessions}/>} 
        {tab === 'profile' && <Profile user={user} profile={profile} settings={settings} onProfile={setProfile} onSettings={setSettings}/>} 
      </>}
      <footer className="account-legal"><a href="/privacy">Privacy</a><a href="/terms">Beta Terms</a><span>© 2026 MechLab</span></footer>
    </section>
  </main>
}

function Overview({ profile, dashboard, approved, onDownload }) {
  const summary = useMemo(() => summarize(dashboard), [dashboard])
  return <>
    <div className={`beta-banner ${approved ? 'approved' : ''}`}>
      <i>✦</i><div><b>{approved ? `${BETA_VERSION} is ready` : 'Beta access requested'}</b><span>{approved ? 'Download the Windows beta, sign in with this account, then sync your first training session.' : 'Your account is in the approval queue. We’ll email you when access is granted.'}</span></div>
      {approved ? <button onClick={onDownload}>Download for Windows ↓</button> : <em>IN REVIEW</em>}
    </div>

    <div className="account-metrics live-metrics">
      <Metric label="SYNCED SESSIONS" value={summary.sessions}/>
      <Metric label="TOTAL ATTEMPTS" value={summary.attempts}/>
      <Metric label="AVG MECHANIC SCORE" value={summary.average == null ? '—' : Math.round(summary.average)} suffix={summary.average == null ? '' : '/100'}/>
      <Metric label="BEST SCORE" value={summary.best == null ? '—' : Math.round(summary.best)} suffix={summary.best == null ? '' : '/100'}/>
    </div>

    {dashboard.sessions.length === 0 ? <Empty title="No sessions synced yet" text="Your real mechanic scores, reps, and progress will appear here after the desktop app syncs your first training session."/> : <div className="account-grid live-grid">
      <article className="performance-card live-card"><header><div><span>RECENT ACTIVITY</span><b>Last {Math.min(7, dashboard.sessions.length)} sessions</b></div><strong>{summary.attempts}<small> attempts</small></strong></header><SessionBars sessions={dashboard.sessions.slice(0, 7).reverse()}/></article>
      <article className="focus-card live-card"><span>NEXT STEP</span><i>✦</i><h3>{summary.weakest ? prettyMechanic(summary.weakest.mechanic) : 'Complete a session'}</h3><p>{summary.weakest ? `Your current average is ${Math.round(summary.weakest.mean_score)}/100. Use the desktop coach to focus your next block.` : 'Start with Training Lab and sync your results to unlock progress tracking here.'}</p><div><span>DATA SOURCE</span><b>YOUR SYNCED REPS</b></div></article>
    </div>}

    <section className="dashboard-section"><div className="section-title"><span>GET STARTED</span><h2>Beta setup</h2></div><div className="beta-setup"><article><span>01</span><div><b>Download MechLab</b><p>{approved ? 'Use the official Windows beta build above.' : 'The download unlocks after approval.'}</p></div></article><article><span>02</span><div><b>Sign in</b><p>Use this same account in the desktop app.</p></div></article><article><span>03</span><div><b>Train + sync</b><p>Your sessions and mechanic progress appear here after sync.</p></div></article></div></section>
    {profile && <p className="account-footnote">Windows 10/11 · Beta build may trigger SmartScreen · BakkesMod telemetry is optional and intended for supported offline/freeplay workflows.</p>}
  </>
}

function Mechanics({ progress }) {
  const latest = useMemo(() => latestMechanics(progress), [progress])
  if (!latest.length) return <Empty title="No mechanic data yet" text="Complete and sync a training session in the Windows app. This page only displays your real synced scores."/>
  return <section className="dashboard-section no-top"><div className="section-title"><span>YOUR DATA</span><h2>Mechanic performance</h2><p>Latest synced result for each mechanic. No demo scores.</p></div><div className="mechanic-grid">{latest.map(item => <article className="mechanic-card" key={item.mechanic}><header><div><small>MECHANIC</small><h3>{prettyMechanic(item.mechanic)}</h3></div><strong>{Math.round(item.mean_score)}<small>/100</small></strong></header><div className="score-track"><i style={{ width: `${clamp(item.mean_score)}%` }}/></div><dl><div><dt>Attempts</dt><dd>{item.attempts}</dd></div><div><dt>Consistency</dt><dd>{formatPct(item.consistency)}</dd></div><div><dt>Best</dt><dd>{Math.round(item.best_score)}/100</dd></div><div><dt>Trend</dt><dd className={item.trend > 0 ? 'good' : item.trend < 0 ? 'bad' : ''}>{formatTrend(item.trend)}</dd></div></dl><small className="muted">Synced {formatDate(item.created_at)}</small></article>)}</div></section>
}

function Sessions({ sessions }) {
  if (!sessions.length) return <Empty title="No synced sessions" text="Once the desktop app syncs a session, it will appear here with its timestamp, duration, and attempts."/>
  return <section className="dashboard-section no-top"><div className="section-title"><span>HISTORY</span><h2>Training sessions</h2><p>{sessions.length} synced session{sessions.length === 1 ? '' : 's'}.</p></div><div className="session-list">{sessions.map(session => <article key={session.id}><div><b>{formatDateTime(session.recorded_at)}</b><small>{session.summary?.mode || session.summary?.source || 'MechLab session'}</small></div><span><small>DURATION</small>{formatDuration(session.duration_seconds)}</span><span><small>ATTEMPTS</small>{session.total_attempts}</span></article>)}</div></section>
}

function Profile({ user, profile, settings, onProfile, onSettings }) {
  const [profileBusy, setProfileBusy] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [failure, setFailure] = useState('')

  async function saveProfile(event) {
    event.preventDefault(); setProfileBusy(true); setMessage(''); setFailure('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try { onProfile(await updateProfile(values)); setMessage('Profile saved.') }
    catch (err) { setFailure(err.message || 'Could not save profile.') }
    finally { setProfileBusy(false) }
  }

  async function savePassword(event) {
    event.preventDefault(); setPasswordBusy(true); setMessage(''); setFailure('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (values.password !== values.confirm) { setFailure('Passwords do not match.'); setPasswordBusy(false); return }
    try {
      const { error } = await changePassword(values.password)
      if (error) throw error
      event.currentTarget.reset(); setMessage('Password updated.')
    } catch (err) { setFailure(err.message || 'Could not update password.') }
    finally { setPasswordBusy(false) }
  }

  async function toggleSetting(key) {
    const previous = settings
    const next = { ...(settings || {}), [key]: !settings?.[key] }
    onSettings(next)
    try { onSettings(await updateUserSettings(next)); setMessage('Settings saved.'); setFailure('') }
    catch (err) { onSettings(previous); setFailure(err.message || 'Could not save settings.') }
  }

  return <section className="dashboard-section no-top profile-layout">
    {(message || failure) && <div className={`profile-message ${failure ? 'error' : ''}`}>{failure || message}</div>}
    <article className="settings-card"><div className="section-title compact"><span>IDENTITY</span><h2>Player profile</h2></div><form onSubmit={saveProfile}><label>DISPLAY NAME<input name="display_name" required maxLength="40" defaultValue={profile?.display_name || ''}/></label><label>RANK<select name="rank_bucket" defaultValue={profile?.rank_bucket || 'Champion'}><option>Bronze–Gold</option><option>Platinum</option><option>Diamond</option><option>Champion</option><option>Grand Champion</option><option>Supersonic Legend</option></select></label><label>ACCOUNT EMAIL<input value={user.email || ''} disabled/></label><button className="button" disabled={profileBusy}>{profileBusy ? 'Saving…' : 'Save profile'}</button></form></article>

    <article className="settings-card"><div className="section-title compact"><span>SECURITY</span><h2>Change password</h2></div><form onSubmit={savePassword}><label>NEW PASSWORD<input name="password" type="password" minLength="8" autoComplete="new-password" required/></label><label>CONFIRM PASSWORD<input name="confirm" type="password" minLength="8" autoComplete="new-password" required/></label><button className="button" disabled={passwordBusy}>{passwordBusy ? 'Updating…' : 'Update password'}</button></form></article>

    <article className="settings-card wide"><div className="section-title compact"><span>PRIVACY + DATA</span><h2>Sync preferences</h2></div><div className="setting-list"><Toggle title="Cloud progress sync" text="Sync session summaries and mechanic progress to your account." checked={settings?.cloud_progress_sync ?? true} onChange={() => toggleSetting('cloud_progress_sync')}/><Toggle title="Usage analytics" text="Allow product usage events that help improve MechLab." checked={settings?.usage_analytics ?? false} onChange={() => toggleSetting('usage_analytics')}/><Toggle title="Contribute training data" text="Opt in to contributing eligible training samples for model and scoring improvements." checked={settings?.contribute_training_data ?? false} onChange={() => toggleSetting('contribute_training_data')}/></div></article>
  </section>
}

function Toggle({ title, text, checked, onChange }) { return <button className="setting-toggle" type="button" onClick={onChange}><div><b>{title}</b><small>{text}</small></div><i className={checked ? 'on' : ''}><span/></i></button> }
function Metric({ label, value, suffix = '' }) { return <article><span>{label}</span><strong>{value}<small>{suffix}</small></strong></article> }
function Empty({ title, text }) { return <article className="dashboard-empty dashboard-empty-v2"><span>YOUR TRAINING DATA</span><i>◇</i><h2>{title}</h2><p>{text}</p></article> }
function DashboardLoading() { return <div className="dashboard-loading"><i/><p>Loading your account…</p></div> }
function SessionBars({ sessions }) { const max = Math.max(...sessions.map(x => x.total_attempts || 0), 1); return <div className="activity-chart live-bars">{sessions.map(x => <i key={x.id} style={{ height: `${Math.max(12, (x.total_attempts || 0) / max * 100)}%` }}><span>{x.total_attempts || 0}</span></i>)}</div> }

function latestMechanics(progress) {
  const seen = new Set()
  return progress.filter(item => { if (seen.has(item.mechanic)) return false; seen.add(item.mechanic); return true })
}
function summarize({ sessions, progress }) {
  const latest = latestMechanics(progress)
  const scores = latest.map(x => Number(x.mean_score)).filter(Number.isFinite)
  const bestScores = latest.map(x => Number(x.best_score)).filter(Number.isFinite)
  return {
    sessions: sessions.length,
    attempts: sessions.reduce((sum, x) => sum + (x.total_attempts || 0), 0),
    average: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    best: bestScores.length ? Math.max(...bestScores) : null,
    weakest: latest.length ? [...latest].sort((a, b) => a.mean_score - b.mean_score)[0] : null,
  }
}
function prettyMechanic(value = '') { return value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function formatPct(v) { const n = Number(v); if (!Number.isFinite(n)) return '—'; return `${Math.round(n <= 1 ? n * 100 : n)}%` }
function formatTrend(v) { const n = Number(v); if (!Number.isFinite(n) || Math.abs(n) < .01) return '—'; return `${n > 0 ? '+' : ''}${n.toFixed(1)}` }
function formatDate(v) { return v ? new Date(v).toLocaleDateString() : '—' }
function formatDateTime(v) { return v ? new Date(v).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date' }
function formatDuration(seconds = 0) { const total = Math.max(0, Math.round(seconds)); const m = Math.floor(total / 60); const s = total % 60; return m ? `${m}m ${s}s` : `${s}s` }
function clamp(v) { return Math.max(0, Math.min(100, Number(v) || 0)) }
function initials(name) { return name.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase() || 'PL' }

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
  link.href = url; link.download = 'MechLab.exe'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url)
}

function Logo(){return <a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a>}

const dashboardCss = `
.account-v2{overflow:visible}.account-sidebar-v2{z-index:20}.account-sidebar-v2>div{margin-bottom:12px}.account-nav-link{border:0;background:none;color:#737583;text-align:left;padding:12px;font-size:11px;display:flex;gap:13px;text-decoration:none;margin-top:auto}.account-nav-link:hover{color:#fff}.account-signout{margin-top:4px!important}.account-main-v2{min-width:0}.account-topbar{position:relative}.account-header-actions{display:flex;align-items:center;gap:10px}.account-menu-button,.account-mobile-menu{display:none}.account-alert{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:12px 15px;margin:18px 0;border:1px solid #7d4652;background:#351923;color:#f0a4b4;font-size:11px}.account-alert button{border:1px solid #884b58;background:none;color:#ffd2db;padding:8px 12px}.beta-banner button{margin-left:auto;border:1px solid #a873ff55;background:#a873ff17;color:#d9c3f7;padding:10px 12px;font:8px var(--mono);cursor:pointer}.live-metrics{margin-top:12px}.live-metrics article>b{display:none}.live-card{min-height:260px}.live-grid{grid-template-columns:1.5fr .8fr}.live-bars{height:160px;margin-top:18px}.dashboard-section{margin-top:34px}.dashboard-section.no-top{margin-top:18px}.section-title{margin-bottom:18px}.section-title>span{font:7px var(--mono);letter-spacing:.12em;color:var(--purple)}.section-title h2{font-size:24px;margin:7px 0}.section-title p{font-size:11px;color:#858692;margin:6px 0}.section-title.compact h2{font-size:20px}.dashboard-empty-v2{margin-top:22px}.account-footnote{color:#696b77;font-size:9px;line-height:1.6;margin-top:22px}.mechanic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mechanic-card{border:1px solid var(--line);background:#10121a;padding:20px}.mechanic-card header{display:flex;justify-content:space-between;gap:20px}.mechanic-card header small,.mechanic-card .muted{font:7px var(--mono);color:#737481}.mechanic-card h3{margin:6px 0 0;font-size:17px}.mechanic-card header strong{font-size:26px}.mechanic-card header strong small{font-size:8px;color:#777}.score-track{height:4px;background:#292b35;margin:18px 0}.score-track i{display:block;height:100%;background:linear-gradient(90deg,#754cab,var(--purple))}.mechanic-card dl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 16px}.mechanic-card dl div{background:#151720;padding:10px}.mechanic-card dt{font:6px var(--mono);color:#747582}.mechanic-card dd{margin:7px 0 0;font-size:13px}.mechanic-card dd.good{color:var(--lime)}.mechanic-card dd.bad{color:#ff9cae}.session-list{display:grid;gap:8px}.session-list article{display:grid;grid-template-columns:1fr 150px 100px;gap:20px;align-items:center;border:1px solid var(--line);background:#10121a;padding:17px 18px}.session-list article>div{display:grid}.session-list b{font-size:12px}.session-list small{font:7px var(--mono);color:#747582;margin-top:5px}.session-list article>span{display:grid;font-size:14px}.profile-layout{display:grid;grid-template-columns:1fr 1fr;gap:12px}.settings-card{border:1px solid var(--line);background:#10121a;padding:22px}.settings-card.wide{grid-column:1/-1}.settings-card form{display:grid;gap:14px}.settings-card label{display:grid;gap:7px;font:7px var(--mono);color:#858692}.settings-card input,.settings-card select{width:100%;padding:12px;border:1px solid #30323d;background:#0b0d14;color:#f3eff7;font:11px Manrope}.settings-card input:disabled{color:#6d6e79}.settings-card .button{border:0;cursor:pointer;margin-top:4px}.settings-card .button:disabled{opacity:.5}.profile-message{grid-column:1/-1;border:1px solid #637b43;background:#1a2515;color:#caff9e;padding:11px 13px;font-size:10px}.profile-message.error{border-color:#7d4652;background:#351923;color:#f0a4b4}.setting-list{display:grid}.setting-toggle{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 0;border:0;border-top:1px solid var(--line);background:none;color:white;text-align:left;cursor:pointer}.setting-toggle:first-child{border-top:0}.setting-toggle>div{display:grid;gap:5px}.setting-toggle b{font-size:11px}.setting-toggle small{font-size:9px;color:#777986;line-height:1.5}.setting-toggle>i{flex:0 0 42px;width:42px;height:23px;border-radius:20px;background:#292b35;padding:3px;transition:.2s}.setting-toggle>i span{display:block;width:17px;height:17px;border-radius:50%;background:#767784;transition:.2s}.setting-toggle>i.on{background:#a873ff66}.setting-toggle>i.on span{transform:translateX(19px);background:#dec6ff}.dashboard-loading{min-height:50vh;display:grid;place-items:center;align-content:center;gap:14px;color:#7d7e89;font-size:10px}.dashboard-loading i{width:32px;height:32px;border:2px solid #2c2e38;border-top-color:var(--purple);border-radius:50%;animation:spin .7s linear infinite}.account-legal{display:flex;gap:16px;align-items:center;margin-top:36px;padding-top:18px;border-top:1px solid var(--line);font:7px var(--mono);color:#646672}.account-legal a{color:#8d8e99;text-decoration:none}.account-legal span{margin-left:auto}
.auth-text-action{justify-self:end;border:0;background:none;color:#b899e3;font-size:10px;cursor:pointer;padding:0}
@media(max-width:900px){.mechanic-grid{grid-template-columns:1fr}.profile-layout{grid-template-columns:1fr}.settings-card.wide{grid-column:auto}.session-list article{grid-template-columns:1fr 100px 75px}.live-grid{grid-template-columns:1fr}}
@media(max-width:700px){.account-sidebar-v2{display:none!important}.account-main-v2{padding:20px 15px 35px!important}.account-topbar{gap:10px;align-items:flex-start!important}.account-header-actions{margin-left:auto}.account-user div{display:none!important}.account-menu-button{display:grid;width:42px;height:42px;place-items:center;border:1px solid #30323d;background:#11131c;color:#f5f2fa;font-size:20px;line-height:1;cursor:pointer}.account-mobile-menu{display:grid;position:absolute;z-index:40;top:55px;right:0;width:min(280px,calc(100vw - 30px));background:#0d0f16;border:1px solid #343641;box-shadow:0 18px 50px #000c;padding:8px}.account-mobile-menu button,.account-mobile-menu a{display:block;width:100%;padding:14px 12px;border:0;border-bottom:1px solid #ffffff0d;background:none;color:#d8d5de;text-decoration:none;text-align:left;font:11px var(--mono);cursor:pointer}.account-mobile-menu button.active{color:#d5b9ff;background:#a873ff10}.account-mobile-menu .signout{border-bottom:0;color:#ff9cae}.beta-banner{display:grid;grid-template-columns:36px 1fr;gap:12px}.beta-banner button{grid-column:1/-1;margin:0;width:100%}.account-metrics{grid-template-columns:1fr 1fr!important}.live-metrics strong{font-size:22px}.mechanic-card dl{grid-template-columns:1fr 1fr}.session-list article{grid-template-columns:1fr 1fr}.session-list article>div{grid-column:1/-1}.session-list article>span:last-child{text-align:right}.profile-layout{display:grid}.settings-card{padding:18px}.setting-toggle{align-items:flex-start}.section-title h2{font-size:22px}.beta-setup{display:grid!important}.beta-setup article{min-width:0}.dashboard-empty{padding-inline:18px}.account-legal{flex-wrap:wrap}.account-legal span{width:100%;margin-left:0}}
`

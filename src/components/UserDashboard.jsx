import { supabase } from '../lib/supabase'

const activity = [82, 88, 84, 91, 89, 94, 92]
export default function UserDashboard({ user, onExit }) {
  const meta = user.user_metadata || {}
  const name = meta.display_name || user.email?.split('@')[0] || 'Player'
  return <main className="account-shell">
    <aside className="account-sidebar"><Logo/><div><button className="active">⌁ <span>Overview</span></button><button>◎ <span>Mechanics</span></button><button>⌗ <span>Sessions</span></button><button>◇ <span>Profile</span></button></div><button onClick={async () => { await supabase.auth.signOut(); onExit() }}>↪ <span>Sign out</span></button></aside>
    <section className="account-main"><header><div><p>PLAYER DASHBOARD</p><h1>Welcome back, {name}.</h1></div><div className="account-user"><span>{name.slice(0,2).toUpperCase()}</span><div><b>{name}</b><small>{meta.rocket_league_rank || 'Beta player'}</small></div></div></header>
      <div className="beta-banner"><i>✦</i><div><b>Beta access requested</b><span>Your profile is ready. We’ll notify you as soon as your build is available.</span></div><em>{meta.beta_status === 'accepted' ? 'ACCESS GRANTED' : 'IN REVIEW'}</em></div>
      <div className="account-metrics"><article><span>OVERALL SCORE</span><strong>92<small>/100</small></strong><b>↗ 7.4% this month</b></article><article><span>TOTAL REPS</span><strong>1,248</strong><b>+86 this week</b></article><article><span>TRAINING STREAK</span><strong>16<small> days</small></strong><b>Personal best</b></article><article><span>TOP MECHANIC</span><strong>94</strong><b>Fast aerial</b></article></div>
      <div className="account-grid"><article className="performance-card"><header><div><span>PERFORMANCE TREND</span><b>Last 7 sessions</b></div><strong>+12.4% <small>↗ improving</small></strong></header><div className="activity-chart">{activity.map((value,index)=><i key={index} style={{height:`${value-35}%`}}><span>{value}</span></i>)}</div><footer>{['S1','S2','S3','S4','S5','S6','NOW'].map(x=><span key={x}>{x}</span>)}</footer></article><article className="focus-card"><span>NEXT FOCUS</span><i>✦</i><h3>Second-jump timing</h3><p>Release pitch 40ms earlier to improve fast-aerial acceleration.</p><div><span>IMPACT</span><b>HIGH</b></div><button>Open training plan →</button></article></div>
      <div className="recent-card"><header><div><span>MECHANIC PROGRESS</span><h3>Your strongest mechanics</h3></div><button>View all →</button></header>{[['Fast aerial','94','+6%'],['Half flip','91','+4%'],['Speed flip','87','+12%']].map(x=><div className="mechanic-row" key={x[0]}><i>{x[0][0]}</i><b>{x[0]}<small>Consistency improving</small></b><span><i style={{width:`${x[1]}%`}}/></span><strong>{x[1]}<small>{x[2]}</small></strong></div>)}</div>
    </section>
  </main>
}

function Logo(){return <a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a>}

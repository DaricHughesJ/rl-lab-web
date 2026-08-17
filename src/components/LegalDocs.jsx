const supportEmail = 'support@mechlab.gg'

export default function LegalDocs({ type }) {
  const privacy = type === 'privacy'
  return <main className="legal-shell">
    <style>{css}</style>
    <header><a className="brand" href="/"><i/><b>MECH<span>LAB</span></b></a><a href="/">← Back to MechLab</a></header>
    <article>
      <p className="eyebrow">MECHLAB BETA · LAST UPDATED AUGUST 17, 2026</p>
      <h1>{privacy ? 'Privacy Policy' : 'Beta Terms'}</h1>
      {privacy ? <Privacy/> : <Terms/>}
      <footer>Questions: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></footer>
    </article>
  </main>
}

function Privacy() { return <>
  <h2>What MechLab collects</h2><p>Your account uses Supabase Auth. We store the account email needed to authenticate you, your player profile, beta access state, and—when cloud sync is enabled—session summaries and mechanic progress associated with your account.</p>
  <h2>Training data</h2><p>Raw local training data is not automatically treated as public. Optional contribution of eligible training samples is controlled separately in your account settings. Turning that option off does not remove data you deliberately submitted earlier; contact support if you need a deletion request reviewed.</p>
  <h2>Analytics</h2><p>Product usage analytics are optional. You can change the analytics preference from your MechLab account dashboard.</p>
  <h2>Service providers</h2><p>MechLab uses service providers including Supabase for authentication/data services, Cloudflare for website and delivery infrastructure, and Resend for transactional email delivery. Those providers process information needed to operate their respective services.</p>
  <h2>Retention and deletion</h2><p>We retain account and synced product data while your beta account is active or while reasonably needed to operate and secure the service. You may contact support to request account or synced-data deletion.</p>
  <h2>Security</h2><p>MechLab uses authenticated access controls and row-level security for account data. No internet service can guarantee absolute security, so beta users should avoid submitting information unrelated to MechLab training.</p>
  <h2>Changes</h2><p>This beta policy may change as the product changes. Material changes will be reflected by updating the date above.</p>
</> }

function Terms() { return <>
  <h2>Beta software</h2><p>MechLab is pre-release software provided for testing. Features, scoring thresholds, availability, and data formats may change, and the beta may contain defects.</p>
  <h2>Scoring</h2><p>Current mechanic scoring thresholds are provisional while MechLab is calibrated with real training reps. Relative changes across sessions can be useful, but absolute scores should not be treated as an official Rocket League skill rating.</p>
  <h2>Supported use</h2><p>Use the beta only in supported workflows. Some telemetry features may require optional tooling such as BakkesMod and may be limited to freeplay or offline environments. Do not use MechLab to bypass Rocket League, Psyonix, Epic Games, tournament, or anti-cheat rules.</p>
  <h2>Account responsibility</h2><p>You are responsible for maintaining the security of your account credentials and for activity performed through your account.</p>
  <h2>No affiliation</h2><p>MechLab is an independent project and is not affiliated with, endorsed by, or sponsored by Psyonix or Epic Games.</p>
  <h2>Availability</h2><p>Beta access can be changed, suspended, or discontinued as needed for testing, security, abuse prevention, or product changes.</p>
  <h2>Feedback</h2><p>If you submit beta feedback, you permit MechLab to use that feedback to improve the product without an obligation to compensate you.</p>
</> }

const css = `
.legal-shell{min-height:100vh;background:radial-gradient(circle at 70% 0,#43236633,transparent 28%),#08090e;color:#f5f2f8;padding-bottom:70px}.legal-shell>header{height:72px;display:flex;align-items:center;justify-content:space-between;max-width:900px;margin:auto;padding:0 24px;border-bottom:1px solid #292b36}.legal-shell>header>a:last-child{font-size:11px;color:#aaaab6;text-decoration:none}.legal-shell article{max-width:760px;margin:70px auto 0;padding:0 24px}.legal-shell .eyebrow{font:8px var(--mono);letter-spacing:.12em;color:#a873ff}.legal-shell h1{font-size:clamp(44px,7vw,72px);margin:16px 0 45px}.legal-shell h2{font-size:20px;margin:32px 0 10px}.legal-shell p{font-size:13px;line-height:1.8;color:#a9a9b4}.legal-shell footer{margin-top:50px;padding-top:22px;border-top:1px solid #292b36;color:#777986;font-size:11px}.legal-shell footer a{color:#c7a9ef}
`

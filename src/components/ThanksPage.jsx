import { useEffect } from 'react'
import LabChrome from './LabChrome'
import { track } from '../lib/waitlist'

export default function ThanksPage() {
  useEffect(() => {
    track('page_view', { page: 'thanks' })
  }, [])

  return (
    <LabChrome active="thanks">
      <header className="lab-hero">
        <p className="v2-specimen">YOU ARE ON THE LIST</p>
        <h1>Thanks. We will email you.</h1>
        <p className="lab-lede">
          Next: we open seats in waves for PC players who train with EAC off. Watch your inbox.
        </p>
      </header>

      <section className="v2-section dbg-thanks">
        <article>
          <h2>While you wait</h2>
          <ul>
            <li>Read the <a href="/roadmap">roadmap</a> for what ships and what is unfinished.</li>
            <li>Skim the <a href="/faq">FAQ</a> so EAC-off expectations are clear.</li>
            <li>Email <a href="mailto:support@mechlab.gg">support@mechlab.gg</a> if your setup is unusual.</li>
          </ul>
        </article>
        <a className="v2-button primary" href="/">Back to home <span>→</span></a>
      </section>
    </LabChrome>
  )
}

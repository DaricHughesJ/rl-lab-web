import LabChrome from './LabChrome'
import { withUtms } from '../lib/utm'

const rows = [
  ['What you look at', 'Each attempt', 'Sessions and lessons', 'Whole match'],
  ['Why an input failed', 'Core job', 'Partial', 'Weak'],
  ['Evidence you can reopen', 'Yes', 'Low', 'Charts'],
  ['Best fit', 'Mechanic grinders', 'Broad ranked climb', 'Game outcomes'],
]

export default function ComparePage() {
  const early = withUtms('/waitlist')
  return (
    <LabChrome active="compare">
      <header className="lab-hero">
        <p className="v2-specimen">COMPARE</p>
        <h1>MechLab vs AI coach apps vs replay stats.</h1>
        <p className="lab-lede">
          Different jobs. MechLab is for per-rep diagnosis in training, not match summaries or lesson libraries.
        </p>
      </header>

      <section className="v2-section">
        <div className="dbg-table-wrap">
          <table className="dbg-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>MechLab</th>
                <th>AI coach apps</th>
                <th>Replay stats</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={`${row[0]}-${i}`} className={i === 1 ? 'hl' : undefined}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>NEXT</p>
          <h2>See a failed rep next to a clean one.</h2>
          <span>That is the product moment. Everything else is support.</span>
        </div>
        <a className="v2-button primary" href={early}>Get early access <span>→</span></a>
      </section>
    </LabChrome>
  )
}

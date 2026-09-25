import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { getLaunchSurveyResponse, submitLaunchSurvey } from '../lib/supabase'
import type { LaunchSurveyAnswers, LaunchSurveyForm } from '../contracts/launchSurvey'

const mechanics = ['Fast Aerial', 'Air Dribble', 'Flip Reset', 'Wave Dash', 'Half Flip', 'Other']
const features = [
  'More mechanics',
  'More accurate attempt detection',
  'Clearer coaching',
  'Progress tracking over time',
  'Replay or session review',
  'Easier installation and updates',
  'Other',
]

export default function LaunchSurvey({ user }: { user: User }) {
  const [existing, setExisting] = useState<boolean | undefined>(undefined)
  const [answers, setAnswers] = useState<LaunchSurveyForm>({
    play_frequency: '',
    player_level: '',
    mechanic_interests: [],
    product_clarity: '',
    product_description: '',
    setup_ease: '',
    setup_surprises: '',
    feedback_usefulness: '',
    feedback_clarity: '',
    detection_accuracy: '',
    worked_well: '',
    frustrations: '',
    issues: '',
    continued_use: '',
    recommendation: '',
    recommendation_reason: '',
    next_feature: '',
    retest: '',
    anything_else: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let current = true
    getLaunchSurveyResponse().then((response) => {
      if (current) setExisting(Boolean(response))
    }).catch(() => {
      if (current) {
        setError('We could not check your survey status. Refresh this page to try again.')
        setExisting(false)
      }
    })
    return () => { current = false }
  }, [])

  function set(name: keyof LaunchSurveyForm, value: string) {
    setAnswers((previous) => ({ ...previous, [name]: value } as LaunchSurveyForm))
  }

  function toggle(value: string) {
    setAnswers((previous) => ({
      ...previous,
      mechanic_interests: previous.mechanic_interests.includes(value as LaunchSurveyAnswers['mechanic_interests'][number])
        ? previous.mechanic_interests.filter((item) => item !== value)
        : [...previous.mechanic_interests, value as LaunchSurveyAnswers['mechanic_interests'][number]],
    }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const requiredAnswers = [
      'play_frequency', 'player_level', 'product_clarity', 'setup_ease',
      'feedback_usefulness', 'feedback_clarity', 'detection_accuracy',
      'continued_use', 'recommendation', 'next_feature', 'retest',
    ] as const satisfies readonly (keyof LaunchSurveyForm)[]
    if (requiredAnswers.some((key) => !answers[key]) || answers.mechanic_interests.length === 0) {
      setError('Choose one answer for each question and at least one mechanic.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await submitLaunchSurvey(answers as LaunchSurveyAnswers)
      setSubmitted(true)
      setExisting(true)
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
        setExisting(true)
        setError('A response has already been submitted for this account.')
      } else {
        const message = err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
            ? err.message
            : ''
        setError(message || 'Your response could not be saved. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'player'

  return <main className="launch-survey-page">
    <div className="launch-survey-wrap">
      <a className="launch-survey-brand" href="/">MECHLAB</a>
      <header className="launch-survey-header">
        <p className="v2-specimen">ALPHA PLAYER FEEDBACK</p>
        <h1>Help us get MechLab ready.</h1>
        <p>Your honest feedback helps us decide what to fix before launch. Most questions are quick taps; share details in the comment boxes if you like.</p>
        <span className="launch-survey-account">Signed in as {name}</span>
      </header>

      {existing === undefined ? <div className="launch-survey-state">Checking your account…</div>
        : existing || submitted ? <section className="launch-survey-state" role="status">
          <span className="launch-survey-check">✓</span>
          <h2>{submitted ? 'Thanks for helping us improve MechLab.' : 'Your response is already in.'}</h2>
          <p>One response is allowed for each account. Thanks for taking the time to help with the launch.</p>
        </section>
          : <form className="launch-survey-form" onSubmit={onSubmit}>
            <Question title="How often do you play Rocket League?" name="play_frequency" value={answers.play_frequency} options={['Daily', 'Several times a week', 'About once a week', 'Less often']} onChange={set}/>
            <Question title="How would you describe your current level?" name="player_level" value={answers.player_level} options={['New or returning', 'Casual', 'Competitive', 'High-ranked or highly experienced', 'Prefer not to say']} onChange={set}/>
            <Question title="Which mechanics are you most interested in improving?" name="mechanic_interests" value={answers.mechanic_interests} options={mechanics} multiple onChange={(_name, value) => toggle(value)}/>
            <Question title="Before trying MechLab, how clear was it what the product does?" name="product_clarity" value={answers.product_clarity} options={['Very clear', 'Mostly clear', 'Somewhat unclear', 'Very unclear']} onChange={set}/>
            <Comment name="product_description" title="After trying it, how would you describe what MechLab helps you do?" value={answers.product_description} onChange={set}/>
            <Question title="How easy was it to install and get started?" name="setup_ease" value={answers.setup_ease} options={['Very easy', 'Easy', 'Neither easy nor difficult', 'Difficult', 'Very difficult', 'I could not get started']} onChange={set}/>
            <Comment name="setup_surprises" title="Did anything about setup or your first session confuse or surprise you?" value={answers.setup_surprises} onChange={set}/>
            <Question title="How useful was the feedback on your attempts?" name="feedback_usefulness" value={answers.feedback_usefulness} options={['Extremely useful', 'Very useful', 'Somewhat useful', 'Slightly useful', 'Not useful', 'I did not get feedback']} onChange={set}/>
            <Question title="How easy was the feedback to understand?" name="feedback_clarity" value={answers.feedback_clarity} options={['Very easy', 'Mostly easy', 'Sometimes confusing', 'Often confusing', 'I did not get feedback']} onChange={set}/>
            <Question title="Did MechLab correctly recognize what happened in your attempts?" name="detection_accuracy" value={answers.detection_accuracy} options={['Almost always', 'Usually', 'About half the time', 'Rarely', 'Not sure / did not try enough']} onChange={set}/>
            <Comment name="worked_well" title="What worked especially well?" value={answers.worked_well} onChange={set}/>
            <Comment name="frustrations" title="What felt frustrating, unreliable, or missing?" value={answers.frustrations} onChange={set}/>
            <Comment name="issues" title="Did you hit a crash, install problem, missed attempt, or other issue?" hint="If so, what were you doing when it happened?" value={answers.issues} onChange={set}/>
            <Question title="How likely are you to keep using MechLab?" name="continued_use" value={answers.continued_use} options={['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not']} onChange={set}/>
            <Question title="How likely are you to recommend MechLab to another Rocket League player?" name="recommendation" value={answers.recommendation} options={['0 · Not at all likely', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 · Extremely likely']} onChange={set}/>
            <Comment name="recommendation_reason" title="What would need to improve before you would recommend it?" value={answers.recommendation_reason} onChange={set}/>
            <Question title="Which improvement would be most valuable to you next?" name="next_feature" value={answers.next_feature} options={features} onChange={set}/>
            <Question title="Would you try another build and share feedback?" name="retest" value={answers.retest} options={['Yes', 'Maybe', 'No']} onChange={set}/>
            <Comment name="anything_else" title="Anything else we should know before launch?" value={answers.anything_else} onChange={set}/>
            {error && <p className="launch-survey-error" role="alert">{error}</p>}
            <button type="submit" className="v2-button primary launch-survey-submit" disabled={busy}>
              {busy ? 'Saving your response…' : 'Submit feedback'}
            </button>
            <p className="launch-survey-footnote">Your response is tied to your account so each player can submit once.</p>
          </form>}
      <footer className="launch-survey-footer"><a href="/">Back to MechLab</a><span>© 2026 MechLab</span></footer>
    </div>
    <style>{styles}</style>
  </main>
}

function Question({ title, name, value, options, multiple = false, onChange }: {
  title: string
  name: keyof LaunchSurveyAnswers
  value: string | string[]
  options: readonly string[]
  multiple?: boolean
  onChange: (name: keyof LaunchSurveyForm, value: string) => void
}) {
  const selected = multiple ? value : [value]
  return <fieldset className="launch-survey-question">
    <legend>{title}{multiple && <small> Select all that apply</small>}</legend>
    <div className="launch-survey-options">
      {options.map((option) => {
        const active = selected.includes(option)
        return <button key={option} type="button" role={multiple ? 'checkbox' : 'radio'} className={`launch-survey-option${active ? ' selected' : ''}`} aria-checked={active} onClick={() => onChange(name, option)}>
          <span className={`launch-survey-option-mark${multiple ? '' : ' radio'}`} aria-hidden="true">{multiple && active ? '✓' : ''}</span>{option}
        </button>
      })}
    </div>
  </fieldset>
}

function Comment({ name, title, hint, value, onChange }: {
  name: keyof LaunchSurveyAnswers
  title: string
  hint?: string
  value: string
  onChange: (name: keyof LaunchSurveyForm, value: string) => void
}) {
  return <label className="launch-survey-comment">
    <span>{title}</span>
    {hint && <small>{hint}</small>}
    <textarea name={name} rows={3} maxLength={1500} value={value} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(name, event.target.value)} placeholder="Add a comment (optional)" />
  </label>
}

const styles = `
.launch-survey-page{min-height:100vh;padding:clamp(20px,5vw,64px) 16px 36px;background:radial-gradient(ellipse at 85% 0,#263d3b48,transparent 42%),#090b10;color:#f4f2f8;font-family:Manrope,Arial,sans-serif}
.launch-survey-wrap{width:min(760px,100%);margin:auto}.launch-survey-brand{color:#d4a8ff;font:700 12px monospace;letter-spacing:.2em;text-decoration:none}.launch-survey-header{padding:42px 0 30px}.launch-survey-header .v2-specimen{font:10px monospace;letter-spacing:.16em;color:#91e2d9}.launch-survey-header h1{font-size:clamp(34px,7vw,56px);letter-spacing:-.055em;line-height:1.04;margin:14px 0}.launch-survey-header>p:not(.v2-specimen){max-width:610px;color:#a5a4af;font-size:15px;line-height:1.7}.launch-survey-account{display:inline-flex;margin-top:10px;border:1px solid #ffffff1b;border-radius:999px;padding:8px 12px;color:#bbb9c4;font-size:12px}
.launch-survey-form{display:grid;gap:12px}.launch-survey-question,.launch-survey-comment{min-width:0;margin:0;padding:20px 22px;border:1px solid #ffffff17;border-radius:14px;background:#11141bd9}.launch-survey-question legend{max-width:100%;padding:0;color:#f3f0f8;font-size:15px;font-weight:700;line-height:1.5}.launch-survey-question legend small{display:block;margin-top:4px;color:#8e909c;font-size:11px;font-weight:400}.launch-survey-options{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.launch-survey-option{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:8px 13px;border:1px solid #343541;border-radius:9px;background:#0b0e15;color:#c6c4ce;font:500 13px Manrope,Arial,sans-serif;cursor:pointer;transition:background .15s,border-color .15s,color .15s}.launch-survey-option:hover{border-color:#8c70a9;color:#fff}.launch-survey-option.selected{border-color:#9271ba;background:#392b4c;color:#fff}.launch-survey-option-mark{display:grid;place-items:center;width:16px;height:16px;border:1px solid #555460;border-radius:5px;color:#b6ffb3;font-size:11px}.launch-survey-option.selected .launch-survey-option-mark{border-color:#a78bc7;background:#624b7a}.launch-survey-comment{display:grid;gap:9px;color:#f3f0f8;font-size:14px;font-weight:700}.launch-survey-comment small{color:#9999a5;font-size:12px;font-weight:400}.launch-survey-comment textarea{width:100%;resize:vertical;min-height:86px;padding:12px 14px;border:1px solid #343541;border-radius:9px;outline:none;background:#0b0e15;color:#f5f3fa;font:14px/1.55 Manrope,Arial,sans-serif}.launch-survey-comment textarea:focus{border-color:#a78bc7;box-shadow:0 0 0 3px #a78bc726}.launch-survey-comment textarea::placeholder{color:#777985}.launch-survey-submit{justify-self:start;min-height:48px;padding-inline:24px;border:0;cursor:pointer}.launch-survey-submit:disabled{opacity:.6;cursor:wait}.launch-survey-error{margin:0;padding:12px;border:1px solid #8d4052;border-radius:8px;background:#3c172033;color:#ed9aad;font-size:13px}.launch-survey-footnote{margin:-2px 0 14px;color:#868793;font-size:11px}.launch-survey-state{margin:20px 0;padding:32px;border:1px solid #ffffff1b;border-radius:14px;background:#11141bd9}.launch-survey-state h2{margin:12px 0;font-size:24px}.launch-survey-state p{color:#a5a4af;line-height:1.6}.launch-survey-check{display:grid;place-items:center;width:38px;height:38px;border:1px solid #66844f;border-radius:50%;color:#b6ffb3}.launch-survey-footer{display:flex;justify-content:space-between;margin-top:32px;padding-top:17px;border-top:1px solid #ffffff16;color:#858692;font-size:12px}.launch-survey-footer a{color:#b7a5c8;text-decoration:none}
.launch-survey-option-mark.radio{border-radius:50%}.launch-survey-option.selected .launch-survey-option-mark.radio:after{content:'';width:6px;height:6px;border-radius:50%;background:#fff}.launch-survey-option:focus-visible,.launch-survey-submit:focus-visible{outline:3px solid #bda0e5;outline-offset:2px}
@media(max-width:540px){.launch-survey-header{padding:32px 0 22px}.launch-survey-question,.launch-survey-comment{padding:16px}.launch-survey-option{min-height:40px;font-size:12px}.launch-survey-options{gap:7px}.launch-survey-question legend{font-size:14px}}
`

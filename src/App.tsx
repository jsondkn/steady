import { useState } from 'react'
import { Button, Card, Icon, Tag } from '@blueprintjs/core'
import type { Activity, Mood } from './data'
import { activities, moods, sampleWeek, supportLinks } from './data'

type Page = 'checkin' | 'overview' | 'activities' | 'activity' | 'support'

function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 8.2 14.6 2v12.1C14.6 21.3 9.9 25.7 3 27V8.2Z" fill="currentColor"/><path d="M18 14.1C18 7.1 22.3 3.6 29 2v16.4C29 24.8 24.6 29 18 30V14.1Z" fill="currentColor"/></svg>
}

function Header({ onSupport }: { onSupport: () => void }) {
  return <header className="topbar">
    <div className="brand"><BrandMark /><span>Steady</span></div>
    <Button className="support-link" minimal onClick={onSupport} aria-label="Open Support"><span>Support</span></Button>
  </header>
}

function BackLink({ onClick }: { onClick: () => void }) {
  return <button type="button" className="back-link" onClick={onClick}><Icon icon="arrow-left" size={15} /> Back</button>
}

function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="screen-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
}

function MoodFace({ mood }: { mood: Mood }) {
  const mouth = mood === 'Very good' || mood === 'Good' ? 'M20 25 Q25 31 30 25' : mood === 'Okay' ? 'M20 27 H30' : mood === 'Low' ? 'M20 30 Q25 24 30 30' : 'M19 31 Q25 23 31 31'
  return <svg className="mood-face-svg" viewBox="0 0 50 50" aria-hidden="true">
    <circle cx="25" cy="25" r="21" fill="none" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="19" cy="20" r="1.7" fill="currentColor" /><circle cx="31" cy="20" r="1.7" fill="currentColor" />
    <path d={mouth} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
}

function Checkin({
  mood, setMood, onOverview, onActivities,
}: { mood: Mood | null; setMood: (value: Mood) => void; onOverview: () => void; onActivities: () => void }) {
  const [contextOpen, setContextOpen] = useState(false)
  const [context, setContext] = useState('')
  const [reflectionOpen, setReflectionOpen] = useState(false)
  const [reflection, setReflection] = useState('')
  return <main className="page checkin-page">
    <ScreenTitle title="How are you feeling today?" subtitle="Start with how today feels. Add more detail only if it helps." />
    <section className="field-group" aria-labelledby="mood-label">
      <h2 id="mood-label" className="section-heading">Choose the closest match</h2>
      <div className="mood-grid" role="group" aria-label="Choose your mood">
        {moods.map(({ label }) => <button key={label} type="button" className={`mood-option ${mood === label ? 'is-selected' : ''}`} aria-pressed={mood === label} onClick={() => setMood(label)}>
          <MoodFace mood={label} /><span>{label}</span>
        </button>)}
      </div>
    </section>
    <button type="button" className="reflection-link" aria-expanded={reflectionOpen} onClick={() => setReflectionOpen(v => !v)}>
      Not sure how you feel? Talk it through with Steady<Tag className="ai-tag">AI-assisted</Tag>
    </button>
    
    {reflectionOpen && <div className="reflection-note" role="region" aria-label="Reflection prompt">
      <p>This prototype does not include a live AI chat. If it helps, add a note below; it stays in this browser session.</p>
      <textarea aria-label="Optional reflection" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="What is on your mind? (optional)" rows={2} />
    </div>}
    <section className="context-section">
      <button type="button" className={`context-toggle ${contextOpen ? 'open' : ''}`} aria-expanded={contextOpen} onClick={() => setContextOpen(v => !v)}>
        <Icon icon="properties" size={18} /><span className="context-copy"><strong>Add context (optional)</strong><small>Share what may have affected your day.</small></span><Icon className="toggle-chevron" icon={contextOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </button>
      {contextOpen && <div className="context-input"><label htmlFor="context-note">Anything else you want to note?</label><textarea id="context-note" value={context} onChange={e => setContext(e.target.value)} placeholder="Add a note (optional)" rows={3} /><small>This stays in this browser session and clears when you refresh.</small></div>}
    </section>
    <section className="field-group next-choice-group" aria-labelledby="next-choice-label">
      <h2 id="next-choice-label" className="section-heading">What would help right now?</h2>
      <div className="choice-list">
        <button type="button" className="choice-card" onClick={onOverview}>
          <span aria-hidden="true" /><span><strong>View your wellbeing overview</strong><small>Review mood, sleep and activity.</small></span><Icon className="choice-chevron" icon="chevron-right" />
        </button>
        <button type="button" className="choice-card" onClick={onActivities}>
          <span aria-hidden="true" /><span><strong>Try an activity</strong><small>Find something suited to your time and energy.</small></span><Icon className="choice-chevron" icon="chevron-right" />
        </button>
      </div>
    </section>
  </main>
}

function TrendBars({ values, labels, mode, currentMood }: { values: number[]; labels: string[]; mode: 'mood' | 'sleep' | 'activity'; currentMood?: Mood | null }) {
  const moodHeight: Record<Mood, number> = { 'Very good': 84, Good: 68, Okay: 50, Low: 34, 'Very low': 19 }
  return <div className={`trend-chart chart-${mode}`} role="img" aria-label={mode === 'mood' ? `Mood entries this session: ${currentMood ? `today ${currentMood}` : 'none yet'}. No earlier entries are stored.` : `${mode === 'sleep' ? 'Illustrative sleep duration' : 'Illustrative step count'} over seven days`}>
    <div className="chart-baseline" />
    {labels.map((day, i) => {
      const hasData = mode !== 'mood' || (i === 6 && Boolean(currentMood))
      const height = mode === 'mood' ? (currentMood && i === 6 ? moodHeight[currentMood] : 0) : mode === 'sleep' ? (values[i] / 8) * 100 : (values[i] / 8000) * 100
      return <div className={`chart-column ${hasData ? '' : 'no-data'}`} key={day}>
        {hasData ? <div className="bar-wrap"><div className={`bar ${mode === 'mood' && i === 6 ? 'current-bar' : ''}`} style={{ height: `${Math.max(height, 3)}%` }} title={mode === 'mood' ? (currentMood ?? '') : String(values[i])} /></div> : <div className="bar-wrap"><span className="no-data-dot" aria-hidden="true">—</span></div>}
        <span className={i === 6 && mode === 'mood' && currentMood ? 'today-label' : ''}>{day}</span>
      </div>
    })}
  </div>
}

function MetricIcon({ type }: { type: 'mood' | 'sleep' | 'activity' }) {
  const icon = type === 'mood' ? 'emoji' : type === 'sleep' ? 'time' : 'walk'
  return <span className="metric-icon"><Icon icon={icon as 'time'} size={18} /></span>
}

function ActivityArtwork({ id }: { id: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (id === 'gentle-yoga') return <svg className="activity-art" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="8" r="3.2" {...common} /><path d="M24 12v12m0-8c-4-1-6-4-8-7m8 7c4-1 6-4 8-7M24 24c-1 5-6 7-11 8m11-8c1 5 6 7 11 8M13 32c4 5 18 5 22 0m-22 0-3 4c5 5 21 5 26 0l-3-4" {...common} /></svg>
  if (id === 'guided-meditation') return <svg className="activity-art" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 29c-8-8-7-15 0-20 7 5 8 12 0 20Zm0 0c-9-2-15-7-14-14 7 0 12 4 14 14Zm0 0c9-2 15-7 14-14-7 0-12 4-14 14ZM9 31c5-5 10-6 15-2 5-4 10-3 15 2-4 7-26 7-30 0Z" {...common} /></svg>
  if (id === 'pilates-stretch') return <svg className="activity-art" viewBox="0 0 48 48" aria-hidden="true"><circle cx="31" cy="8" r="3" {...common} /><path d="M29 12c-4 3-7 7-9 12l-8 8m18-20-8 7m1 3 10 6m-10-6-2 12m2-12-8-1m13-4 9-5M12 32l-4 7m4-7 8 7m2-15 11 6" {...common} /></svg>
  if (id === 'mindful-walk') return <svg className="activity-art" viewBox="0 0 48 48" aria-hidden="true"><circle cx="27" cy="7" r="3" {...common} /><path d="m25 11-5 9 7 4 5-8m-12 2-7 5m14-3 7 7m-12-5-5 10-6 7m6-7 8 6 2 7m-6-20 8 4 8 1" {...common} /></svg>
  return <svg className="activity-art" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 17c5-5 9-5 14 0s9 5 14 0 7-5 10-2M5 25c5-5 9-5 14 0s9 5 14 0 7-5 10-2M5 33c5-5 9-5 14 0s9 5 14 0 7-5 10-2" {...common} /></svg>
}

function MetricCard({
  type, expanded, onToggle, currentMood,
}: { type: 'mood' | 'sleep' | 'activity'; expanded: boolean; onToggle: () => void; currentMood: Mood | null }) {
  const titles = { mood: 'Mood', sleep: 'Sleep', activity: 'Activity' }
  const chartValues = type === 'sleep' ? sampleWeek.sleepHours : sampleWeek.steps
  const summary = type === 'mood' ? (currentMood ? currentMood : 'No check-in yet') : type === 'sleep' ? '6 hr 34 min average' : '6,240 steps average'
  const supporting = type === 'mood' ? 'Your check-in is only stored for this session.' : type === 'sleep' ? 'Shortest sleep in this example: 5 hr 55 min' : 'Lowest day in this example: 5,100 steps'
  return <Card className="metric-card">
    <div className="metric-heading"><MetricIcon type={type} /><div className="metric-copy"><span>{titles[type]}</span><strong>{summary}</strong><small>{supporting}</small></div></div>
    <TrendBars values={chartValues} labels={sampleWeek.days} mode={type} currentMood={currentMood} />
    <button type="button" className="insights-toggle" aria-expanded={expanded} onClick={onToggle}>
      <span>{expanded ? 'View fewer insights' : 'View more insights'}</span><Icon icon={expanded ? 'chevron-up' : 'chevron-down'} size={16} />
    </button>
    {expanded && <div className="expanded-insights">
      {type === 'mood' ? <>
        <h3>What this check-in shows</h3>
        {currentMood ? <><div className="stat-row"><div><strong>1</strong><span>check-in this session</span></div><div><strong>{currentMood}</strong><span>today's mood</span></div></div><p>Your mood is self-reported. There are no earlier entries in this browser session to compare.</p></> : <p>No mood has been recorded in this session yet. Your check-in will appear here after you select a mood.</p>}
      </> : type === 'sleep' ? <>
        <h3>What the sample sleep data shows</h3><div className="stat-row"><div><strong>6 hr 34 min</strong><span>7-day average</span></div><div><strong>2 nights</strong><span>under 6 hours</span></div><div><strong>42 min</strong><span>below example usual</span></div></div>
        <p>This is illustrative data only. It is not connected to a device and cannot explain changes in mood.</p>
      </> : <>
        <h3>What the sample activity data shows</h3><div className="stat-row"><div><strong>6,220</strong><span>daily average</span></div><div><strong>5,100</strong><span>lowest day</span></div><div><strong>−18%</strong><span>vs. example prior week</span></div></div>
        <p>This is illustrative step data only. It is not connected to a device or live service.</p>
      </>}
    </div>}
  </Card>
}

function Overview({ mood, onBack, onActions }: { mood: Mood | null; onBack: () => void; onActions: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggle = (id: string) => setExpanded(s => ({ ...s, [id]: !s[id] }))
  return <main className="page overview-page">
    <BackLink onClick={onBack} />
    <ScreenTitle title="Your wellbeing overview" />
    <Card className="score-card">
      <div className="score-ring" aria-label="Illustrative sample score, 62 out of 100"><div><strong>62</strong><span>out of 100</span></div></div>
      <div className="score-info"><div className="score-kicker"><span>Overall wellbeing</span></div><strong className="score-label">Illustrative overview</strong><button type="button" className="text-action" onClick={onActions}>View recommended actions <Icon icon="arrow-right" size={15} /></button></div>
    </Card>
    <Card className="insight-card">
      <strong>Sleep may be worth a closer look</strong>
      <p>These example sleep values vary across the week. They are shown for reflection only.</p>
      <span className="insight-caveat">Sample data · not a cause or assessment</span>
    </Card>
    <h2 className="section-heading overview-subheading">What is shaping your score</h2>
    <MetricCard type="mood" expanded={Boolean(expanded.mood)} onToggle={() => toggle('mood')} currentMood={mood} />
    <MetricCard type="sleep" expanded={Boolean(expanded.sleep)} onToggle={() => toggle('sleep')} currentMood={mood} />
    <MetricCard type="activity" expanded={Boolean(expanded.activity)} onToggle={() => toggle('activity')} currentMood={mood} />
  </main>
}

function ActivityList({ onBack, onSelect, mood }: { onBack: () => void; onSelect: (activity: Activity) => void; mood: Mood | null }) {
  return <main className="page activity-list-page">
    <BackLink onClick={onBack} /><ScreenTitle title="Recommended actions" subtitle="A small action may help you wind down tonight." />
    <Card className="activity-context"><div><strong>{mood ? `You checked in as ${mood}` : 'A small activity can be one option'}</strong><p>These are example activities. Choose one only if it feels right.</p></div></Card>
    <div className="recommendation-heading"><div><h2 className="section-heading">Suggestions for you</h2></div></div>
    <div className="activity-list">
      {activities.map(activity => <button type="button" className="activity-card" key={activity.id} onClick={() => onSelect(activity)}>
        <span className="activity-icon" aria-hidden="true"><ActivityArtwork id={activity.id} /></span><span className="activity-copy"><strong>{activity.title}</strong><small>{activity.minutes} minutes · {activity.effort}</small><span>{activity.summary}</span></span><Icon className="activity-arrow" icon="chevron-right" size={18} />
      </button>)}
    </div>
  </main>
}

function ActivityDetail({ activity, onBack }: { activity: Activity; onBack: () => void }) {
  const [started, setStarted] = useState(false)
  return <main className="page detail-page">
    <BackLink onClick={onBack} />
    <div className="detail-hero"><span className="activity-icon large" aria-hidden="true"><ActivityArtwork id={activity.id} /></span><h1>{activity.title}</h1><p className="detail-meta">{activity.minutes} minutes · {activity.effort}</p><p>{activity.summary}</p></div>
    <Card className="why-card"><Tag className="sample-tag">Why this activity</Tag><p>This is a gentle, optional example. Choose it only if it feels suitable for you.</p></Card>
    <section className="activity-steps"><h2 className="section-heading">A simple guide</h2>{activity.steps.map((step, i) => <Card className="activity-step" key={step.title}><span className="step-number">{i + 1}</span><div><strong>{step.title}</strong><small>{step.minutes} {step.minutes === 1 ? 'minute' : 'minutes'}</small><p>{step.detail}</p></div></Card>)}</section>
    <p className="safety-note"><Icon icon="info-sign" size={16} /> Move at your own pace. Skip any movement that does not feel right.</p>
    <Button className="primary-action start-action" intent="primary" onClick={() => setStarted(true)} disabled={started}>{started ? 'Session started' : `Start ${activity.minutes}-minute session`}</Button>
    {started && <p className="started-note" role="status">Your activity has started. You can return whenever you are ready.</p>}
  </main>
}

function Support({ onBack }: { onBack: () => void }) {
  return <main className="page support-page">
    <BackLink onClick={onBack} /><ScreenTitle title="Support" subtitle="You do not have to work things out alone." />
    <Card className="support-card urgent-card"><div className="support-card-head"><Icon icon="warning-sign" size={20} /><h2>If you need urgent help</h2></div><p>If you need urgent mental health help in England, call NHS 111 and select the mental health option.</p><a className="support-action" href="tel:111">Call 111 <Icon icon="phone" size={15} /></a><a className="support-secondary" href={supportLinks.nhsUrgent} target="_blank" rel="noreferrer">Read NHS urgent help guidance <Icon icon="share" size={12} /></a></Card>
    <Card className="support-card emergency-card"><h2>If you or someone else is in immediate danger</h2><p>Call 999 or go to A&amp;E.</p><a className="support-action" href="tel:999">Call 999 <Icon icon="phone" size={15} /></a></Card>
    <h2 className="section-heading support-subheading">Talk to someone</h2>
    <Card className="support-card"><h3>Samaritans</h3><p>Call free, any time, day or night.</p><a className="support-action secondary-action" href={supportLinks.samaritans}>Call 116 123 <Icon icon="phone" size={15} /></a></Card>
    <Card className="support-card"><h3>Shout</h3><p>Text for support by text message.</p><a className="support-action secondary-action" href={supportLinks.shout}>Text SHOUT to 85258 <Icon icon="chat" size={15} /></a></Card>
    <Card className="support-card"><h3>NHS Talking Therapies</h3><p>Find local NHS support for anxiety and depression in England.</p><a className="support-action secondary-action" href={supportLinks.nhsTherapies} target="_blank" rel="noreferrer">Find a service <Icon icon="share" size={12} /></a></Card>
    <p className="support-footnote">If you are outside England, contact your local health service or emergency number.</p>
  </main>
}

export default function App() {
  const [page, setPage] = useState<Page>('checkin')
  const [history, setHistory] = useState<Page[]>([])
  const [mood, setMood] = useState<Mood | null>(null)
  const [activity, setActivity] = useState<Activity>(activities[0])

  const navigate = (next: Page) => {
    setHistory(prev => [...prev, page])
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const goBack = () => {
    const prior = history.at(-1)
    setHistory(items => items.slice(0, -1))
    setPage(prior ?? 'checkin')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  let content: React.ReactNode
  switch (page) {
    case 'checkin': content = <Checkin mood={mood} setMood={setMood} onOverview={() => navigate('overview')} onActivities={() => navigate('activities')} />; break
    case 'overview': content = <Overview mood={mood} onBack={goBack} onActions={() => navigate('activities')} />; break
    case 'activities': content = <ActivityList mood={mood} onBack={goBack} onSelect={selected => { setActivity(selected); navigate('activity') }} />; break
    case 'activity': content = <ActivityDetail key={activity.id} activity={activity} onBack={goBack} />; break
    case 'support': content = <Support onBack={goBack} />; break
  }

  return <div className="app-shell"><Header onSupport={() => { if (page !== 'support') navigate('support') }} />{content}<footer className="page-footer">Steady is a prototype. Sample health information is illustrative and is not connected to a device or live service.</footer></div>
}

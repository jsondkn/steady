export type Mood = 'Very good' | 'Good' | 'Okay' | 'Low' | 'Very low'

export type Activity = {
  id: string
  title: string
  minutes: number
  effort: 'Low effort' | 'Moderate effort'
  summary: string
  steps: { title: string; minutes: number; detail: string }[]
}

export const moods: { label: Mood; face: string }[] = [
  { label: 'Very good', face: '☺' },
  { label: 'Good', face: '☻' },
  { label: 'Okay', face: '😐' },
  { label: 'Low', face: '☹' },
  { label: 'Very low', face: '☹' },
]

// All sleep and step values are static illustrative examples, not connected data.
export const sampleWeek = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sleepHours: [7.17, 6.6, 5.92, 6.57, 7.17, 6.6, 5.97],
  steps: [7200, 5900, 6400, 5100, 7200, 5640, 6240],
}

export const activities: Activity[] = [
  {
    id: 'gentle-yoga', title: 'Gentle yoga', minutes: 10, effort: 'Low effort',
    summary: 'A few simple poses can help you relax and ease into the evening.',
    steps: [
      { title: 'Settle', minutes: 1, detail: 'Find a comfortable position and let your breathing settle.' },
      { title: 'Move gently', minutes: 6, detail: 'Try a few easy stretches. Move at your own pace.' },
      { title: 'Pause', minutes: 3, detail: 'Rest for a moment and notice how you feel.' },
    ],
  },
  {
    id: 'guided-meditation', title: 'Guided meditation', minutes: 5, effort: 'Low effort',
    summary: 'A short, calming meditation can help you pause and quiet your mind.',
    steps: [{ title: 'Pause and breathe', minutes: 5, detail: 'Settle in and follow a gentle breathing rhythm.' }],
  },
  {
    id: 'pilates-stretch', title: 'Pilates stretch', minutes: 12, effort: 'Moderate effort',
    summary: 'A gentle Pilates routine can help you release tension and feel more at ease.',
    steps: [{ title: 'Stretch gently', minutes: 12, detail: 'Choose a comfortable range of movement and take breaks when needed.' }],
  },
  {
    id: 'mindful-walk', title: 'Mindful walk', minutes: 15, effort: 'Low effort',
    summary: 'Take a short walk and notice what you can see and hear.',
    steps: [{ title: 'Take a short walk', minutes: 15, detail: 'Walk at a pace that feels comfortable and notice your surroundings.' }],
  },
  {
    id: 'breathing-pause', title: 'Breathing pause', minutes: 5, effort: 'Low effort',
    summary: 'Follow a simple breathing rhythm for a quiet pause.',
    steps: [{ title: 'Breathe at your pace', minutes: 5, detail: 'Let your breathing stay natural. Stop if this does not feel comfortable.' }],
  },
]

export const supportLinks = {
  nhsUrgent: 'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/',
  nhsTherapies: 'https://www.nhs.uk/nhs-services/mental-health-services/find-nhs-talking-therapies-for-anxiety-and-depression/',
  samaritans: 'tel:116123',
  shout: 'sms:85258?body=SHOUT',
}

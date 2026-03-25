export function nameToPhotoSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Extract all unique speakers from schedule who have a company field
export function extractSpeakers(schedule: ScheduleEvent[]): SpeakerWithEvent[] {
  const seen = new Set<string>()
  const speakers: SpeakerWithEvent[] = []
  for (const event of schedule) {
    for (const speaker of event.speakers || []) {
      if (speaker.company && !seen.has(speaker.name)) {
        seen.add(speaker.name)
        speakers.push({ ...speaker, eventId: event.id, eventTitle: event.title, eventType: event.type })
      }
    }
  }
  return speakers
}

export interface Speaker {
  name: string
  title?: string
  company?: string
  companyUrl?: string
  companyDesc?: string
  bio?: string | null
  industry?: string
  linkedin?: string | null
  photo?: string | null
}

export interface Moderator {
  name: string
  title?: string
}

export interface ScheduleEvent {
  id: string
  time: string
  title: string
  location: string
  type: 'keynote' | 'panel' | 'session' | 'logistics' | 'break'
  speakers: Speaker[]
  moderator: Moderator | null
}

export interface SpeakerWithEvent extends Speaker {
  eventId: string
  eventTitle: string
  eventType: string
}

export function getBuildingFromLocation(location: string): string | null {
  const loc = location.toLowerCase()
  if (loc.includes('klarman')) return 'Klarman'
  if (loc.includes('aldrich')) return 'Aldrich'
  if (loc.includes('batten')) return 'Batten'
  if (loc.includes('spangler')) return 'Spangler'
  return null
}

export function getBuildingMapQuery(building: string): string {
  const queries: Record<string, string> = {
    Klarman: 'Klarman+Hall+Harvard+Business+School',
    Aldrich: 'Aldrich+Hall+Harvard+Business+School',
    Batten: 'Batten+Hall+Harvard+Business+School',
    Spangler: 'Spangler+Center+Harvard+Business+School',
  }
  return queries[building] || `${building}+Harvard+Business+School`
}

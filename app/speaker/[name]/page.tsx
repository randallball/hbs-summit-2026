import { notFound } from 'next/navigation'
import SpeakerDetailClient from './SpeakerDetailClient'
import schedule from '@/data/schedule.json'
import type { ScheduleEvent, Speaker } from '@/lib/utils'

const typedSchedule = schedule as ScheduleEvent[]

function findSpeakerAndEvent(name: string): { speaker: Speaker; event: ScheduleEvent } | null {
  for (const event of typedSchedule) {
    for (const speaker of event.speakers) {
      if (speaker.name === name) {
        return { speaker, event }
      }
    }
  }
  return null
}

export async function generateStaticParams() {
  const params: { name: string }[] = []
  for (const event of typedSchedule) {
    for (const speaker of event.speakers) {
      params.push({ name: encodeURIComponent(speaker.name) })
    }
  }
  return params
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const result = findSpeakerAndEvent(decodedName)

  if (!result) notFound()

  return <SpeakerDetailClient speaker={result.speaker} event={result.event} />
}

import { notFound } from 'next/navigation'
import EventDetailClient from './EventDetailClient'
import schedule from '@/data/schedule.json'
import type { ScheduleEvent } from '@/lib/utils'

const typedSchedule = schedule as ScheduleEvent[]

export async function generateStaticParams() {
  return typedSchedule.map((event) => ({ id: event.id }))
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = typedSchedule.find((e) => e.id === id)

  if (!event) notFound()

  return <EventDetailClient event={event} />
}

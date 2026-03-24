'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import TabBar, { Tab } from '@/components/TabBar'
import ScheduleTab from '@/components/ScheduleTab'
import SpeakersTab from '@/components/SpeakersTab'
import SavedTab from '@/components/SavedTab'
import MapTab from '@/components/MapTab'
import { useSavedEvents } from '@/lib/useSavedEvents'
import schedule from '@/data/schedule.json'
import type { ScheduleEvent } from '@/lib/utils'

const typedSchedule = schedule as ScheduleEvent[]

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule')
  const [savedIds, toggleSave] = useSavedEvents()

  return (
    <div className="app-shell">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} savedCount={savedIds.length} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'schedule' && (
          <ScheduleTab schedule={typedSchedule} savedIds={savedIds} onToggleSave={toggleSave} />
        )}
        {activeTab === 'speakers' && (
          <SpeakersTab schedule={typedSchedule} />
        )}
        {activeTab === 'saved' && (
          <SavedTab schedule={typedSchedule} savedIds={savedIds} onToggleSave={toggleSave} />
        )}
        {activeTab === 'map' && (
          <MapTab schedule={typedSchedule} />
        )}
      </main>
    </div>
  )
}

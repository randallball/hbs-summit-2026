'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

const VALID_TABS: Tab[] = ['schedule', 'speakers', 'saved', 'map']

function HomeInner() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'schedule'
  )
  const [savedIds, toggleSave] = useSavedEvents()

  return (
    <div className="app-shell">
      <div className="app-sidebar">
        <Header />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} savedCount={savedIds.length} />
      </div>
      <main className="app-main" style={{ flex: 1, overflowY: 'auto' }}>
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

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  )
}

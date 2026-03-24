'use client'

export type Tab = 'schedule' | 'speakers' | 'saved' | 'map'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  savedCount: number
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'schedule', label: 'Schedule', icon: '📋' },
  { id: 'speakers', label: 'Speakers', icon: '🎤' },
  { id: 'saved', label: 'Saved', icon: '★' },
  { id: 'map', label: 'Map', icon: '📍' },
]

export default function TabBar({ activeTab, onTabChange, savedCount }: TabBarProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'white',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '12px 4px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              borderBottom: isActive ? '2px solid var(--crimson)' : '2px solid transparent',
              color: isActive ? 'var(--crimson)' : 'var(--text-secondary)',
              position: 'relative',
              minHeight: 44,
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>
              {tab.label}
            </span>
            {tab.id === 'saved' && savedCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: '50%',
                  marginRight: -18,
                  background: 'var(--crimson)',
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 5px',
                  minWidth: 16,
                  textAlign: 'center',
                  lineHeight: '14px',
                }}
              >
                {savedCount}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

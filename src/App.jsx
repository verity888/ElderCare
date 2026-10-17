import { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard.jsx'
import VideoCall from './components/VideoCall.jsx'
import FallAlert from './components/FallAlert.jsx'
import { contacts } from './data/contacts.js'

// Screens
// 'dashboard'  → main home screen
// 'alert'      → fall detection alert + countdown
// 'call'       → active video call

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [activeContact, setActiveContact] = useState(null)
  const [isEmergencyCall, setIsEmergencyCall] = useState(false)

  // ── Handlers ───────────────────────────────────────────────

  const handleCallContact = useCallback((contact) => {
    setActiveContact(contact)
    setIsEmergencyCall(false)
    setScreen('call')
  }, [])

  const handleSOS = useCallback(() => {
    // SOS goes straight to alert state (same flow as fall detection)
    setIsEmergencyCall(true)
    setScreen('alert')
  }, [])

  const handleSimulateFall = useCallback(() => {
    setIsEmergencyCall(true)
    setScreen('alert')
  }, [])

  const handleAlertCancel = useCallback(() => {
    setIsEmergencyCall(false)
    setScreen('dashboard')
  }, [])

  const handleAlertCallNow = useCallback(() => {
    // Auto-call the first contact (daughter/primary caretaker)
    setActiveContact(contacts[0])
    setIsEmergencyCall(true)
    setScreen('call')
  }, [])

  const handleEndCall = useCallback(() => {
    setActiveContact(null)
    setIsEmergencyCall(false)
    setScreen('dashboard')
  }, [])

  // ── Render ─────────────────────────────────────────────────

  return (
    // Force 16:9 landscape viewport; fills the whole window
    <div className="w-screen h-screen overflow-hidden bg-black">
      {screen === 'dashboard' && (
        <Dashboard
          onCallContact={handleCallContact}
          onSOS={handleSOS}
          onSimulateFall={handleSimulateFall}
        />
      )}

      {screen === 'alert' && (
        <FallAlert
          onCancel={handleAlertCancel}
          onCallNow={handleAlertCallNow}
        />
      )}

      {screen === 'call' && activeContact && (
        <VideoCall
          contact={activeContact}
          onEndCall={handleEndCall}
          isEmergency={isEmergencyCall}
        />
      )}
    </div>
  )
}

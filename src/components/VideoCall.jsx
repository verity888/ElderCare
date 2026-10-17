import { PhoneOff, Wifi, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function VideoCall({ contact, onEndCall, isEmergency = false }) {
  const [elapsed, setElapsed] = useState(0)
  const [connected, setConnected] = useState(false)

  // Simulate connect after 2s
  useEffect(() => {
    const connectTimer = setTimeout(() => setConnected(true), 2000)
    return () => clearTimeout(connectTimer)
  }, [])

  // Call timer
  useEffect(() => {
    if (!connected) return
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [connected])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <div className="relative h-full w-full bg-slate-900 flex flex-col overflow-hidden">

      {/* ── EMERGENCY BANNER ─────────────────────────────────── */}
      {isEmergency && (
        <div
          className="flex-shrink-0 bg-red-600 flex items-center justify-center gap-4 px-8 py-4"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="text-white w-8 h-8 flex-shrink-0 animate-bounce" strokeWidth={2.5} />
          <span className="text-white font-black text-2xl tracking-wide">🚨 EMERGENCY ALERT SENT — Help is on the way</span>
          <AlertTriangle className="text-white w-8 h-8 flex-shrink-0 animate-bounce" strokeWidth={2.5} />
        </div>
      )}

      {/* ── STATUS BAR ───────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-slate-800 flex items-center justify-between px-8 py-3 border-b-2 border-slate-700">
        <div className="flex items-center gap-3">
          {isEmergency
            ? null
            : <Wifi className="text-white w-6 h-6" strokeWidth={2} />
          }
          <span className="text-white font-bold text-xl">
            {isEmergency ? '🚨 Emergency Call' : 'Video Call'}
          </span>
        </div>
        <span className={`font-bold text-xl ${connected ? 'text-emerald-400' : 'text-amber-400'}`}>
          {connected ? `● Connected · ${formatTime(elapsed)}` : '◌ Connecting…'}
        </span>
      </div>

      {/* ── REMOTE VIDEO (simulated full-screen feed) ─────────── */}
      <div className="flex-1 flex items-center justify-center bg-slate-900 relative">
        {/* Simulated blurry video background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-60" />

        {/* Large avatar overlay */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-full bg-white/10 border-8 border-white/40 flex items-center justify-center shadow-2xl"
            style={{ fontSize: '7rem' }}>
            {contact.emoji}
          </div>

          {!connected ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
              <p className="text-white font-bold text-3xl text-center">
                Calling {contact.name}…
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-white font-black" style={{ fontSize: '2.5rem' }}>{contact.name}</p>
              <p className="text-slate-300 font-bold text-xl">{contact.relation}</p>
              <p className="text-emerald-400 font-black text-2xl mt-1">{formatTime(elapsed)}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── PIP: local camera ─────────────────────────────────── */}
      <div className="absolute bottom-28 right-8 w-44 h-28 rounded-2xl overflow-hidden border-4 border-white/50 shadow-2xl z-20 bg-slate-700"
        aria-label="Your camera (local view)" role="img">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
          <span style={{ fontSize: '3rem' }}>🧓</span>
        </div>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-white text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full">You</span>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ──────────────────────────────────── */}
      <div className="flex-shrink-0 bg-slate-800 border-t-2 border-slate-700 px-8 py-5 flex items-center justify-center gap-6">
        <button
          onClick={onEndCall}
          aria-label="End call and return to home"
          className="
            flex items-center gap-4
            bg-red-600 hover:bg-red-700 active:bg-red-800
            text-white font-black
            rounded-2xl border-4 border-red-900
            px-10
            shadow-lg
            focus:outline-none focus:ring-4 focus:ring-red-300
            transition-colors duration-100
          "
          style={{ minHeight: '72px', fontSize: '1.4rem' }}
        >
          <PhoneOff className="w-9 h-9 flex-shrink-0" strokeWidth={2.5} />
          End Call
        </button>
      </div>
    </div>
  )
}

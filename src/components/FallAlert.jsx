import { useEffect, useState, useRef } from 'react'
import { AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react'

const COUNTDOWN_START = 10

export default function FallAlert({ onCancel, onCallNow }) {
  const [count, setCount] = useState(COUNTDOWN_START)
  const [cancelled, setCancelled] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current)
          setTimeout(() => onCallNow(), 300)
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [onCallNow])

  function handleCancel() {
    clearInterval(intervalRef.current)
    setCancelled(true)
    setTimeout(() => onCancel(), 1200)
  }

  // ── "I AM OK" confirmation state ──────────────────────────
  if (cancelled) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-emerald-600 gap-8"
        role="status" aria-live="assertive">
        <CheckCircle2 className="text-white w-36 h-36" strokeWidth={1.5} />
        <p className="text-white font-black text-center px-12 leading-tight" style={{ fontSize: '3rem' }}>
          OK! Returning to Home…
        </p>
      </div>
    )
  }

  // ── Fall detected – countdown ──────────────────────────────
  return (
    <div
      className="relative h-full w-full flex flex-col items-center justify-center gap-8 overflow-hidden animate-flash-bg"
      role="alertdialog"
      aria-live="assertive"
      aria-label="Fall detected emergency alert"
    >
      {/* Icon + headline */}
      <AlertTriangle
        className="text-yellow-300 drop-shadow-2xl animate-bounce"
        style={{ width: '9rem', height: '9rem' }}
        strokeWidth={2}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-3 px-10 text-center">
        <h1 className="text-white font-black leading-tight" style={{ fontSize: '4rem' }}>
          Fall Detected!
        </h1>
        <p className="text-yellow-200 font-bold" style={{ fontSize: '2rem' }}>
          Calling family in…
        </p>
      </div>

      {/* Big countdown circle */}
      <div
        className="relative flex items-center justify-center w-52 h-52"
        role="timer"
        aria-label={`${count} seconds until emergency call`}
        aria-live="off"
      >
        <span className="absolute inset-0 rounded-full border-8 border-yellow-300 animate-ping opacity-60" aria-hidden="true" />
        <div className="w-52 h-52 rounded-full bg-white/10 border-8 border-yellow-300 flex items-center justify-center shadow-2xl">
          <span className="text-white font-black tabular-nums leading-none" style={{ fontSize: '6rem' }}>
            {count}
          </span>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex gap-6 mt-2">
        {/* I AM OK – Cancel */}
        <button
          onClick={handleCancel}
          aria-label="I am OK — Cancel emergency alert"
          className="
            flex flex-col items-center justify-center gap-2
            rounded-2xl border-4 border-emerald-900
            bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
            px-10 shadow-2xl
            focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2
            transition-colors duration-100
          "
          style={{ minHeight: '96px', minWidth: '220px' }}
        >
          <CheckCircle2 className="text-white w-12 h-12" strokeWidth={2.5} />
          <span className="text-white font-black leading-tight text-center" style={{ fontSize: '1.8rem' }}>
            I AM OK
          </span>
          <span className="text-emerald-100 font-bold uppercase tracking-widest" style={{ fontSize: '1rem' }}>
            Cancel Alert
          </span>
        </button>

        {/* Call Now */}
        <button
          onClick={onCallNow}
          aria-label="Call caregiver now immediately"
          className="
            flex flex-col items-center justify-center gap-2
            rounded-2xl border-4 border-white
            bg-white hover:bg-slate-100 active:bg-slate-200
            px-10 shadow-2xl
            focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-700
            transition-colors duration-100
          "
          style={{ minHeight: '96px', minWidth: '220px' }}
        >
          <PhoneCall className="text-red-700 w-12 h-12" strokeWidth={2.5} />
          <span className="text-red-700 font-black leading-tight text-center" style={{ fontSize: '1.8rem' }}>
            Call Now
          </span>
          <span className="text-red-600 font-bold uppercase tracking-widest" style={{ fontSize: '1rem' }}>
            Don't Wait
          </span>
        </button>
      </div>
    </div>
  )
}

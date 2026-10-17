import { useState, useEffect } from 'react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHour = String(hours % 12 || 12).padStart(2, '0')

  const dayName = DAYS[now.getDay()]
  const month   = MONTHS[now.getMonth()]
  const date    = now.getDate()
  const year    = now.getFullYear()

  return (
    <div className="flex items-center gap-3 leading-none">
      {/* Time */}
      <span className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">
        {displayHour}:{minutes}
      </span>
      <span className="text-xl font-bold text-slate-600">{ampm}</span>
      <span className="text-lg font-semibold text-slate-500 hidden sm:inline">
        · {dayName}, {month} {date}, {year}
      </span>
    </div>
  )
}

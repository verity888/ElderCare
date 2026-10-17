import { useState } from 'react'
import { X, Heart, Wind, Activity, CheckCircle2 } from 'lucide-react'

// ── Stepper row ──────────────────────────────────────────────────
function Stepper({ label, value, unit, min, max, step, onChange, Icon, color }) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border-4 ${color.border} ${color.bg} p-5`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 flex-shrink-0 ${color.icon}`} strokeWidth={2.5} />
        <span className={`text-xl font-black ${color.text}`}>{label}</span>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
          aria-label={`Decrease ${label}`}
          className={`
            font-black text-4xl rounded-2xl shadow-md
            focus:outline-none focus:ring-4 focus:ring-offset-2
            transition-colors duration-100
            ${color.btn}
          `}
          style={{ minWidth: '64px', minHeight: '64px' }}
        >
          −
        </button>
        <div className="flex flex-col items-center min-w-[110px]">
          <span className={`font-black leading-none ${color.value}`} style={{ fontSize: '2.8rem' }}>
            {value}
          </span>
          <span className={`text-lg font-bold ${color.unit}`}>{unit}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
          aria-label={`Increase ${label}`}
          className={`
            font-black text-4xl rounded-2xl shadow-md
            focus:outline-none focus:ring-4 focus:ring-offset-2
            transition-colors duration-100
            ${color.btn}
          `}
          style={{ minWidth: '64px', minHeight: '64px' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

// ── BP two-value stepper ─────────────────────────────────────────
function BPStepper({ systolic, diastolic, onSystolicChange, onDiastolicChange }) {
  const color = {
    border: 'border-violet-500', bg: 'bg-violet-50',
    icon: 'text-violet-700', text: 'text-slate-900',
    btn: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-400',
    value: 'text-slate-900', unit: 'text-slate-600',
  }
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border-4 ${color.border} ${color.bg} p-5`}>
      <div className="flex items-center gap-3">
        <Activity className={`w-8 h-8 flex-shrink-0 ${color.icon}`} strokeWidth={2.5} />
        <span className="text-xl font-black text-slate-900">Blood Pressure</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Systolic */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold text-slate-600 text-center">Systolic (top)</span>
          <div className="flex items-center gap-2 justify-center">
            <button type="button" onClick={() => onSystolicChange(Math.max(60, systolic - 1))}
              aria-label="Decrease systolic"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '52px', minHeight: '52px' }}>−</button>
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="font-black text-slate-900 leading-none" style={{ fontSize: '2.2rem' }}>{systolic}</span>
            </div>
            <button type="button" onClick={() => onSystolicChange(Math.min(250, systolic + 1))}
              aria-label="Increase systolic"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '52px', minHeight: '52px' }}>+</button>
          </div>
        </div>
        {/* Diastolic */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold text-slate-600 text-center">Diastolic (bottom)</span>
          <div className="flex items-center gap-2 justify-center">
            <button type="button" onClick={() => onDiastolicChange(Math.max(40, diastolic - 1))}
              aria-label="Decrease diastolic"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '52px', minHeight: '52px' }}>−</button>
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="font-black text-slate-900 leading-none" style={{ fontSize: '2.2rem' }}>{diastolic}</span>
            </div>
            <button type="button" onClick={() => onDiastolicChange(Math.min(150, diastolic + 1))}
              aria-label="Increase diastolic"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '52px', minHeight: '52px' }}>+</button>
          </div>
        </div>
      </div>
      <p className="text-center font-black text-slate-900 text-2xl">{systolic}/{diastolic} <span className="text-lg font-bold text-slate-600">mmHg</span></p>
    </div>
  )
}

// ── Main modal ───────────────────────────────────────────────────
export default function VitalsInput({ currentVitals, onSave, onClose }) {
  const [hr,  setHr]  = useState(parseInt(currentVitals.hr)  || 72)
  const [spo2, setSpo2] = useState(parseInt(currentVitals.spo2) || 98)
  const [systolic,  setSystolic]  = useState(parseInt(currentVitals.bp?.split('/')[0]) || 120)
  const [diastolic, setDiastolic] = useState(parseInt(currentVitals.bp?.split('/')[1]) || 80)

  function handleSave() {
    onSave({
      hr:   String(hr),
      spo2: String(spo2),
      bp:   `${systolic}/${diastolic}`,
    })
    onClose()
  }

  // Status helpers
  function hrStatus()   { return hr < 60 || hr > 100 ? (hr < 50 || hr > 120 ? 'critical' : 'warning') : 'normal' }
  function spo2Status() { return spo2 < 95 ? (spo2 < 90 ? 'critical' : 'warning') : 'normal' }
  function bpStatus()   { return systolic > 140 || diastolic > 90 ? (systolic > 180 ? 'critical' : 'warning') : 'normal' }

  const theme = {
    normal:   { border: 'border-emerald-500', bg: 'bg-emerald-50', icon: 'text-emerald-700', text: 'text-slate-900', btn: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-400', value: 'text-slate-900', unit: 'text-slate-600' },
    warning:  { border: 'border-amber-500',   bg: 'bg-amber-50',   icon: 'text-amber-700',   text: 'text-slate-900', btn: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-400', value: 'text-slate-900', unit: 'text-slate-600' },
    critical: { border: 'border-red-600',     bg: 'bg-red-50',     icon: 'text-red-700',     text: 'text-slate-900', btn: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-400', value: 'text-red-700',   unit: 'text-slate-600' },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Enter Vitals"
    >
      <div className="bg-white rounded-3xl border-4 border-slate-300 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b-4 border-slate-200">
          <h2 className="text-3xl font-black text-slate-900">Enter Vitals</h2>
          <button
            onClick={onClose}
            aria-label="Close vitals input"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-2xl flex items-center gap-2 px-5 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
            style={{ minHeight: '56px' }}
          >
            <X className="w-6 h-6" strokeWidth={2.5} /> Close
          </button>
        </div>

        {/* Steppers */}
        <div className="flex flex-col gap-4 px-8 py-6">
          <Stepper
            label="Heart Rate"
            value={hr} unit="BPM" min={30} max={220} step={1}
            onChange={setHr} Icon={Heart}
            color={theme[hrStatus()]}
          />
          <Stepper
            label="Blood Oxygen"
            value={spo2} unit="% SpO₂" min={70} max={100} step={1}
            onChange={setSpo2} Icon={Wind}
            color={theme[spo2Status()]}
          />
          <BPStepper
            systolic={systolic} diastolic={diastolic}
            onSystolicChange={setSystolic} onDiastolicChange={setDiastolic}
          />
        </div>

        {/* Save */}
        <div className="px-8 pb-6">
          <button
            onClick={handleSave}
            aria-label="Save vitals"
            className="
              w-full flex items-center justify-center gap-4
              bg-blue-700 hover:bg-blue-800 active:bg-blue-900
              text-white font-black rounded-2xl border-4 border-blue-900
              shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400
              transition-colors duration-100
            "
            style={{ minHeight: '72px', fontSize: '1.4rem' }}
          >
            <CheckCircle2 className="w-9 h-9 flex-shrink-0" strokeWidth={2.5} />
            Save Vitals
          </button>
        </div>
      </div>
    </div>
  )
}

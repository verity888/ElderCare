import { useState } from 'react'
import {
  PhoneCall, Heart, Wind, Activity, Pill, Droplets,
  Scale, AlertCircle, CheckCircle2, Bell, Video, Pencil,
} from 'lucide-react'
import Clock from './Clock.jsx'
import VitalsInput from './VitalsInput.jsx'
import MedicationInput from './MedicationInput.jsx'
import { contacts } from '../data/contacts.js'

// ── Defaults ─────────────────────────────────────────────────────
const DEFAULT_VITALS = { hr: '72', spo2: '98', bp: '120/80' }
const DEFAULT_MEDS = [
  { id: 1, name: 'Lisinopril',   dose: 10,  unit: 'mg', time: '8:00 AM',  taken: true  },
  { id: 2, name: 'Metformin',    dose: 500, unit: 'mg', time: '2:00 PM',  taken: false },
  { id: 3, name: 'Atorvastatin', dose: 20,  unit: 'mg', time: '9:00 PM',  taken: false },
]
const ALERTS_INITIAL = [
  { id: 1, text: 'Take morning medication at 8:00 AM',    done: true,  critical: false },
  { id: 2, text: 'Take afternoon medication at 2:00 PM',  done: false, critical: false },
  { id: 3, text: 'Doctor appointment at 4:30 PM today',   done: false, critical: true  },
]
const SYMPTOMS = ['Headache', 'Dizziness', 'Chest Pain', 'Nausea', 'Fatigue', 'Shortness of Breath']

// ── Status helpers ────────────────────────────────────────────────
function vitalColors(status) {
  if (status === 'critical') return { card: 'bg-red-600',     text: 'text-white',     badge: 'bg-red-900 text-white',     icon: 'text-white' }
  if (status === 'warning')  return { card: 'bg-amber-400',   text: 'text-slate-900', badge: 'bg-amber-700 text-white',   icon: 'text-slate-900' }
  return                            { card: 'bg-emerald-600', text: 'text-white',     badge: 'bg-emerald-900 text-white', icon: 'text-white' }
}
function hrStatus(v)   { const n = parseInt(v); return n < 60 || n > 100 ? (n < 50 || n > 120 ? 'critical' : 'warning') : 'normal' }
function spo2Status(v) { const n = parseInt(v); return n < 95 ? (n < 90 ? 'critical' : 'warning') : 'normal' }
function bpStatus(v)   { const [s, d] = v.split('/').map(Number); return s > 140 || d > 90 ? (s > 180 ? 'critical' : 'warning') : 'normal' }

export default function Dashboard({ onCallContact, onSOS, onSimulateFall }) {
  const [vitals, setVitals]                 = useState(DEFAULT_VITALS)
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [meds, setMeds]                     = useState(DEFAULT_MEDS)
  const [showMedModal, setShowMedModal]     = useState(false)
  const [alerts, setAlerts]                 = useState(ALERTS_INITIAL)
  const [weight, setWeight]                 = useState(68)
  const [weightLogged, setWeightLogged]     = useState(false)
  const [loggedSymptoms, setLoggedSymptoms] = useState([])
  const [symptomSaved, setSymptomSaved]     = useState(false)

  function toggleAlert(id) { setAlerts(p => p.map(a => a.id === id ? { ...a, done: !a.done } : a)) }
  function adjustWeight(d) { setWeight(w => Math.max(30, Math.min(200, +(w + d).toFixed(1)))); setWeightLogged(false) }
  function toggleSymptom(s) { setLoggedSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); setSymptomSaved(false) }
  function toggleMedTaken(id) { setMeds(p => p.map(m => m.id === id ? { ...m, taken: !m.taken } : m)) }

  const activeAlerts = alerts.filter(a => !a.done)
  const VITALS_DISPLAY = [
    { id: 'hr',   label: 'Heart Rate',     value: vitals.hr,   unit: 'BPM',    status: hrStatus(vitals.hr),     Icon: Heart    },
    { id: 'spo2', label: 'Blood Oxygen',   value: vitals.spo2, unit: '% SpO₂', status: spo2Status(vitals.spo2), Icon: Wind     },
    { id: 'bp',   label: 'Blood Pressure', value: vitals.bp,   unit: 'mmHg',   status: bpStatus(vitals.bp),     Icon: Activity },
  ]

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col" style={{ overflow: 'hidden' }}>

      {/* ══ MODALS ══════════════════════════════════════════════ */}
      {showVitalsModal && (
        <VitalsInput currentVitals={vitals} onSave={setVitals} onClose={() => setShowVitalsModal(false)} />
      )}
      {showMedModal && (
        <MedicationInput currentMeds={meds} onSave={setMeds} onClose={() => setShowMedModal(false)} />
      )}

      {/* ══ HEADER — fixed height ════════════════════════════════ */}
      <header className="flex-shrink-0 bg-white border-b-4 border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-slate-900 tracking-tight leading-none whitespace-nowrap">🏥 ElderCare</span>
          <Clock />
        </div>
        <button
          onClick={onSOS}
          aria-label="Call Caregiver — Emergency SOS"
          className="
            relative sos-ripple overflow-hidden flex items-center gap-3
            bg-red-600 hover:bg-red-700 active:bg-red-800
            text-white font-black rounded-2xl border-4 border-red-800
            px-6 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors
          "
          style={{ minHeight: '60px', fontSize: '1.15rem' }}
        >
          <PhoneCall className="w-8 h-8 flex-shrink-0" strokeWidth={2.5} />
          <span className="leading-tight text-left">
            Call Caregiver
            <span className="block text-red-200 text-sm font-bold tracking-widest uppercase">Emergency SOS</span>
          </span>
        </button>
      </header>

      {/* ══ SCROLLABLE BODY ════════════════════════════════════ */}
      <main
        className="flex-1 px-6 py-4 space-y-5"
        style={{ overflowY: 'auto', overflowX: 'hidden' }}
      >

        {/* ── ALERTS ──────────────────────────────────────────── */}
        <section aria-label="Active Alerts">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-slate-900 flex-shrink-0" strokeWidth={2.5} />
            <h2 className="text-xl font-black text-slate-900">Today's Reminders</h2>
            {activeAlerts.length > 0 && (
              <span className="bg-red-600 text-white text-sm font-bold rounded-full px-2.5 py-0.5">
                {activeAlerts.length} pending
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map(alert => (
              <div key={alert.id} className={`
                flex items-center gap-3 rounded-2xl border-4 px-4 py-3
                ${alert.done ? 'bg-slate-100 border-slate-300' : alert.critical ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}
              `}>
                {alert.critical && !alert.done
                  ? <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" strokeWidth={2.5} />
                  : <Bell className={`w-6 h-6 flex-shrink-0 ${alert.done ? 'text-slate-400' : 'text-amber-600'}`} strokeWidth={2.5} />
                }
                <span className={`flex-1 text-lg font-bold leading-snug ${alert.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {alert.text}
                </span>
                <button
                  onClick={() => toggleAlert(alert.id)}
                  aria-label={alert.done ? `Undo: ${alert.text}` : `Mark done: ${alert.text}`}
                  className={`
                    flex items-center gap-2 rounded-xl border-4 px-4 font-bold text-base
                    focus:outline-none focus:ring-4 transition-colors
                    ${alert.done
                      ? 'bg-slate-200 border-slate-400 text-slate-700 hover:bg-slate-300 focus:ring-slate-400'
                      : 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-700 focus:ring-emerald-400'}
                  `}
                  style={{ minHeight: '48px', minWidth: '100px' }}
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  {alert.done ? 'Undo' : 'Done'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── VITALS ──────────────────────────────────────────── */}
        <section aria-label="Current Vitals">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-slate-900 flex-shrink-0" strokeWidth={2.5} />
              <h2 className="text-xl font-black text-slate-900">Current Vitals</h2>
            </div>
            <button
              onClick={() => setShowVitalsModal(true)}
              aria-label="Enter new vitals readings"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl border-4 border-blue-900 px-5 shadow focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors text-base"
              style={{ minHeight: '48px' }}
            >
              <Pencil className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} /> Enter Vitals
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {VITALS_DISPLAY.map(vital => {
              const c = vitalColors(vital.status)
              return (
                <div key={vital.id} className={`${c.card} rounded-2xl p-4 flex flex-col gap-1.5 shadow`}
                  role="status" aria-label={`${vital.label}: ${vital.value} ${vital.unit}`}>
                  <div className="flex items-center gap-2">
                    <vital.Icon className={`w-6 h-6 flex-shrink-0 ${c.icon}`} strokeWidth={2.5} />
                    <span className={`text-base font-bold ${c.text}`}>{vital.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`font-black leading-none ${c.text}`} style={{ fontSize: '2.2rem' }}>{vital.value}</span>
                    <span className={`text-base font-bold mb-0.5 ${c.text} opacity-90`}>{vital.unit}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg ${c.badge} self-start`}>
                    {vital.status === 'normal' ? '✓ Normal' : vital.status === 'warning' ? '⚠ Watch' : '✗ Alert'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── MEDICATION SCHEDULE ─────────────────────────────── */}
        <section aria-label="Medication Schedule">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Pill className="w-6 h-6 text-slate-900 flex-shrink-0" strokeWidth={2.5} />
              <h2 className="text-xl font-black text-slate-900">Medication Schedule</h2>
            </div>
            <button
              onClick={() => setShowMedModal(true)}
              aria-label="Edit medication schedule"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl border-4 border-blue-900 px-5 shadow focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors text-base"
              style={{ minHeight: '48px' }}
            >
              <Pencil className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} /> Edit Meds
            </button>
          </div>
          {meds.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-slate-300 rounded-2xl p-6 text-center">
              <p className="text-lg font-bold text-slate-500">No medications scheduled. Tap "Edit Meds" to add.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {meds.map(med => (
                <div key={med.id} className={`rounded-2xl border-4 p-4 flex flex-col gap-1.5 ${med.taken ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-300'}`}>
                  <span className="text-lg font-black text-slate-900">{med.time}</span>
                  <div className="flex items-center gap-2">
                    <Pill className={`w-5 h-5 flex-shrink-0 ${med.taken ? 'text-emerald-700' : 'text-slate-500'}`} strokeWidth={2} />
                    <span className="text-base font-bold text-slate-800 leading-tight">{med.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{med.dose} {med.unit}</span>
                  <button
                    onClick={() => toggleMedTaken(med.id)}
                    aria-label={med.taken ? `Mark ${med.name} as not taken` : `Mark ${med.name} as taken`}
                    className={`
                      flex items-center justify-center gap-2 rounded-xl border-4 font-bold text-sm
                      focus:outline-none focus:ring-4 transition-colors mt-1
                      ${med.taken
                        ? 'bg-slate-200 border-slate-400 text-slate-700 hover:bg-slate-300 focus:ring-slate-400'
                        : 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-700 focus:ring-emerald-400'}
                    `}
                    style={{ minHeight: '44px' }}
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                    {med.taken ? 'Taken ✓' : 'Mark Taken'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── LOG ACTIONS ──────────────────────────────────────── */}
        <section aria-label="Log Health Data">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-6 h-6 text-slate-900 flex-shrink-0" strokeWidth={2.5} />
            <h2 className="text-xl font-black text-slate-900">Log Today's Data</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">

            {/* Weight Stepper */}
            <div className="bg-white border-4 border-slate-300 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-slate-800 flex-shrink-0" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-slate-900">Log Today's Weight</h3>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button onClick={() => adjustWeight(-0.5)} aria-label="Decrease weight"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
                  style={{ minWidth: '56px', minHeight: '56px' }}>−</button>
                <div className="flex flex-col items-center">
                  <span className="font-black text-slate-900 leading-none" style={{ fontSize: '2.5rem' }}>{weight}</span>
                  <span className="text-base font-bold text-slate-600">kg</span>
                </div>
                <button onClick={() => adjustWeight(0.5)} aria-label="Increase weight"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
                  style={{ minWidth: '56px', minHeight: '56px' }}>+</button>
              </div>
              <button
                onClick={() => setWeightLogged(true)}
                aria-label={`Save weight ${weight} kg`}
                className={`flex items-center justify-center gap-2 rounded-2xl font-black text-lg border-4 shadow focus:outline-none focus:ring-4 transition-colors ${weightLogged ? 'bg-emerald-600 border-emerald-800 text-white focus:ring-emerald-400' : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white focus:ring-blue-400'}`}
                style={{ minHeight: '56px' }}
              >
                {weightLogged ? <><CheckCircle2 className="w-6 h-6" strokeWidth={2.5} /> Saved!</> : <><Scale className="w-6 h-6" strokeWidth={2.5} /> Save Weight</>}
              </button>
            </div>

            {/* Symptom Logger */}
            <div className="bg-white border-4 border-slate-300 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-slate-800 flex-shrink-0" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-slate-900">Log Symptoms</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS.map(s => {
                  const sel = loggedSymptoms.includes(s)
                  return (
                    <button key={s} onClick={() => toggleSymptom(s)} aria-pressed={sel}
                      className={`rounded-xl border-4 font-bold text-sm text-left px-3 focus:outline-none focus:ring-4 transition-colors ${sel ? 'bg-red-600 border-red-800 text-white focus:ring-red-400' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200 focus:ring-slate-400'}`}
                      style={{ minHeight: '48px' }}>
                      {sel ? '✓ ' : ''}{s}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setSymptomSaved(true)}
                disabled={loggedSymptoms.length === 0}
                className={`flex items-center justify-center gap-2 rounded-2xl font-black text-lg border-4 shadow focus:outline-none focus:ring-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${symptomSaved ? 'bg-emerald-600 border-emerald-800 text-white focus:ring-emerald-400' : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white focus:ring-blue-400'}`}
                style={{ minHeight: '56px' }}
              >
                {symptomSaved ? <><CheckCircle2 className="w-6 h-6" strokeWidth={2.5} /> Saved!</> : <><Droplets className="w-6 h-6" strokeWidth={2.5} /> Save Symptoms</>}
              </button>
            </div>
          </div>
        </section>

        {/* ── FAMILY VIDEO CALLS ───────────────────────────────── */}
        <section aria-label="Video Call Family">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-6 h-6 text-slate-900 flex-shrink-0" strokeWidth={2.5} />
            <h2 className="text-xl font-black text-slate-900">Video Call Family</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => onCallContact(contact)}
                aria-label={`Start video call with ${contact.name}, ${contact.relation}`}
                className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-blue-50 active:bg-blue-100 border-4 border-blue-600 rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors py-4"
                style={{ minHeight: '140px' }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-400 flex items-center justify-center text-4xl shadow-inner">
                  {contact.emoji}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-black text-slate-900">{contact.name}</span>
                  <span className="text-base font-bold text-slate-600">{contact.relation}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-700 text-white rounded-xl px-4 py-1.5">
                  <Video className="w-5 h-5" strokeWidth={2.5} />
                  <span className="font-bold text-base">Video Call</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── DEBUG ────────────────────────────────────────────── */}
        <div className="flex justify-end pb-1">
          <button
            onClick={onSimulateFall}
            aria-label="Debug: Simulate fall detection"
            className="text-xs text-slate-400 font-semibold bg-slate-200 border-2 border-slate-300 rounded-lg px-3 py-1.5 hover:text-slate-600 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            ⚠ Simulate Fall (Debug)
          </button>
        </div>

      </main>
    </div>
  )
}

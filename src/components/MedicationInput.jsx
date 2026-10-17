import { useState } from 'react'
import { X, Pill, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react'

const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1)   // 1–12
const AMPM    = ['AM', 'PM']
const COMMON_NAMES = ['Lisinopril', 'Metformin', 'Atorvastatin', 'Aspirin', 'Amlodipine', 'Omeprazole', 'Other']
const DOSE_UNITS   = ['mg', 'mcg', 'ml', 'tablet(s)']

function emptyMed() {
  return { id: Date.now(), name: '', customName: '', dose: 1, unit: 'mg', hour: 8, ampm: 'AM' }
}

// ── Single medication row ────────────────────────────────────────
function MedRow({ med, onChange, onRemove }) {
  return (
    <div className="bg-slate-50 border-4 border-slate-300 rounded-2xl p-5 flex flex-col gap-4">

      {/* Row 1: Name selector */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Pill className="w-6 h-6 text-slate-700" strokeWidth={2.5} />
          Medication Name
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_NAMES.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...med, name: n, customName: n === 'Other' ? med.customName : n })}
              aria-pressed={med.name === n}
              className={`
                rounded-xl border-4 font-bold text-base px-4
                focus:outline-none focus:ring-4 transition-colors
                ${med.name === n
                  ? 'bg-blue-700 border-blue-900 text-white focus:ring-blue-400'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100 focus:ring-slate-400'}
              `}
              style={{ minHeight: '52px' }}
            >
              {n}
            </button>
          ))}
        </div>
        {med.name === 'Other' && (
          <input
            type="text"
            value={med.customName}
            onChange={e => onChange({ ...med, customName: e.target.value })}
            placeholder="Type medication name…"
            aria-label="Custom medication name"
            className="
              w-full rounded-xl border-4 border-slate-400 bg-white
              text-slate-900 font-bold text-xl px-5
              focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500
            "
            style={{ minHeight: '60px', fontSize: '1.2rem' }}
          />
        )}
      </div>

      {/* Row 2: Dosage stepper */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-black text-slate-900">Dosage</label>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ ...med, dose: Math.max(0.5, +(med.dose - 0.5).toFixed(1)) })}
              aria-label="Decrease dosage"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '56px', minHeight: '56px' }}
            >−</button>
            <span className="font-black text-slate-900 text-3xl min-w-[60px] text-center tabular-nums">{med.dose}</span>
            <button
              type="button"
              onClick={() => onChange({ ...med, dose: Math.min(2000, +(med.dose + 0.5).toFixed(1)) })}
              aria-label="Increase dosage"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '56px', minHeight: '56px' }}
            >+</button>
          </div>
          {/* Unit selector */}
          <div className="flex gap-2 flex-wrap">
            {DOSE_UNITS.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => onChange({ ...med, unit: u })}
                aria-pressed={med.unit === u}
                className={`
                  rounded-xl border-4 font-bold text-lg px-4
                  focus:outline-none focus:ring-4 transition-colors
                  ${med.unit === u
                    ? 'bg-slate-800 border-slate-900 text-white focus:ring-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100 focus:ring-slate-400'}
                `}
                style={{ minHeight: '52px' }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Time picker */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-slate-700" strokeWidth={2.5} />
          Time to Take
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Hour stepper */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ ...med, hour: med.hour === 1 ? 12 : med.hour - 1 })}
              aria-label="Previous hour"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '56px', minHeight: '56px' }}
            >‹</button>
            <span className="font-black text-slate-900 text-3xl min-w-[48px] text-center tabular-nums">{med.hour}</span>
            <button
              type="button"
              onClick={() => onChange({ ...med, hour: med.hour === 12 ? 1 : med.hour + 1 })}
              aria-label="Next hour"
              className="bg-slate-800 hover:bg-slate-900 text-white font-black text-3xl rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
              style={{ minWidth: '56px', minHeight: '56px' }}
            >›</button>
          </div>
          <span className="font-black text-slate-700 text-3xl">:</span>
          <span className="font-black text-slate-900 text-3xl">00</span>
          {/* AM/PM */}
          <div className="flex gap-2">
            {AMPM.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ ...med, ampm: p })}
                aria-pressed={med.ampm === p}
                className={`
                  rounded-xl border-4 font-black text-xl px-5
                  focus:outline-none focus:ring-4 transition-colors
                  ${med.ampm === p
                    ? 'bg-blue-700 border-blue-900 text-white focus:ring-blue-400'
                    : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100 focus:ring-slate-400'}
                `}
                style={{ minHeight: '56px', minWidth: '72px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Remove button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(med.id)}
          aria-label="Remove this medication"
          className="
            flex items-center gap-2 rounded-xl border-4 border-red-600
            bg-red-50 hover:bg-red-100 text-red-700 font-bold text-lg px-5
            focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors
          "
          style={{ minHeight: '52px' }}
        >
          <Trash2 className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
          Remove
        </button>
      </div>
    </div>
  )
}

// ── Main modal ───────────────────────────────────────────────────
export default function MedicationInput({ currentMeds, onSave, onClose }) {
  const [meds, setMeds] = useState(
    currentMeds.length > 0
      ? currentMeds.map(m => ({ ...m, id: m.id ?? Date.now() + Math.random() }))
      : [emptyMed()]
  )

  function updateMed(updated) {
    setMeds(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  function removeMed(id) {
    setMeds(prev => prev.filter(m => m.id !== id))
  }

  function addMed() {
    setMeds(prev => [...prev, emptyMed()])
  }

  function handleSave() {
    const valid = meds.filter(m => (m.name && m.name !== 'Other') || m.customName.trim())
    onSave(valid.map(m => ({
      ...m,
      time: `${m.hour}:00 ${m.ampm}`,
      name: m.name === 'Other' ? m.customName.trim() : m.name,
      taken: false,
    })))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit Medication Schedule"
    >
      <div className="bg-white rounded-3xl border-4 border-slate-300 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b-4 border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Pill className="w-9 h-9 text-slate-800" strokeWidth={2.5} />
            Edit Medications
          </h2>
          <button
            onClick={onClose}
            aria-label="Close medication editor"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-2xl flex items-center gap-2 px-5 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors"
            style={{ minHeight: '56px' }}
          >
            <X className="w-6 h-6" strokeWidth={2.5} /> Close
          </button>
        </div>

        {/* Med rows */}
        <div className="flex flex-col gap-4 px-8 py-6">
          {meds.length === 0 && (
            <p className="text-xl font-bold text-slate-600 text-center py-4">
              No medications added yet. Tap "+ Add Medication" below.
            </p>
          )}
          {meds.map(med => (
            <MedRow key={med.id} med={med} onChange={updateMed} onRemove={removeMed} />
          ))}

          {/* Add another */}
          <button
            type="button"
            onClick={addMed}
            aria-label="Add another medication"
            className="
              w-full flex items-center justify-center gap-4
              bg-slate-100 hover:bg-slate-200 active:bg-slate-300
              text-slate-800 font-black rounded-2xl border-4 border-dashed border-slate-400
              focus:outline-none focus:ring-4 focus:ring-slate-400 transition-colors
            "
            style={{ minHeight: '64px', fontSize: '1.2rem' }}
          >
            <Plus className="w-8 h-8" strokeWidth={2.5} />
            Add Another Medication
          </button>
        </div>

        {/* Save */}
        <div className="px-8 pb-6 sticky bottom-0 bg-white border-t-4 border-slate-200 pt-4">
          <button
            onClick={handleSave}
            aria-label="Save medication schedule"
            className="
              w-full flex items-center justify-center gap-4
              bg-blue-700 hover:bg-blue-800 active:bg-blue-900
              text-white font-black rounded-2xl border-4 border-blue-900
              shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors
            "
            style={{ minHeight: '72px', fontSize: '1.4rem' }}
          >
            <CheckCircle2 className="w-9 h-9 flex-shrink-0" strokeWidth={2.5} />
            Save Medications
          </button>
        </div>
      </div>
    </div>
  )
}

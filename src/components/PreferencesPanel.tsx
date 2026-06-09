import { useState } from 'react'
import { CaretDown, SlidersHorizontal } from '@phosphor-icons/react'
import {
  MAX_CUSTOM_INSTRUCTIONS_LENGTH,
  type OutputLength,
  type ResumeFocus,
  type ResumeTone,
  type UserPreferences,
} from '../types/userPreferences'

interface PreferencesPanelProps {
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
}

function PreferencesPanel({ preferences, onPreferencesChange }: PreferencesPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const update = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    onPreferencesChange({ ...preferences, [key]: value })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
        aria-expanded={isOpen}
        aria-controls="advanced-tailoring-options"
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">
            <SlidersHorizontal size={20} weight="duotone" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Advanced tailoring options
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Optional controls for length, focus, tone, ATS keywords, and custom
              instructions.
            </p>
          </div>
        </div>
        <CaretDown
          size={18}
          className={`flex-shrink-0 text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id="advanced-tailoring-options"
          className="border-t border-slate-200 px-4 pb-5 pt-4 sm:px-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Output length</span>
              <select
                className="app-select"
                value={preferences.output_length}
                onChange={(e) => update('output_length', e.target.value as OutputLength)}
              >
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Focus</span>
              <select
                className="app-select"
                value={preferences.focus}
                onChange={(e) => update('focus', e.target.value as ResumeFocus)}
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="leadership">Leadership</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Tone</span>
              <select
                className="app-select"
                value={preferences.tone}
                onChange={(e) => update('tone', e.target.value as ResumeTone)}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 lg:mt-7">
              <input
                type="checkbox"
                checked={preferences.ats_optimization}
                onChange={(e) => update('ats_optimization', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700">Emphasize ATS keywords</span>
            </label>
          </div>

          <div className="mt-4">
            <label htmlFor="custom-instructions" className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Custom instructions (optional)
              </span>
              <textarea
                id="custom-instructions"
                value={preferences.custom_instructions}
                onChange={(e) =>
                  update(
                    'custom_instructions',
                    e.target.value.slice(0, MAX_CUSTOM_INSTRUCTIONS_LENGTH)
                  )
                }
                placeholder="e.g. Keep my current job title, highlight cloud experience, avoid buzzwords..."
                rows={3}
                className="app-textarea resize-none"
              />
              <span className="text-right text-xs text-slate-500">
                {preferences.custom_instructions.length}/{MAX_CUSTOM_INSTRUCTIONS_LENGTH}
              </span>
            </label>
          </div>
        </div>
      )}
    </section>
  )
}

export default PreferencesPanel

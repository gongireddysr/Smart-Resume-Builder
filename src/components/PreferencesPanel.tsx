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

const selectClass =
  'w-full px-2 py-1.5 text-xs sm:text-sm bg-black/20 text-white border border-gray-600/40 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 poppins-font'

function PreferencesPanel({ preferences, onPreferencesChange }: PreferencesPanelProps) {
  const update = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    onPreferencesChange({ ...preferences, [key]: value })
  }

  return (
    <div className="flex-shrink-0 bg-black/10 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/30 mx-1 sm:mx-4 mb-2 sm:mb-3 relative z-10">
      <div className="px-3 sm:px-4 py-2 border-b border-gray-700/30">
        <h2 className="text-sm sm:text-base font-semibold text-green-400 poppins-font">
          Tailoring options
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 poppins-font">
          General controls for how your resume is customized.
        </p>
      </div>

      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300 poppins-font">Output length</span>
          <select
            className={selectClass}
            value={preferences.output_length}
            onChange={(e) => update('output_length', e.target.value as OutputLength)}
          >
            <option value="concise">Concise</option>
            <option value="balanced">Balanced</option>
            <option value="detailed">Detailed</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300 poppins-font">Focus</span>
          <select
            className={selectClass}
            value={preferences.focus}
            onChange={(e) => update('focus', e.target.value as ResumeFocus)}
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="leadership">Leadership</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300 poppins-font">Tone</span>
          <select
            className={selectClass}
            value={preferences.tone}
            onChange={(e) => update('tone', e.target.value as ResumeTone)}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </label>

        <label className="flex items-center gap-2 sm:mt-5 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.ats_optimization}
            onChange={(e) => update('ats_optimization', e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 text-green-600 focus:ring-green-500"
          />
          <span className="text-xs sm:text-sm text-gray-200 poppins-font">
            Emphasize ATS keywords
          </span>
        </label>
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300 poppins-font">
            Custom instructions (optional)
          </span>
          <textarea
            value={preferences.custom_instructions}
            onChange={(e) =>
              update(
                'custom_instructions',
                e.target.value.slice(0, MAX_CUSTOM_INSTRUCTIONS_LENGTH)
              )
            }
            placeholder="e.g. Keep my current job title, highlight cloud experience, avoid buzzwords..."
            rows={2}
            className="w-full p-2 text-xs sm:text-sm bg-black/10 text-white border border-gray-600/30 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 poppins-font"
          />
          <span className="text-xs text-gray-500 text-right poppins-font">
            {preferences.custom_instructions.length}/{MAX_CUSTOM_INSTRUCTIONS_LENGTH}
          </span>
        </label>
      </div>
    </div>
  )
}

export default PreferencesPanel

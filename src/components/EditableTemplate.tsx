import { Plus, Trash } from '@phosphor-icons/react'
import type { ResumeExperience, TemplateData } from '../types/resume'
import {
  parseSkills,
  skillsToString,
  splitSkillsIntoColumns,
} from '../utils/resumeData'

interface EditableTemplateProps {
  data: TemplateData
  onChange: (data: TemplateData) => void
  className?: string
}

function EditableTemplate({ data, onChange, className = '' }: EditableTemplateProps) {
  const skills = parseSkills(data.skills || '')
  const { leftColumn, rightColumn } = splitSkillsIntoColumns(skills)

  const updateField = <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => {
    onChange({ ...data, [field]: value })
  }

  const updateExperience = (
    jobIndex: number,
    field: keyof ResumeExperience,
    value: string | string[]
  ) => {
    const experience = [...(data.experience || [])]
    experience[jobIndex] = { ...experience[jobIndex], [field]: value }
    onChange({ ...data, experience })
  }

  const updateBullet = (jobIndex: number, bulletIndex: number, value: string) => {
    const experience = [...(data.experience || [])]
    const bulletPoints = [...experience[jobIndex].bullet_points]
    bulletPoints[bulletIndex] = value
    experience[jobIndex] = { ...experience[jobIndex], bullet_points: bulletPoints }
    onChange({ ...data, experience })
  }

  const addBullet = (jobIndex: number) => {
    const experience = [...(data.experience || [])]
    experience[jobIndex] = {
      ...experience[jobIndex],
      bullet_points: [...experience[jobIndex].bullet_points, ''],
    }
    onChange({ ...data, experience })
  }

  const removeBullet = (jobIndex: number, bulletIndex: number) => {
    const experience = [...(data.experience || [])]
    const bulletPoints = experience[jobIndex].bullet_points.filter(
      (_, index) => index !== bulletIndex
    )
    experience[jobIndex] = { ...experience[jobIndex], bullet_points: bulletPoints }
    onChange({ ...data, experience })
  }

  const updateSkill = (skillIndex: number, value: string) => {
    const nextSkills = [...skills]
    nextSkills[skillIndex] = value
    updateField('skills', skillsToString(nextSkills))
  }

  const addSkill = () => {
    updateField('skills', skillsToString([...skills, '']))
  }

  const removeSkill = (skillIndex: number) => {
    updateField(
      'skills',
      skillsToString(skills.filter((_, index) => index !== skillIndex))
    )
  }

  const inlineActionClass =
    'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary-soft)]'

  const renderSkillInput = (skill: string, skillIndex: number) => (
    <li key={skillIndex} className="group flex items-center gap-1">
      <input
        type="text"
        value={skill}
        onChange={(event) => updateSkill(skillIndex, event.target.value)}
        className="resume-editable-field flex-1 text-sm sm:text-base text-gray-700"
        aria-label={`Skill ${skillIndex + 1}`}
      />
      <button
        type="button"
        onClick={() => removeSkill(skillIndex)}
        className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove skill ${skillIndex + 1}`}
      >
        <Trash size={14} aria-hidden="true" />
      </button>
    </li>
  )

  return (
    <div
      className={`resume-template bg-white text-black p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto ${className}`}
    >
      <div className="header-section mb-4 sm:mb-6">
        <input
          type="text"
          value={data.full_name || ''}
          onChange={(event) => updateField('full_name', event.target.value)}
          placeholder="Full Name"
          className="resume-editable-field name mb-2 sm:mb-3 w-full text-center text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl"
          aria-label="Full name"
        />

        <div className="contact-info mb-3 sm:mb-4 text-center text-xs text-gray-600 sm:text-sm">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <input
              type="email"
              value={data.email || ''}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="Email"
              className="resume-editable-field min-w-[8rem] max-w-[14rem] text-center"
              aria-label="Email"
            />
            <span className="text-gray-400" aria-hidden="true">
              |
            </span>
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="Phone"
              className="resume-editable-field min-w-[6rem] max-w-[10rem] text-center"
              aria-label="Phone"
            />
            <span className="text-gray-400" aria-hidden="true">
              |
            </span>
            <input
              type="text"
              value={data.location || ''}
              onChange={(event) => updateField('location', event.target.value)}
              placeholder="Location"
              className="resume-editable-field min-w-[6rem] max-w-[12rem] text-center"
              aria-label="Location"
            />
          </div>
          <input
            type="text"
            value={data.urls || ''}
            onChange={(event) => updateField('urls', event.target.value)}
            placeholder="LinkedIn, portfolio URLs (comma-separated)"
            className="resume-editable-field mt-2 w-full text-center"
            aria-label="URLs"
          />
        </div>
      </div>

      <div className="section mb-4 sm:mb-6">
        <h2 className="section-header mb-2 border-b border-gray-300 pb-1 text-base font-semibold uppercase text-gray-800 sm:mb-3 sm:text-lg">
          Professional Summary
        </h2>
        <textarea
          value={data.professional_summary || ''}
          onChange={(event) => updateField('professional_summary', event.target.value)}
          placeholder="Professional summary"
          rows={4}
          className="resume-editable-field w-full resize-y text-sm leading-relaxed text-gray-700 sm:text-base"
          aria-label="Professional summary"
        />
      </div>

      <div className="section mb-4 sm:mb-6">
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
          <h2 className="section-header border-b border-gray-300 pb-1 text-base font-semibold uppercase text-gray-800 sm:text-lg">
            Skills
          </h2>
          <button type="button" onClick={addSkill} className={inlineActionClass}>
            <Plus size={14} weight="bold" aria-hidden="true" />
            Add skill
          </button>
        </div>
        {skills.length > 0 ? (
          <div className="skills-grid grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            <ul className="list-disc space-y-1 pl-4">
              {leftColumn.map((skill, index) => renderSkillInput(skill, index))}
            </ul>
            <ul className="list-disc space-y-1 pl-4">
              {rightColumn.map((skill, index) =>
                renderSkillInput(skill, index + leftColumn.length)
              )}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No skills yet. Add one to get started.</p>
        )}
      </div>

      {data.experience && data.experience.length > 0 && (
        <div className="section mb-4 sm:mb-6">
          <h2 className="section-header mb-2 border-b border-gray-300 pb-1 text-base font-semibold uppercase text-gray-800 sm:mb-3 sm:text-lg">
            Experience
          </h2>
          <div className="experience-list space-y-3 sm:space-y-4">
            {data.experience.map((job, jobIndex) => (
              <div key={jobIndex} className="job-entry rounded-lg p-1">
                <div className="job-header mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={job.job_title}
                      onChange={(event) =>
                        updateExperience(jobIndex, 'job_title', event.target.value)
                      }
                      placeholder="Job title"
                      className="resume-editable-field job-title w-full text-sm font-semibold text-gray-800 sm:text-base"
                      aria-label={`Job title ${jobIndex + 1}`}
                    />
                    <input
                      type="text"
                      value={job.company}
                      onChange={(event) =>
                        updateExperience(jobIndex, 'company', event.target.value)
                      }
                      placeholder="Company"
                      className="resume-editable-field company w-full text-sm font-medium text-gray-700 sm:text-base"
                      aria-label={`Company ${jobIndex + 1}`}
                    />
                  </div>
                  <div className="flex items-center gap-1 sm:text-right">
                    <input
                      type="text"
                      value={job.start_date}
                      onChange={(event) =>
                        updateExperience(jobIndex, 'start_date', event.target.value)
                      }
                      placeholder="Start"
                      className="resume-editable-field w-20 text-xs text-gray-600 sm:text-sm"
                      aria-label={`Start date ${jobIndex + 1}`}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="text"
                      value={job.end_date}
                      onChange={(event) =>
                        updateExperience(jobIndex, 'end_date', event.target.value)
                      }
                      placeholder="End"
                      className="resume-editable-field w-20 text-xs text-gray-600 sm:text-sm"
                      aria-label={`End date ${jobIndex + 1}`}
                    />
                  </div>
                </div>

                <ul className="job-bullets ml-2 space-y-1 sm:ml-4">
                  {job.bullet_points.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="group flex items-start gap-1">
                      <span className="mt-2 text-gray-400" aria-hidden="true">
                        •
                      </span>
                      <textarea
                        value={bullet}
                        onChange={(event) =>
                          updateBullet(jobIndex, bulletIndex, event.target.value)
                        }
                        placeholder="Achievement or responsibility"
                        rows={2}
                        className="resume-editable-field min-h-[2.5rem] flex-1 resize-y text-xs leading-relaxed text-gray-700 sm:text-sm lg:text-base"
                        aria-label={`Bullet ${bulletIndex + 1} for job ${jobIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(jobIndex, bulletIndex)}
                        className="mt-1 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Remove bullet ${bulletIndex + 1}`}
                      >
                        <Trash size={14} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => addBullet(jobIndex)}
                  className={`${inlineActionClass} mt-2`}
                >
                  <Plus size={14} weight="bold" aria-hidden="true" />
                  Add bullet
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section mb-4 sm:mb-6">
        <h2 className="section-header mb-2 border-b border-gray-300 pb-1 text-base font-semibold uppercase text-gray-800 sm:mb-3 sm:text-lg">
          Education
        </h2>
        <textarea
          value={data.education || ''}
          onChange={(event) => updateField('education', event.target.value)}
          placeholder="Education"
          rows={2}
          className="resume-editable-field w-full resize-y text-sm text-gray-700 sm:text-base"
          aria-label="Education"
        />
      </div>
    </div>
  )
}

export default EditableTemplate

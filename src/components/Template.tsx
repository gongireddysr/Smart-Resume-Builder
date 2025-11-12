interface TemplateData {
  full_name?: string
  email?: string
  phone?: string
  location?: string
  urls?: string
  professional_summary?: string
  skills?: string
  experience?: Array<{
    company: string
    job_title: string
    start_date: string
    end_date: string
    bullet_points: string[]
  }>
  education?: string
}

interface TemplateProps {
  data: TemplateData
  className?: string
}

function Template({ data, className = '' }: TemplateProps) {
  // Helper function to parse skills into columns
  const parseSkills = (skillsString: string) => {
    if (!skillsString) return []
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
  }

  // Helper function to split skills into two columns
  const splitSkillsIntoColumns = (skills: string[]) => {
    const midpoint = Math.ceil(skills.length / 2)
    return {
      leftColumn: skills.slice(0, midpoint),
      rightColumn: skills.slice(midpoint)
    }
  }

  const skills = parseSkills(data.skills || '')
  const { leftColumn, rightColumn } = splitSkillsIntoColumns(skills)

  return (
    <div className={`resume-template bg-white text-black p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto ${className}`}>
      {/* Header Section */}
      <div className="header-section mb-4 sm:mb-6">
        {/* Full Name */}
        <h1 className="name text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2 sm:mb-3 text-gray-900">
          {data.full_name || 'Full Name'}
        </h1>
        
        {/* Contact Information */}
        <div className="contact-info text-xs sm:text-sm text-center text-gray-600 mb-3 sm:mb-4">
          <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
            {data.email && (
              <span>{data.email}</span>
            )}
            {data.phone && (
              <span>|</span>
            )}
            {data.phone && (
              <span>{data.phone}</span>
            )}
            {data.location && (
              <span>|</span>
            )}
            {data.location && (
              <span>{data.location}</span>
            )}
          </div>
          {data.urls && (
            <div className="urls mt-1">
              {data.urls.split(',').map((url, index) => (
                <span key={index} className="mr-4">
                  {url.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.professional_summary && (
        <div className="section mb-4 sm:mb-6">
          <h2 className="section-header text-base sm:text-lg font-semibold uppercase text-gray-800 border-b border-gray-300 pb-1 mb-2 sm:mb-3">
            Professional Summary
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
            {data.professional_summary}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="section mb-4 sm:mb-6">
          <h2 className="section-header text-base sm:text-lg font-semibold uppercase text-gray-800 border-b border-gray-300 pb-1 mb-2 sm:mb-3">
            Skills
          </h2>
          <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="skills-column">
              <ul className="list-disc list-inside space-y-1">
                {leftColumn.map((skill, index) => (
                  <li key={index} className="text-sm sm:text-base text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div className="skills-column">
              <ul className="list-disc list-inside space-y-1">
                {rightColumn.map((skill, index) => (
                  <li key={index} className="text-sm sm:text-base text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="section mb-4 sm:mb-6">
          <h2 className="section-header text-base sm:text-lg font-semibold uppercase text-gray-800 border-b border-gray-300 pb-1 mb-2 sm:mb-3">
            Experience
          </h2>
          <div className="experience-list space-y-3 sm:space-y-4">
            {data.experience.map((job, index) => (
              <div key={index} className="job-entry">
                <div className="job-header flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="job-title text-sm sm:text-base font-semibold text-gray-800">
                      {job.job_title}
                    </h3>
                    <p className="company text-sm sm:text-base text-gray-700 font-medium">
                      {job.company}
                    </p>
                  </div>
                  <div className="job-dates text-xs sm:text-sm text-gray-600 sm:text-right">
                    {job.start_date} - {job.end_date}
                  </div>
                </div>
                {job.bullet_points && job.bullet_points.length > 0 && (
                  <ul className="job-bullets list-disc list-inside space-y-1 ml-2 sm:ml-4">
                    {job.bullet_points.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {data.education && (
        <div className="section mb-4 sm:mb-6">
          <h2 className="section-header text-base sm:text-lg font-semibold uppercase text-gray-800 border-b border-gray-300 pb-1 mb-2 sm:mb-3">
            Education
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            {data.education}
          </p>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .resume-template {
            background: white !important;
            color: black !important;
            font-size: 12pt;
            line-height: 1.4;
            margin: 0;
            padding: 0.5in;
            box-shadow: none;
          }
          
          .name {
            font-size: 18pt;
            margin-bottom: 8pt;
          }
          
          .contact-info {
            font-size: 10pt;
            margin-bottom: 12pt;
          }
          
          .section-header {
            font-size: 12pt;
            margin-bottom: 6pt;
            page-break-after: avoid;
          }
          
          .section {
            margin-bottom: 12pt;
            page-break-inside: avoid;
          }
          
          .job-entry {
            page-break-inside: avoid;
            margin-bottom: 10pt;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12pt;
          }
          
          ul {
            margin: 0;
            padding-left: 12pt;
          }
          
          li {
            margin-bottom: 2pt;
          }
        }
      `}</style>
    </div>
  )
}

export default Template

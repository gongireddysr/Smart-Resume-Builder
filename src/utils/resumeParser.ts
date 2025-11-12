interface ParsedResumeData {
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

export function parseResumeText(resumeText: string): ParsedResumeData {
  if (!resumeText) return {}

  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const result: ParsedResumeData = {}

  // Extract name (usually the first line or first non-empty line)
  if (lines.length > 0) {
    const firstLine = lines[0]
    // Check if first line looks like a name (not an email, phone, or section header)
    if (!firstLine.includes('@') && !firstLine.includes('PROFESSIONAL') && !firstLine.includes('SUMMARY')) {
      result.full_name = firstLine
    }
  }

  // Extract contact information
  const contactRegex = {
    email: /[\w\.-]+@[\w\.-]+\.\w+/g,
    phone: /[\+]?[1-9]?[\-\.\s]?\(?[0-9]{3}\)?[\-\.\s]?[0-9]{3}[\-\.\s]?[0-9]{4}/g,
    linkedin: /linkedin\.com\/in\/[\w\-]+/gi,
    github: /github\.com\/[\w\-]+/gi
  }

  
  // Extract email
  const emailMatch = resumeText.match(contactRegex.email)
  if (emailMatch) {
    result.email = emailMatch[0]
  }

  // Extract phone
  const phoneMatch = resumeText.match(contactRegex.phone)
  if (phoneMatch) {
    result.phone = phoneMatch[0]
  }

  // Extract URLs
  const urls = []
  const linkedinMatch = resumeText.match(contactRegex.linkedin)
  if (linkedinMatch) urls.push(linkedinMatch[0])
  
  const githubMatch = resumeText.match(contactRegex.github)
  if (githubMatch) urls.push(githubMatch[0])
  
  if (urls.length > 0) {
    result.urls = urls.join(', ')
  }

  // Extract location (look for city, state patterns)
  const locationRegex = /([A-Za-z\s]+),\s*([A-Z]{2})/g
  const locationMatch = resumeText.match(locationRegex)
  if (locationMatch) {
    result.location = locationMatch[0]
  }

  // Extract sections
  const sections = extractSections(resumeText)

  // Professional Summary
  if (sections.summary) {
    result.professional_summary = sections.summary
  }

  // Skills
  if (sections.skills) {
    result.skills = sections.skills
  }

  // Experience
  if (sections.experience) {
    result.experience = parseExperience(sections.experience)
  }

  // Education
  if (sections.education) {
    result.education = sections.education
  }

  return result
}

function extractSections(resumeText: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const lines = resumeText.split('\n')
  
  let currentSection = ''
  let currentContent: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim().toUpperCase()
    
    // Check for section headers
    if (trimmedLine.includes('PROFESSIONAL SUMMARY') || trimmedLine.includes('SUMMARY')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim()
      }
      currentSection = 'summary'
      currentContent = []
    } else if (trimmedLine.includes('SKILLS') || trimmedLine.includes('TECHNICAL SKILLS')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim()
      }
      currentSection = 'skills'
      currentContent = []
    } else if (trimmedLine.includes('EXPERIENCE') || trimmedLine.includes('WORK EXPERIENCE')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim()
      }
      currentSection = 'experience'
      currentContent = []
    } else if (trimmedLine.includes('EDUCATION')) {
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim()
      }
      currentSection = 'education'
      currentContent = []
    } else if (currentSection && line.trim()) {
      currentContent.push(line.trim())
    }
  }

  // Add the last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim()
  }

  return sections
}

function parseExperience(experienceText: string): Array<{
  company: string
  job_title: string
  start_date: string
  end_date: string
  bullet_points: string[]
}> {
  const experiences = []
  const lines = experienceText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let currentJob: any = null
  let bulletPoints: string[] = []

  for (const line of lines) {
    // Check if line contains dates (likely a job header)
    const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}|\d{1,2}\/\d{4})/i
    
    if (datePattern.test(line) && (line.includes('-') || line.includes('to') || line.includes('Present'))) {
      // Save previous job if exists
      if (currentJob) {
        currentJob.bullet_points = [...bulletPoints]
        experiences.push(currentJob)
      }
      
      // Parse new job
      const parts = line.split(/[-–—]|to/i)
      const startDate = parts[0]?.trim() || ''
      const endDate = parts[1]?.trim() || 'Present'
      
      currentJob = {
        company: '',
        job_title: '',
        start_date: startDate,
        end_date: endDate,
        bullet_points: []
      }
      bulletPoints = []
    } else if (currentJob && !currentJob.job_title && !line.startsWith('•') && !line.startsWith('-')) {
      // This might be the job title or company
      if (!currentJob.job_title) {
        currentJob.job_title = line
      } else if (!currentJob.company) {
        currentJob.company = line
      }
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is a bullet point
      bulletPoints.push(line.replace(/^[•\-*]\s*/, ''))
    } else if (currentJob && line.length > 0) {
      // This might be company name or additional info
      if (!currentJob.company) {
        currentJob.company = line
      }
    }
  }

  // Add the last job
  if (currentJob) {
    currentJob.bullet_points = [...bulletPoints]
    experiences.push(currentJob)
  }

  return experiences
}

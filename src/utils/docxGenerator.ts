import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx'

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

export async function generateDocx(data: TemplateData): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        ...(data.full_name ? [
          new Paragraph({
            children: [
              new TextRun({
                text: data.full_name,
                bold: true,
                size: 32, // 16pt
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
        ] : []),

        // Contact Information
        ...generateContactInfo(data),

        // Professional Summary
        ...(data.professional_summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL SUMMARY",
                bold: true,
                size: 24, // 12pt
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            border: {
              bottom: {
                color: "000000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.professional_summary,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 300 },
          }),
        ] : []),

        // Skills
        ...generateSkillsSection(data.skills),

        // Experience
        ...generateExperienceSection(data.experience),

        // Education
        ...(data.education ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                size: 24, // 12pt
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            border: {
              bottom: {
                color: "000000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.education,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 300 },
          }),
        ] : []),
      ],
    }],
  })

  return await Packer.toBlob(doc)
}

function generateContactInfo(data: TemplateData): Paragraph[] {
  const contactParts = []
  
  if (data.email) contactParts.push(data.email)
  if (data.phone) contactParts.push(data.phone)
  if (data.location) contactParts.push(data.location)
  
  const paragraphs = []
  
  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 20, // 10pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  }

  if (data.urls) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.urls,
            size: 20, // 10pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    )
  }

  return paragraphs
}

function generateSkillsSection(skills?: string): (Paragraph | Table)[] {
  if (!skills) return []

  const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
  if (skillsArray.length === 0) return []

  // Split skills into two columns like the web template
  const midpoint = Math.ceil(skillsArray.length / 2)
  const leftColumn = skillsArray.slice(0, midpoint)
  const rightColumn = skillsArray.slice(midpoint)

  const elements: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "SKILLS",
          bold: true,
          size: 24, // 12pt
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
  ]

  // Create table rows for 2-column layout
  const tableRows: TableRow[] = []
  const maxRows = Math.max(leftColumn.length, rightColumn.length)

  for (let i = 0; i < maxRows; i++) {
    const leftSkill = leftColumn[i] || ''
    const rightSkill = rightColumn[i] || ''
    
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: leftSkill ? `• ${leftSkill}` : '',
                    size: 22, // 11pt
                  }),
                ],
                spacing: { after: 80 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: rightSkill ? `• ${rightSkill}` : '',
                    size: 22, // 11pt
                  }),
                ],
                spacing: { after: 80 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
        ],
      })
    )
  }

  // Add the skills table
  elements.push(
    new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
    })
  )

  // Add spacing after skills section
  elements.push(
    new Paragraph({
      children: [],
      spacing: { after: 200 },
    })
  )

  return elements
}

function generateExperienceSection(experience?: Array<{
  company: string
  job_title: string
  start_date: string
  end_date: string
  bullet_points: string[]
}>): Paragraph[] {
  if (!experience || experience.length === 0) return []

  const paragraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: "EXPERIENCE",
          bold: true,
          size: 24, // 12pt
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
  ]

  experience.forEach((job, index) => {
    // Job title and company
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: job.job_title,
            bold: true,
            size: 22, // 11pt
          }),
        ],
        spacing: { before: index > 0 ? 300 : 0, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${job.company} | ${job.start_date} - ${job.end_date}`,
            size: 22, // 11pt
            italics: true,
          }),
        ],
        spacing: { after: 150 },
      })
    )

    // Bullet points
    if (job.bullet_points && job.bullet_points.length > 0) {
      job.bullet_points.forEach(bullet => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet}`,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 100 },
            indent: { left: 360 }, // Indent bullet points
          })
        )
      })
    }
  })

  return paragraphs
}

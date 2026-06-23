import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx'
import type { ResumeExperience, TemplateData } from '../types/resume'
import { parseSkillDisplayLines, parseSkills, splitSkillsIntoColumns, usesCategorizedSkills } from './resumeData'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const BODY_TEXT_SIZE = 22 // 11pt
const SMALL_TEXT_SIZE = 20 // 10pt
const SECTION_HEADER_SIZE = 24 // 12pt
const NAME_SIZE = 32 // 16pt
const PAGE_WIDTH = 12240 // US Letter width in twips
const PAGE_MARGIN = 1440 // 1 inch
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2
const COLUMN_TAB_POSITION = Math.floor(CONTENT_WIDTH / 2)

export async function generateDocx(data: TemplateData): Promise<Blob> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: BODY_TEXT_SIZE,
            color: '1F2937',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: PAGE_WIDTH,
              height: 15840,
            },
            margin: {
              top: PAGE_MARGIN,
              right: PAGE_MARGIN,
              bottom: PAGE_MARGIN,
              left: PAGE_MARGIN,
            },
          },
        },
        children: [
          ...(data.full_name
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.full_name,
                      bold: true,
                      size: NAME_SIZE,
                      color: '111827',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200 },
                }),
              ]
            : []),

          ...generateContactInfo(data),

          ...(data.professional_summary
            ? [
                ...sectionHeader('Professional Summary'),
                ...bodyParagraphs(data.professional_summary, { afterLast: 300 }),
              ]
            : []),

          ...generateSkillsSection(data.skills),
          ...generateExperienceSection(data.experience),

          ...(data.education
            ? [
                ...sectionHeader('Education'),
                ...bodyParagraphs(data.education, { afterLast: 300 }),
              ]
            : []),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  return blob.type === DOCX_MIME
    ? blob
    : new Blob([blob], { type: DOCX_MIME })
}

function sectionHeader(title: string): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: SECTION_HEADER_SIZE,
          color: '1F2937',
        }),
      ],
      spacing: { before: 400, after: 120 },
      border: {
        bottom: {
          color: 'D1D5DB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
    new Paragraph({
      children: [],
      spacing: { after: 160 },
    }),
  ]
}

function bodyParagraphs(
  text: string,
  options: { afterLast?: number; afterEach?: number } = {}
): Paragraph[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const afterEach = options.afterEach ?? 120
  const afterLast = options.afterLast ?? 300

  return lines.map(
    (line, index) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: BODY_TEXT_SIZE,
          }),
        ],
        spacing: {
          after: index === lines.length - 1 ? afterLast : afterEach,
        },
      })
  )
}

function bulletParagraph(text: string, indentTwips = 360): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `• ${text}`,
        size: BODY_TEXT_SIZE,
      }),
    ],
    spacing: { after: 80 },
    indent: { left: indentTwips },
  })
}

function generateContactInfo(data: TemplateData): Paragraph[] {
  const contactParts = []

  if (data.email) contactParts.push(data.email)
  if (data.phone) contactParts.push(data.phone)
  if (data.location) contactParts.push(data.location)

  const paragraphs: Paragraph[] = []

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: SMALL_TEXT_SIZE,
            color: '4B5563',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  }

  if (data.urls) {
    const urls = data.urls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean)

    urls.forEach((url, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: url,
              size: SMALL_TEXT_SIZE,
              color: '4B5563',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: index === urls.length - 1 ? 400 : 120 },
        })
      )
    })
  }

  return paragraphs
}

function generateSkillsSection(skills?: string): Paragraph[] {
  const skillsArray = parseSkills(skills || '')
  const skillDisplayLines = parseSkillDisplayLines(skills || '')
  if (skillsArray.length === 0 && skillDisplayLines.length === 0) return []

  const elements: Paragraph[] = [...sectionHeader('Skills')]

  if (usesCategorizedSkills(skills || '')) {
    skillDisplayLines.forEach((line, index) => {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${line}`,
              size: BODY_TEXT_SIZE,
            }),
          ],
          spacing: { after: index === skillDisplayLines.length - 1 ? 200 : 80 },
        })
      )
    })
    return elements
  }

  const { leftColumn, rightColumn } = splitSkillsIntoColumns(skillsArray)
  const maxRows = Math.max(leftColumn.length, rightColumn.length)

  for (let i = 0; i < maxRows; i += 1) {
    const leftSkill = leftColumn[i] || ''
    const rightSkill = rightColumn[i] || ''

    if (leftSkill && rightSkill) {
      elements.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.LEFT,
              position: COLUMN_TAB_POSITION,
            },
          ],
          children: [
            new TextRun({
              text: `• ${leftSkill}`,
              size: BODY_TEXT_SIZE,
            }),
            new TextRun({
              text: '\t',
            }),
            new TextRun({
              text: `• ${rightSkill}`,
              size: BODY_TEXT_SIZE,
            }),
          ],
          spacing: { after: 80 },
        })
      )
      continue
    }

    if (leftSkill) {
      elements.push(bulletParagraph(leftSkill, 0))
    }

    if (rightSkill) {
      elements.push(bulletParagraph(rightSkill, 0))
    }
  }

  elements.push(
    new Paragraph({
      children: [],
      spacing: { after: 200 },
    })
  )

  return elements
}

function generateExperienceSection(experience?: ResumeExperience[]): Paragraph[] {
  if (!experience || experience.length === 0) return []

  const paragraphs = [...sectionHeader('Experience')]

  experience.forEach((job, index) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: job.job_title,
            bold: true,
            size: BODY_TEXT_SIZE,
            color: '1F2937',
          }),
        ],
        spacing: { before: index > 0 ? 300 : 0, after: 80 },
      })
    )

    const dates = [job.start_date, job.end_date].filter(Boolean).join(' - ')

    if (job.company && dates) {
      paragraphs.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: CONTENT_WIDTH,
            },
          ],
          children: [
            new TextRun({
              text: job.company,
              size: BODY_TEXT_SIZE,
            }),
            new TextRun({
              text: '\t',
            }),
            new TextRun({
              text: dates,
              size: SMALL_TEXT_SIZE,
              color: '4B5563',
            }),
          ],
          spacing: { after: 150 },
        })
      )
    } else if (job.company) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.company,
              size: BODY_TEXT_SIZE,
            }),
          ],
          spacing: { after: 80 },
        })
      )
    } else if (dates) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: dates,
              size: SMALL_TEXT_SIZE,
              color: '4B5563',
            }),
          ],
          spacing: { after: 150 },
        })
      )
    }

    if (job.bullet_points && job.bullet_points.length > 0) {
      job.bullet_points.forEach((bullet) => {
        paragraphs.push(bulletParagraph(bullet))
      })
    }
  })

  return paragraphs
}

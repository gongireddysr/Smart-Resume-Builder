import mammoth from 'mammoth'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfjsWorker

export type SupportedResumeFormat = 'docx' | 'pdf'

const ACCEPTED_RESUME_TYPES =
  '.docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf'

export const RESUME_FILE_ACCEPT = ACCEPTED_RESUME_TYPES

export function getSupportedResumeFormat(file: File): SupportedResumeFormat | null {
  const fileName = file.name.toLowerCase()

  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return 'docx'
  }

  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf'
  }

  return null
}

async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const pageTexts: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (pageText) {
      pageTexts.push(pageText)
    }
  }

  return pageTexts.join('\n\n').trim()
}

export async function extractResumeText(file: File): Promise<string> {
  const format = getSupportedResumeFormat(file)

  if (!format) {
    throw new Error('Unsupported file type')
  }

  const arrayBuffer = await file.arrayBuffer()

  if (format === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  return extractPdfText(arrayBuffer)
}

export function resumeFileToTxtName(fileName: string): string {
  return fileName.replace(/\.(docx|pdf)$/i, '.txt') || 'resume.txt'
}

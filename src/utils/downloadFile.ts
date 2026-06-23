const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function downloadBlob(
  blob: Blob,
  fileName: string,
  mimeType = DOCX_MIME
): void {
  const normalizedBlob =
    blob.type === mimeType ? blob : new Blob([blob], { type: mimeType })

  const url = URL.createObjectURL(normalizedBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

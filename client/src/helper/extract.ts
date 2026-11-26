import { ERRORS } from '../constant/errors.ts'
import { EXTRACT_PATH, FILES_FIELD } from '../constant/upload.ts'
import type { ExtractResponse } from '../types/extract.ts'

export async function extractPdfs(files: FileList): Promise<ExtractResponse> {
  const body = new FormData()
  for (const file of files) {
    body.append(FILES_FIELD, file)
  }

  const response = await fetch(EXTRACT_PATH, { method: 'POST', body })
  const data = await response.json() as ExtractResponse & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || ERRORS.REQUEST_FAILED)
  }
  return data
}

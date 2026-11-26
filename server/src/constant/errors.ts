export const ERRORS = {
  MULTIPART: 'Send the PDFs as multipart form data.',
  NO_PDF: 'Upload at least one PDF.',
  TOO_MANY_PDFS: 'Upload at most 10 PDFs.',
  DUPLICATE_FILENAME: 'Each PDF needs its own filename.',
  FILE_TOO_LARGE: (filename: string) => `${filename} is larger than 25 MB.`,
  NOT_PDF: (filename: string) => `${filename} is not a PDF.`,
  UNREADABLE: 'The upload could not be read.',
  MISSING_API_KEY: 'Set GEMINI_API_KEY in server/.env before calling the model.',
  MODEL: 'The model could not read this file.',
  MODEL_OUTPUT: 'The model sent back nothing to transcribe.',
  RATE_LIMITED: 'The model is receiving too many requests. Try this file again in a moment.',
  UNAVAILABLE: 'The model is busy. Try this file again in a moment.',
}

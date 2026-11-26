import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ERRORS } from '../constant/errors.ts'
import { MAX_FILE_BYTES } from '../constant/limits.ts'
import { validateExtractRequest } from './validate.ts'

function pdf(name: string): File {
  return new File(['%PDF-1.4'], name)
}

describe('validateExtractRequest', () => {
  it('requires at least one PDF', async () => {
    await assert.rejects(validateExtractRequest([]), { message: ERRORS.NO_PDF })
  })

  it('allows at most 10 PDFs', async () => {
    const files = Array.from({ length: 11 }, (_, index) => pdf(`${index}.pdf`))
    await assert.rejects(validateExtractRequest(files), { message: ERRORS.TOO_MANY_PDFS })
  })

  it('allows at most 25 MB for each PDF', async () => {
    const file = pdf('big.pdf')
    Object.defineProperty(file, 'size', { value: MAX_FILE_BYTES + 1 })
    await assert.rejects(validateExtractRequest([file]), { message: ERRORS.FILE_TOO_LARGE('big.pdf') })
  })

  it('rejects a file that does not start with %PDF', async () => {
    const notes = new File(['hello'], 'notes.txt')
    await assert.rejects(validateExtractRequest([notes]), { message: ERRORS.NOT_PDF('notes.txt') })
  })

  it('accepts one valid PDF', async () => {
    await validateExtractRequest([pdf('student.pdf')])
  })
})

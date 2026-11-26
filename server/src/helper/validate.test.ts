import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_FILE_BYTES } from '../constant/limits.ts'
import { validateExtractRequest } from './validate.ts'

function pdf(name: string): File {
  return new File(['%PDF-1.4'], name)
}

describe('validateExtractRequest', () => {
  it('requires at least one PDF', async () => {
    await assert.rejects(validateExtractRequest([]), /at least one PDF/)
  })

  it('allows at most 10 PDFs', async () => {
    const files = Array.from({ length: 11 }, (_, index) => pdf(`${index}.pdf`))
    await assert.rejects(validateExtractRequest(files), /at most 10 PDFs/)
  })

  it('allows at most 25 MB for each PDF', async () => {
    const file = pdf('big.pdf')
    Object.defineProperty(file, 'size', { value: MAX_FILE_BYTES + 1 })
    await assert.rejects(validateExtractRequest([file]), /larger than 25 MB/)
  })

  it('rejects a file that does not start with %PDF', async () => {
    const notes = new File(['hello'], 'notes.txt')
    await assert.rejects(validateExtractRequest([notes]), /is not a PDF/)
  })

  it('accepts one valid PDF', async () => {
    await validateExtractRequest([pdf('student.pdf')])
  })
})

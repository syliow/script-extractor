import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_FILE_BYTES } from '../constant/limits.ts'
import { validateExtractRequest } from './validate.ts'

const questions = JSON.stringify(['Q1. Write about a friend.'])

function pdf(name: string): File {
  return new File(['%PDF-1.4\n'], name, { type: 'application/pdf' })
}

describe('validateExtractRequest', () => {
  it('rejects a request with no files', async () => {
    await assert.rejects(validateExtractRequest([], questions), /At least one PDF is required/)
  })

  it('rejects more than 10 files', async () => {
    const files = Array.from({ length: 11 }, (_, index) => pdf(`student_${index}.pdf`))
    await assert.rejects(validateExtractRequest(files, questions), /At most 10 PDFs are allowed/)
  })

  it('rejects a file larger than 25 MB', async () => {
    const file = pdf('big.pdf')
    Object.defineProperty(file, 'size', { value: MAX_FILE_BYTES + 1 })
    await assert.rejects(validateExtractRequest([file], questions), /25 MB or smaller/)
  })

  it('rejects a file that is not a PDF', async () => {
    await assert.rejects(
      validateExtractRequest([new File(['hello'], 'notes.txt')], questions),
      /Only PDF files are allowed/,
    )
  })

  it('rejects duplicate filenames', async () => {
    await assert.rejects(validateExtractRequest([pdf('same.pdf'), pdf('same.pdf')], questions), /Filenames must be unique/)
  })

  it('rejects missing or invalid questions', async () => {
    const files = [pdf('student.pdf')]
    await assert.rejects(validateExtractRequest(files, null), /JSON array of strings/)
    await assert.rejects(validateExtractRequest(files, ''), /JSON array of strings/)
    await assert.rejects(validateExtractRequest(files, '[]'), /JSON array of strings/)
    await assert.rejects(validateExtractRequest(files, '{'), /JSON array of strings/)
    await assert.rejects(validateExtractRequest(files, '[1]'), /JSON array of strings/)
  })

  it('returns the question strings for a valid PDF', async () => {
    const result = await validateExtractRequest([pdf('student.pdf')], questions)
    assert.deepEqual(result, ['Q1. Write about a friend.'])
  })
})

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_FILE_BYTES } from '../constant/limits.ts'
import { validateExtractRequest } from './validate.ts'

const questions = JSON.stringify(['Q1. Write about a friend.'])

function pdf(name: string, contents = '%PDF-1.4\n'): File {
  return new File([contents], name, { type: 'application/pdf' })
}

describe('validateExtractRequest', () => {
  it('rejects a request with no files', async () => {
    const result = await validateExtractRequest([], questions)
    assert.deepEqual(result, { ok: false, error: 'At least one PDF is required.' })
  })

  it('rejects more than 10 files', async () => {
    const files = Array.from({ length: 11 }, (_, index) => pdf(`student_${index}.pdf`))
    const result = await validateExtractRequest(files, questions)
    assert.deepEqual(result, { ok: false, error: 'At most 10 PDFs are allowed.' })
  })

  it('rejects a file larger than 25 MB', async () => {
    const file = pdf('big.pdf')
    Object.defineProperty(file, 'size', { value: MAX_FILE_BYTES + 1 })
    const result = await validateExtractRequest([file], questions)
    assert.deepEqual(result, { ok: false, error: 'Each PDF must be 25 MB or smaller.' })
  })

  it('rejects a file that is not a PDF', async () => {
    const result = await validateExtractRequest([new File(['hello'], 'notes.txt')], questions)
    assert.deepEqual(result, { ok: false, error: 'Only PDF files are allowed.' })
  })

  it('rejects duplicate filenames', async () => {
    const result = await validateExtractRequest([pdf('same.pdf'), pdf('same.pdf')], questions)
    assert.deepEqual(result, { ok: false, error: 'Filenames must be unique.' })
  })

  it('rejects missing, empty, and invalid questions', async () => {
    const files = [pdf('student.pdf')]
    assert.equal((await validateExtractRequest(files, null)).ok, false)
    assert.equal((await validateExtractRequest(files, '')).ok, false)
    assert.equal((await validateExtractRequest(files, '[]')).ok, false)
    assert.equal((await validateExtractRequest(files, '{')).ok, false)
    assert.equal((await validateExtractRequest(files, '[1]')).ok, false)
  })

  it('returns the question strings for a valid PDF', async () => {
    const result = await validateExtractRequest([pdf('student.pdf')], questions)
    assert.deepEqual(result, {
      ok: true,
      questions: ['Q1. Write about a friend.'],
    })
  })
})

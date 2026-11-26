import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { MAX_FILE_BYTES } from '../constant/limits.ts'
import { validateExtractRequest } from './validate.ts'

const questions = JSON.stringify(['Q1. Write about a friend.'])

function pdf(name: string): File {
  return new File(['%PDF-1.4\n'], name, { type: 'application/pdf' })
}

describe('validateExtractRequest', () => {
  it('asks for a PDF when none was uploaded', async () => {
    await assert.rejects(validateExtractRequest([], questions), /Upload at least one PDF/)
  })

  it('stops at 10 PDFs', async () => {
    const files = Array.from({ length: 11 }, (_, index) => pdf(`student_${index}.pdf`))
    await assert.rejects(validateExtractRequest(files, questions), /at most 10 PDFs/)
  })

  it('stops a file over 25 MB', async () => {
    const file = pdf('big.pdf')
    Object.defineProperty(file, 'size', { value: MAX_FILE_BYTES + 1 })
    await assert.rejects(validateExtractRequest([file], questions), /larger than 25 MB/)
  })

  it('stops a file that is not a PDF', async () => {
    const notes = new File(['hello'], 'notes.txt')
    await assert.rejects(validateExtractRequest([notes], questions), /is not a PDF/)
  })

  it('stops two files with the same name', async () => {
    await assert.rejects(validateExtractRequest([pdf('same.pdf'), pdf('same.pdf')], questions), /own filename/)
  })

  it('stops a missing or unusable question list', async () => {
    const files = [pdf('student.pdf')]
    await assert.rejects(validateExtractRequest(files, null), /at least one question/)
    await assert.rejects(validateExtractRequest(files, ''), /at least one question/)
    await assert.rejects(validateExtractRequest(files, '[]'), /list of strings/)
    await assert.rejects(validateExtractRequest(files, '{'), /list of strings/)
    await assert.rejects(validateExtractRequest(files, '[1]'), /list of strings/)
  })

  it('returns the questions when the upload is valid', async () => {
    const result = await validateExtractRequest([pdf('student.pdf')], questions)
    assert.deepEqual(result, ['Q1. Write about a friend.'])
  })
})

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { extractScripts, mapAnswers } from './mapResponse.ts'

const questions = ['Q1. Write about a friend.', 'Q2. What do you value?']

describe('mapAnswers', () => {
  it('copies the request question and keeps a missing answer null', () => {
    const answers = mapAnswers(questions, [{ index: 0, response: 'I value loyalty.' }])
    assert.deepEqual(answers, [
      { question: 'Q1. Write about a friend.', response: 'I value loyalty.' },
      { question: 'Q2. What do you value?', response: null },
    ])
  })
})

describe('extractScripts', () => {
  it('keeps a successful file when another file throws', async () => {
    const results = await extractScripts(
      [{ filename: 'good.pdf' }, { filename: 'bad.pdf' }],
      questions,
      async (file) => {
        if (file.filename === 'bad.pdf') {
          throw new Error('unreadable')
        }
        return [{ index: 1, response: 'Kindness.' }]
      },
    )

    assert.deepEqual(results, [
      {
        filename: 'good.pdf',
        responses: [
          { question: 'Q1. Write about a friend.', response: null },
          { question: 'Q2. What do you value?', response: 'Kindness.' },
        ],
      },
      {
        filename: 'bad.pdf',
        error: 'unreadable',
        responses: [
          { question: 'Q1. Write about a friend.', response: null },
          { question: 'Q2. What do you value?', response: null },
        ],
      },
    ])
  })
})

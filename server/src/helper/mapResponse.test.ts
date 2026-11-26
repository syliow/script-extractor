import assert from 'node:assert/strict'
import { it } from 'node:test'
import { mapAnswers } from './mapResponse.ts'

it('keeps the original question and uses null when that question was not answered', () => {
  const answers = mapAnswers(
    ['Q1. Write about a friend.', 'Q2. What do you value?'],
    [{ index: 0, response: 'I value loyalty.' }],
  )

  assert.deepEqual(answers, [
    { question: 'Q1. Write about a friend.', response: 'I value loyalty.' },
    { question: 'Q2. What do you value?', response: null },
  ])
})

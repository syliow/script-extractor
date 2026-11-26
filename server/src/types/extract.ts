import * as z from 'zod'

export interface Answer {
  question: string
  response: string | null
}

export interface ScriptResult {
  filename: string
  responses: Answer[]
  error?: string
}

export interface ExtractResponse {
  results: ScriptResult[]
}

export const SYSTEM_PROMPT = 'Transcribe this handwritten student script.'

export const ANSWER_SCHEMA: Parameters<typeof z.fromJSONSchema>[0] = {
  type: 'object',
  properties: {
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string', minLength: 1 },
          response: { type: ['string', 'null'] },
        },
        required: ['question'],
      },
    },
  },
  required: ['answers'],
}

export const answerSchema = z.fromJSONSchema(ANSWER_SCHEMA)

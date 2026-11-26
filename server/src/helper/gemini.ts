import { GoogleGenAI } from '@google/genai'
import { ERRORS } from '../constant/errors.ts'
import { API_VERSION, MEDIA_RESOLUTION, MODEL, THINKING_LEVEL } from '../constant/limits.ts'
import { ANSWER_SCHEMA, SYSTEM_PROMPT, answerSchema, type Answer } from '../types/extract.ts'

const ai = new GoogleGenAI({ apiVersion: API_VERSION })

export async function transcribePdf(bytes: Buffer): Promise<Answer[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(ERRORS.MISSING_API_KEY)
  }

  let interaction
  try {
    interaction = await ai.interactions.create({
      model: MODEL,
      system_instruction: SYSTEM_PROMPT,
      input: [
        { type: 'text', text: 'Transcribe this handwritten script.' },
        {
          type: 'document',
          data: bytes.toString('base64'),
          mime_type: 'application/pdf',
          resolution: MEDIA_RESOLUTION,
        },
      ],
      generation_config: {
        thinking_level: THINKING_LEVEL,
      },
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        // Structured output: the model returns JSON, then Zod checks it against this schema.
        // https://aistudio.google.com/docs/get-started?codelanguage=javascript#7-use-structured-output
        schema: ANSWER_SCHEMA,
      },
    })
  } catch (error) {
    // The client already retries 429 and 503. This is the message after those retries.
    if (!(error instanceof Error)) {
      throw new Error(ERRORS.MODEL)
    }
    throw new Error(modelError(error))
  }

  if (!interaction.output_text) {
    throw new Error(ERRORS.MODEL_OUTPUT)
  }

  const parsed = answerSchema.parse(JSON.parse(interaction.output_text)) as {
    answers: Answer[]
  }

  return parsed.answers.map((answer) => ({
    question: answer.question,
    response: answer.response ? answer.response : null,
  }))
}

function modelError(error: Error): string {
  if (!('status' in error) || typeof error.status !== 'number') {
    return ERRORS.MODEL
  }
  if (error.status === 429) {
    return ERRORS.RATE_LIMITED
  }
  if (error.status >= 500) {
    return ERRORS.UNAVAILABLE
  }
  return ERRORS.MODEL
}

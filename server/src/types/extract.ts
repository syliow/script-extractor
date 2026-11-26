export interface Answer {
  question: string | null
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

import express from 'express'
import { buffer } from 'node:stream/consumers'
import { ERRORS } from './constant/errors.ts'
import { transcribePdf } from './helper/gemini.ts'
import { validateExtractRequest } from './helper/validate.ts'
import type { ExtractResponse, ScriptResult } from './types/extract.ts'

const app = express()
const port = Number(process.env.PORT) || 3000

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// The page posts PDFs here. Each checked PDF is sent to the model.
app.post('/extract', async (req, res) => {
  try {
    const contentType = req.headers['content-type']
    if (typeof contentType !== 'string' || !contentType.includes('multipart/form-data')) {
      throw new Error(ERRORS.MULTIPART)
    }

    const upload = await buffer(req)
    const form = await new Response(new Blob([upload]), {
      headers: { 'content-type': contentType },
    }).formData()

    const files: File[] = []
    for (const part of form.getAll('files')) {
      if (part instanceof File) {
        files.push(part)
      }
    }

    await validateExtractRequest(files)

    const results: ScriptResult[] = await Promise.all(files.map(async (file) => {
      try {
        const bytes = Buffer.from(await file.arrayBuffer())
        const responses = await transcribePdf(bytes)
        return { filename: file.name, responses }
      } catch (error) {
        const message = error instanceof Error ? error.message : ERRORS.MODEL
        return { filename: file.name, responses: [], error: message }
      }
    }))

    const body: ExtractResponse = { results }
    res.json(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : ERRORS.UNREADABLE
    res.status(400).json({ error: message })
  }
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})

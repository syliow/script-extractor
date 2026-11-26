import express from 'express'
import { buffer } from 'node:stream/consumers'
import { ERRORS } from './constant/errors.ts'
import { validateExtractRequest } from './helper/validate.ts'

const app = express()
const port = Number(process.env.PORT) || 3000

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// The page posts PDFs here. This handler only checks the upload.
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

    res.json({
      results: files.map((file) => ({
        filename: file.name,
        responses: [],
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ERRORS.UNREADABLE
    res.status(400).json({ error: message })
  }
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})

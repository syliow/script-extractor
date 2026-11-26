# script-extractor

Extracts text from a handwritten exam PDF and returns the student's answer as written, in the original format.

## Technologies

- Node.js 22
- TypeScript
- Express
- React
- Vite
- Gemini (`gemini-3.5-flash-lite`)
- Zod

## Endpoint

`POST /extract` accepts `multipart/form-data`. The file field name is `files`.

A bad upload returns `400` and `{ "error": "..." }` when:

- the body is not multipart form data
- no PDF is uploaded
- more than 10 PDFs are uploaded
- two files share a filename
- a file is larger than 25 MB
- an uploaded file is not a PDF
- the body cannot be read

A valid upload returns `200`:

```json
{
  "results": [
    {
      "filename": "ocr-assessment-sample.pdf",
      "responses": [
        {
          "question": "QN 2 : ...",
          "response": "..."
        }
      ]
    }
  ]
}
```

If Gemini is under load, the request can fail. Wait a while and try again.

## What is included

- `server/` checks the upload and calls Gemini
- `client/` is the page for choosing PDFs and reading the result
- `sample/ocr-assessment-sample.pdf` is a scanned exam script

## Features

The transcription follows the handwriting:

- spelling, grammar and punctuation stay as written
- crossed-out words are wrapped in `<strikethrough>...</strikethrough>`
- words inserted with a caret are wrapped in `<caret>...</caret>`
- a new paragraph is a blank line (`\n\n`)

Added basic UI:

- Upload files (PDF)
- Display the response returned from the LLM API

## Setup

1. Copy `server/.env.example` to `server/.env` and set `GEMINI_API_KEY`.
2. In `server/`, run `npm install`, then `npm start`. The API listens on port 3000.
3. In another terminal, in `client/`, run `npm install`, then `npm run dev`.
4. Open http://localhost:5173.

import { useState } from 'react'
import { ERRORS } from '../constant/errors.ts'
import { extractPdfs } from '../helper/extract.ts'
import type { ScriptResult } from '../types/extract.ts'
import { Message } from './Message.tsx'
import { ResultList } from './ResultList.tsx'
import { UploadForm } from './UploadForm.tsx'

export function App() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState<ScriptResult[]>([])
  const [busy, setBusy] = useState(false)

  async function onFiles(files: FileList) {
    setBusy(true)
    setMessage('')
    setResults([])
    try {
      const data = await extractPdfs(files)
      setResults(data.results)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : ERRORS.REQUEST_FAILED)
    } finally {
      setBusy(false)
    }
  }

  function clearResults() {
    setMessage('')
    setResults([])
  }

  const hasResults = results.length > 0 || message !== ''

  return (
    <main>
      <h1>Script extractor</h1>
      <p>Upload handwritten exam PDFs and read the transcription.</p>
      <Message text={message} />
      <UploadForm busy={busy} onFiles={onFiles} />
      <div className="sheet-bar">
        {hasResults ? <button type="button" className="clear results-clear" onClick={clearResults} disabled={busy}>Clear results</button> : null}
      </div>
      <div className="sheet">
        <ResultList results={results} />
      </div>
    </main>
  )
}

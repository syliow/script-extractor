import { useEffect, useState } from 'react'
import type { ScriptResult } from '../types/extract.ts'

export function ResultList({ results }: { results: ScriptResult[] }) {
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const first = results.find((result) => !result.error)
    setOpen(first ? first.filename : null)
  }, [results])

  if (results.length === 0) {
    return null
  }

  const selected = results.find((result) => result.filename === open && !result.error)

  return (
    <div>
      {results.map((result) => (
        <div key={result.filename}>
          <button
            type="button"
            className={result.filename === open ? 'file-name selected' : 'file-name'}
            disabled={Boolean(result.error)}
            onClick={() => setOpen(result.filename === open ? null : result.filename)}
          >
            {result.filename}
          </button>
          {result.error ? <p className="file-error">{result.error}</p> : null}
        </div>
      ))}
      {selected ? selected.responses.map((answer) => (
        <div key={answer.question}>
          <pre className="raw">{answer.question}</pre>
          {answer.response !== null ? <pre className="raw">{answer.response}</pre> : null}
        </div>
      )) : null}
    </div>
  )
}

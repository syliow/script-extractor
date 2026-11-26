import { useState, type FormEvent, type MouseEvent } from 'react'
import { FILES_FIELD } from '../constant/upload.ts'

export function UploadForm({ busy, onFiles }: { busy: boolean, onFiles: (files: FileList) => void }) {
  const [chosen, setChosen] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem(FILES_FIELD)
    if (!(input instanceof HTMLInputElement) || !input.files) {
      return
    }
    onFiles(input.files)
  }

  function clear(event: MouseEvent<HTMLButtonElement>) {
    const input = event.currentTarget.form?.elements.namedItem(FILES_FIELD)
    if (input instanceof HTMLInputElement) {
      input.value = ''
    }
    setChosen(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="file">
        <input
          name={FILES_FIELD}
          type="file"
          accept="application/pdf"
          multiple
          required
          onChange={(event) => setChosen((event.currentTarget.files?.length ?? 0) > 0)}
        />
        <button type="button" className="clear" onClick={clear} disabled={busy || !chosen}>Clear</button>
      </div>
      <button type="submit" disabled={busy}>
        Extract
        {busy ? <span className="spin">◐</span> : null}
      </button>
    </form>
  )
}

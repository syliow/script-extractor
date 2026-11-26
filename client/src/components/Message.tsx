export function Message({ text }: { text: string }) {
  if (!text) {
    return null
  }
  return <pre className="message">{text}</pre>
}

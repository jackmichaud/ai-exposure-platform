import katex from 'katex'

interface Props {
  tex: string
  display?: boolean
  className?: string
}

export default function Equation({ tex, display = false, className = '' }: Props) {
  let html = ''
  try {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false })
  } catch {
    html = tex
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

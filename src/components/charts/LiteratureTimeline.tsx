interface Entry {
  year: number
  authors: string
  contribution: string
}

interface Props {
  data: Entry[]
}

export default function LiteratureTimeline({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.year - b.year)

  return (
    <div className="w-full py-2">
      {sorted.map((entry, i) => (
        <div key={i} className="flex gap-3 mb-4 last:mb-0">
          {/* Year */}
          <span className="w-10 shrink-0 text-right text-xs font-mono text-teal-400 pt-0.5">
            {entry.year}
          </span>

          {/* Dot + connecting line */}
          <div className="flex flex-col items-center shrink-0 w-4">
            <div className="w-2 h-2 rounded-full bg-teal-500 mt-0.5 shrink-0" />
            {i < sorted.length - 1 && (
              <div className="w-px grow bg-slate-700 mt-1" />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 pb-4 last:pb-0">
            <p className="text-xs font-semibold text-slate-200 leading-snug">{entry.authors}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{entry.contribution}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

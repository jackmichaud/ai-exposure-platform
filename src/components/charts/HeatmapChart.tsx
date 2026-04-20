import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import type { Occupation, Industry } from '../../types'
import { useContainerSize } from '../../hooks/useContainerSize'
import { scoreToColor, createColorScale } from './utils/createColorScale'
import { getTextColor, formatWage } from './utils/formatScore'

interface Props {
  data: Occupation[]
  industries: Industry[]
  onCellClick: (id: string) => void
}

interface TooltipState {
  x: number
  y: number
  occ: Occupation
  industry: Industry
}

const CELL_H = 54
const CELL_GAP = 4
const COL_HEADER_H = 44
const MOBILE_BREAKPOINT = 640

export default function HeatmapChart({ data, industries, onCellClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { width: containerWidth } = useContainerSize(containerRef)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const isFirstRender = useRef<boolean>(true)

  const colorScale = createColorScale()

  useEffect(() => {
    if (!svgRef.current || !containerWidth || containerWidth < MOBILE_BREAKPOINT) return
    if (!data.length || !industries.length) return

    const svg = d3.select(svgRef.current)
    const firstRender = isFirstRender.current

    if (firstRender) {
      // Full redraw on first render
      svg.selectAll('*').remove()
    }

    const numCols = industries.length
    const colGap = 8
    const totalGap = colGap * (numCols - 1)
    const colW = (containerWidth - totalGap) / numCols

    // Build per-industry occupation lists sorted by exposure desc
    const occsByIndustry = new Map<string, Occupation[]>()
    for (const ind of industries) {
      const occs = data
        .filter((o) => o.industryId === ind.id)
        .sort((a, b) => b.exposureScore.overall - a.exposureScore.overall)
      occsByIndustry.set(ind.id, occs)
    }

    const maxRows = Math.max(...industries.map((ind) => occsByIndustry.get(ind.id)?.length ?? 0))
    const svgHeight = COL_HEADER_H + maxRows * (CELL_H + CELL_GAP)

    svg.attr('height', svgHeight)

    if (!firstRender) {
      // Data update: transition fill colors of existing cells, rebuild if structure changed
      svg.selectAll('*').remove()
    }

    // Column headers
    industries.forEach((ind, colIdx) => {
      const x = colIdx * (colW + colGap)
      svg
        .append('text')
        .attr('x', x + colW / 2)
        .attr('y', COL_HEADER_H / 2 + 6)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94A3B8')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .text(ind.name.length > Math.floor(colW / 7) ? ind.name.slice(0, Math.floor(colW / 7) - 1) + '…' : ind.name)
    })

    // Cells
    industries.forEach((ind, colIdx) => {
      const occs = occsByIndustry.get(ind.id) ?? []
      const x = colIdx * (colW + colGap)

      occs.forEach((occ, rowIdx) => {
        const y = COL_HEADER_H + rowIdx * (CELL_H + CELL_GAP)
        const score = occ.exposureScore.overall
        const fillColor = colorScale(score)
        const txtColor = getTextColor(score)

        const maxTitleChars = Math.floor((colW - 16) / 7)
        const titleText =
          occ.title.length > maxTitleChars
            ? occ.title.slice(0, maxTitleChars - 1) + '…'
            : occ.title

        // Calculate stagger delay: capped at 400ms
        const delay = firstRender ? Math.min((colIdx * maxRows + rowIdx) * 20, 400) : 0

        const g = svg
          .append('g')
          .attr('class', 'cell')
          .style('cursor', 'pointer')
          .attr('tabindex', 0)
          .attr('role', 'button')
          .attr('aria-label', `${occ.title}, ${ind.name}, exposure score ${Math.round(score)}, ${formatWage(occ.medianWage)}`)

        const rect = g
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', colW)
          .attr('height', CELL_H)
          .attr('rx', 6)

        if (firstRender) {
          // Start invisible, then fade in with stagger
          g.style('opacity', 0)
          rect.attr('fill', fillColor)
          g.transition()
            .delay(delay)
            .duration(400)
            .ease(d3.easeCubicOut)
            .style('opacity', 1)
        } else {
          // Transition fill color on data update
          g.style('opacity', 1)
          rect
            .attr('fill', fillColor)
        }

        g.append('text')
          .attr('x', x + 8)
          .attr('y', y + 16)
          .attr('fill', txtColor)
          .attr('font-size', 11)
          .attr('font-weight', 500)
          .text(titleText)

        g.append('text')
          .attr('x', x + colW - 8)
          .attr('y', y + CELL_H - 8)
          .attr('text-anchor', 'end')
          .attr('fill', txtColor)
          .attr('font-size', 15)
          .attr('font-weight', 700)
          .attr('font-family', 'monospace')
          .text(Math.round(score).toString())

        g.on('mouseenter', (event: MouseEvent) => {
          // Dim all other cells
          svg.selectAll<SVGGElement, unknown>('g.cell').style('opacity', 0.3)
          d3.select<SVGGElement, unknown>(event.currentTarget as SVGGElement).style('opacity', 1)

          rect
            .attr('stroke', '#F1F5F9')
            .attr('stroke-width', 2)

          const containerRect = containerRef.current?.getBoundingClientRect()
          if (containerRect) {
            setTooltip({
              x: event.clientX - containerRect.left + 12,
              y: event.clientY - containerRect.top + 12,
              occ,
              industry: ind,
            })
          }
        })

        g.on('mousemove', (event: MouseEvent) => {
          const containerRect = containerRef.current?.getBoundingClientRect()
          if (containerRect) {
            setTooltip((prev) =>
              prev
                ? {
                    ...prev,
                    x: event.clientX - containerRect.left + 12,
                    y: event.clientY - containerRect.top + 12,
                  }
                : prev
            )
          }
        })

        g.on('mouseleave', () => {
          // Restore all cells
          svg.selectAll<SVGGElement, unknown>('g.cell')
            .transition()
            .duration(150)
            .style('opacity', 1)

          rect.attr('stroke', null).attr('stroke-width', null)
          setTooltip(null)
        })

        g.on('click', () => {
          onCellClick(occ.id)
        })

        // Keyboard: space/enter triggers click
        g.on('keydown', (event: KeyboardEvent) => {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            onCellClick(occ.id)
          }
        })
      })
    })

    isFirstRender.current = false
  }, [data, industries, containerWidth])

  const isMobile = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT

  return (
    <div ref={containerRef} className="relative w-full">
      {!data.length && (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          No occupations match the current filters.
        </div>
      )}

      {data.length > 0 && isMobile && (
        <div className="space-y-2">
          {data
            .slice()
            .sort((a, b) => b.exposureScore.overall - a.exposureScore.overall)
            .map((occ) => {
              const ind = industries.find((i) => i.id === occ.industryId)
              const score = occ.exposureScore.overall
              const bgColor = scoreToColor(score)
              return (
                <div
                  key={occ.id}
                  onClick={() => onCellClick(occ.id)}
                  className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-slate-700 transition-all duration-150 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">{occ.title}</p>
                    <p className="text-xs text-slate-400">{ind?.name ?? ''}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatWage(occ.medianWage)}</p>
                  </div>
                  <div
                    className="ml-3 shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                    style={{ backgroundColor: bgColor, color: getTextColor(score) }}
                  >
                    {Math.round(score)}
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {data.length > 0 && !isMobile && (
        <svg ref={svgRef} width="100%" className="block" role="img" aria-label="AI exposure heatmap by industry" />
      )}

      {/* Screen reader alternative table */}
      {data.length > 0 && !isMobile && (
        <table className="sr-only" aria-label="AI exposure data table">
          <thead>
            <tr>
              <th scope="col">Occupation</th>
              <th scope="col">Industry</th>
              <th scope="col">Exposure Score</th>
              <th scope="col">Median Wage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((occ) => {
              const ind = industries.find((i) => i.id === occ.industryId)
              return (
                <tr key={occ.id}>
                  <td>{occ.title}</td>
                  <td>{ind?.name ?? occ.industryId}</td>
                  <td>{Math.round(occ.exposureScore.overall)}</td>
                  <td>{formatWage(occ.medianWage)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {tooltip && (
        <div
          className="absolute pointer-events-none z-50"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none">
            <p className="font-semibold">{tooltip.occ.title}</p>
            <p className="text-gray-300 text-xs">{tooltip.industry.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: colorScale(tooltip.occ.exposureScore.overall) }}
              />
              <span className="font-mono">
                {Math.round(tooltip.occ.exposureScore.overall)}/100
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formatWage(tooltip.occ.medianWage)} · {tooltip.occ.educationLevel}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

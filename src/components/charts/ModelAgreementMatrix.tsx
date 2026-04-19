import { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from '../../hooks/useContainerSize'

interface Correlation {
  modelA: string
  modelB: string
  r: number
}

interface Props {
  data: Correlation[]
}

const MARGIN = { top: 48, right: 16, bottom: 16, left: 80 }

export default function ModelAgreementMatrix({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { width } = useContainerSize(containerRef)

  const models = useMemo(() => {
    const s = new Set<string>()
    data.forEach(d => { s.add(d.modelA); s.add(d.modelB) })
    return [...s]
  }, [data])

  const matrix = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach(d => {
      map.set(`${d.modelA}|${d.modelB}`, d.r)
      map.set(`${d.modelB}|${d.modelA}`, d.r)
    })
    models.forEach(m => map.set(`${m}|${m}`, 1))
    return map
  }, [data, models])

  const size = Math.min(width, 380)

  useEffect(() => {
    if (!svgRef.current || size === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = size - MARGIN.left - MARGIN.right
    const innerH = size - MARGIN.top - MARGIN.bottom
    const cellW = innerW / models.length
    const cellH = innerH / models.length

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0.5, 1])
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Cells
    models.forEach((rowModel, ri) => {
      models.forEach((colModel, ci) => {
        const r = matrix.get(`${rowModel}|${colModel}`) ?? 0
        const cell = g.append('g').attr('transform', `translate(${ci * cellW},${ri * cellH})`)
        cell.append('rect')
          .attr('width', cellW - 2).attr('height', cellH - 2)
          .attr('rx', 3)
          .attr('fill', colorScale(r))
          .attr('opacity', 0)
          .transition().duration(400).delay((ri * models.length + ci) * 30)
          .attr('opacity', 1)
        cell.append('text')
          .attr('x', cellW / 2 - 1).attr('y', cellH / 2 - 1)
          .attr('dominant-baseline', 'middle').attr('text-anchor', 'middle')
          .style('font-size', '12px').style('font-family', 'monospace')
          .style('fill', r > 0.8 ? '#fff' : '#CBD5E1')
          .text(r.toFixed(2))
      })
    })

    // Row labels
    models.forEach((m, i) => {
      g.append('text')
        .attr('x', -8).attr('y', i * cellH + cellH / 2 - 1)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .style('font-size', '11px').style('fill', '#94A3B8').text(m)
    })

    // Col labels
    models.forEach((m, i) => {
      g.append('text')
        .attr('x', i * cellW + cellW / 2 - 1).attr('y', -10)
        .attr('text-anchor', 'middle').style('font-size', '11px').style('fill', '#94A3B8').text(m)
    })

  }, [matrix, models, size])

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <svg ref={svgRef} width={size} height={size} role="img" aria-label="Pairwise correlation matrix between AI exposure indices" />
    </div>
  )
}

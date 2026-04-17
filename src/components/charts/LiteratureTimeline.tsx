import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from '../../hooks/useContainerSize'

interface Entry {
  year: number
  authors: string
  contribution: string
}

interface Props {
  data: Entry[]
}

const MARGIN = { top: 8, right: 24, bottom: 8, left: 60 }
const ROW_H = 44

export default function LiteratureTimeline({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { width } = useContainerSize(containerRef)

  const height = data.length * ROW_H + MARGIN.top + MARGIN.bottom

  useEffect(() => {
    if (!svgRef.current || width === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = width - MARGIN.left - MARGIN.right
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.year)! - 1, d3.max(data, d => d.year)! + 1])
      .range([0, innerW])

    // Axis line
    const axisY = data.length * ROW_H / 2
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', axisY).attr('y2', axisY)
      .attr('stroke', '#E5E7EB').attr('stroke-width', 1.5)

    // Entries
    data.forEach((d, i) => {
      const cx = x(d.year)
      const cy = i * ROW_H + ROW_H / 2
      const above = i % 2 === 0

      // Connector
      g.append('line')
        .attr('x1', cx).attr('x2', cx)
        .attr('y1', axisY).attr('y2', cy)
        .attr('stroke', '#D1D5DB').attr('stroke-width', 1)

      // Dot
      g.append('circle').attr('cx', cx).attr('cy', axisY).attr('r', 5)
        .attr('fill', '#4F46E5').attr('opacity', 0)
        .transition().duration(300).delay(i * 60)
        .attr('opacity', 1)

      // Year label
      g.append('text').attr('x', cx).attr('y', axisY + (above ? -10 : 12))
        .attr('text-anchor', 'middle').style('font-size', '10px').style('fill', '#9CA3AF')
        .style('font-family', 'monospace').text(d.year)

      // Authors + contribution
      const textX = Math.max(4, Math.min(cx, innerW - 4))
      g.append('text').attr('x', textX).attr('y', cy - (above ? 4 : -4) + (above ? 0 : ROW_H * 0.15))
        .attr('text-anchor', 'middle').style('font-size', '10px').style('fill', '#374151').style('font-weight', '600')
        .text(d.authors.length > 22 ? d.authors.slice(0, 20) + '…' : d.authors)

      g.append('text').attr('x', textX).attr('y', cy + (above ? 10 : 10))
        .attr('text-anchor', 'middle').style('font-size', '9px').style('fill', '#6B7280')
        .text(d.contribution.length > 38 ? d.contribution.slice(0, 36) + '…' : d.contribution)
    })

  }, [data, width])

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} width={Math.max(width, 600)} height={height} role="img" aria-label="Timeline of key AI labor market research" />
    </div>
  )
}

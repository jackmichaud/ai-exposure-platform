import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from '../../hooks/useContainerSize'

interface Bin {
  bin: string
  count: number
}

interface Props {
  data: Bin[]
}

const MARGIN = { top: 16, right: 16, bottom: 40, left: 36 }

function binColor(bin: string): string {
  const start = parseInt(bin.split('–')[0])
  if (start < 30) return '#2563EB'
  if (start < 60) return '#D97706'
  return '#DC2626'
}

export default function ExposureHistogram({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { width } = useContainerSize(containerRef)

  const height = 220

  useEffect(() => {
    if (!svgRef.current || width === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const x = d3.scaleBand().domain(data.map(d => d.bin)).range([0, innerW]).padding(0.15)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)! + 1]).range([innerH, 0])

    // Gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerW).tickFormat(() => ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', '#E5E7EB').attr('stroke-dasharray', '3,3'))

    // Bars
    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.bin)!)
      .attr('width', x.bandwidth())
      .attr('y', innerH)
      .attr('height', 0)
      .attr('rx', 2)
      .attr('fill', d => binColor(d.bin))
      .attr('opacity', 0.85)
      .transition().duration(500).ease(d3.easeCubicOut)
      .attr('y', d => y(d.count))
      .attr('height', d => innerH - y(d.count))

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', '#E5E7EB'))
      .call(g => g.selectAll('text').attr('dy', '1em').style('font-size', '11px').style('fill', '#6B7280'))

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').style('font-size', '11px').style('fill', '#6B7280'))
      .call(g => g.selectAll('line').remove())

  }, [data, width])

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="Distribution of AI exposure scores across occupations" />
    </div>
  )
}

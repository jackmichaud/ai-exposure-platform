import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from '../../hooks/useContainerSize'
import { useNavigate } from 'react-router-dom'

interface Point {
  occupation: string
  aioe: number
  wage: number
  industry: string
  employment: number
}

interface Props {
  data: Point[]
}

const MARGIN = { top: 16, right: 120, bottom: 48, left: 72 }

const INDUSTRY_COLORS: Record<string, string> = {
  Technology: '#4F46E5', Finance: '#D97706', Healthcare: '#059669',
  Legal: '#7C3AED', Business: '#6B7280', Engineering: '#0891B2',
  Trades: '#92400E', Education: '#BE185D', Media: '#DC2626',
}

export default function WageScatterPlot({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { width } = useContainerSize(containerRef)
  const navigate = useNavigate()

  const height = 320

  useEffect(() => {
    if (!svgRef.current || width === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.wage)! * 1.1]).range([innerH, 0])
    const r = d3.scaleSqrt().domain([0, d3.max(data, d => d.employment)!]).range([3, 18])

    // Gridlines
    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(() => ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', '#E5E7EB').attr('stroke-dasharray', '3,3'))

    // Regression line
    const xMean = d3.mean(data, d => d.aioe)!
    const yMean = d3.mean(data, d => d.wage)!
    const num = d3.sum(data, d => (d.aioe - xMean) * (d.wage - yMean))
    const den = d3.sum(data, d => (d.aioe - xMean) ** 2)
    const slope = num / den
    const intercept = yMean - slope * xMean
    const x1 = 10, x2 = 95
    g.append('line')
      .attr('x1', x(x1)).attr('x2', x(x2))
      .attr('y1', y(slope * x1 + intercept)).attr('y2', y(slope * x2 + intercept))
      .attr('stroke', '#6B7280').attr('stroke-width', 1.5).attr('stroke-dasharray', '6,3').attr('opacity', 0.6)

    // Dots
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.aioe))
      .attr('cy', d => y(d.wage))
      .attr('r', 0)
      .attr('fill', d => INDUSTRY_COLORS[d.industry] ?? '#6B7280')
      .attr('opacity', 0.75)
      .attr('cursor', 'pointer')
      .transition().duration(500).ease(d3.easeCubicOut)
      .attr('r', d => r(d.employment))

    // Tooltip interactions (after transition)
    const circles = g.selectAll<SVGCircleElement, Point>('circle')
    circles
      .on('mouseover', (event, d) => {
        const tooltip = tooltipRef.current
        if (!tooltip) return
        tooltip.style.display = 'block'
        tooltip.innerHTML = `<p class="font-semibold text-white text-sm">${d.occupation}</p>
          <p class="text-gray-300 text-xs">${d.industry}</p>
          <p class="text-gray-300 text-xs mt-1">AIOE: <span class="font-mono text-white">${d.aioe}</span></p>
          <p class="text-gray-300 text-xs">Wage: <span class="font-mono text-white">$${(d.wage / 1000).toFixed(0)}k</span></p>`
        d3.select(event.currentTarget).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 1.5)
      })
      .on('mousemove', (event) => {
        const tooltip = tooltipRef.current
        const rect = containerRef.current!.getBoundingClientRect()
        if (!tooltip) return
        tooltip.style.left = `${event.clientX - rect.left + 10}px`
        tooltip.style.top = `${event.clientY - rect.top - 60}px`
      })
      .on('mouseout', (event) => {
        const tooltip = tooltipRef.current
        if (tooltip) tooltip.style.display = 'none'
        d3.select(event.currentTarget).attr('opacity', 0.75).attr('stroke', 'none')
      })
      .on('click', (_event, d) => {
        navigate(`/occupation/${d.occupation.toLowerCase().replace(/\s+/g, '-')}`)
      })

    // Axes
    g.append('g').attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5))
      .call(g => g.select('.domain').attr('stroke', '#E5E7EB'))
      .call(g => g.selectAll('text').style('font-size', '11px').style('fill', '#6B7280'))

    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(v => `$${+v / 1000}k`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').style('font-size', '11px').style('fill', '#6B7280'))
      .call(g => g.selectAll('line').remove())

    // Axis labels
    g.append('text').attr('x', innerW / 2).attr('y', innerH + 38)
      .attr('text-anchor', 'middle').style('font-size', '12px').style('fill', '#6B7280')
      .text('AIOE Score (0–100)')
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -innerH / 2).attr('y', -52)
      .attr('text-anchor', 'middle').style('font-size', '12px').style('fill', '#6B7280')
      .text('Median Wage')

    // Legend
    const industries = [...new Set(data.map(d => d.industry))]
    const legend = svg.append('g').attr('transform', `translate(${width - MARGIN.right + 12},${MARGIN.top})`)
    industries.forEach((ind, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 18})`)
      row.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 0).attr('fill', INDUSTRY_COLORS[ind] ?? '#6B7280')
      row.append('text').attr('x', 14).attr('y', 4).style('font-size', '11px').style('fill', '#6B7280').text(ind)
    })

  }, [data, width, navigate])

  return (
    <div ref={containerRef} className="w-full relative">
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="Wage vs AI exposure scatter plot" />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none hidden bg-gray-900 rounded-lg px-3 py-2 shadow-lg text-sm"
        style={{ zIndex: 10 }}
      />
    </div>
  )
}

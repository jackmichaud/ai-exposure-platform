import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useContainerSize } from '../../hooks/useContainerSize'

interface Coefficient {
  variable: string
  beta: number
  se: number
  significant: boolean
  label: string
}

interface Props {
  data: Coefficient[]
}

const MARGIN = { top: 16, right: 80, bottom: 16, left: 160 }

export default function OLSCoefficientChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { width } = useContainerSize(containerRef)

  const height = data.length * 40 + MARGIN.top + MARGIN.bottom

  useEffect(() => {
    if (!svgRef.current || width === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom
    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const extent = d3.max(data, d => Math.abs(d.beta) + d.se * 1.96)! * 1.2
    const x = d3.scaleLinear().domain([-extent, extent]).range([0, innerW])
    const y = d3.scaleBand().domain(data.map(d => d.label)).range([0, innerH]).padding(0.4)

    // Zero line
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#475569').attr('stroke-width', 1)

    data.forEach(d => {
      const cy = y(d.label)! + y.bandwidth() / 2
      const ci = d.se * 1.96
      const color = d.significant ? (d.beta > 0 ? '#059669' : '#DC2626') : '#9CA3AF'

      // CI whiskers
      g.append('line')
        .attr('x1', x(d.beta - ci)).attr('x2', x(d.beta + ci))
        .attr('y1', cy).attr('y2', cy)
        .attr('stroke', color).attr('stroke-width', 1.5).attr('opacity', 0.5)

      // Dot
      g.append('circle').attr('cx', x(0)).attr('cy', cy).attr('r', 6)
        .attr('fill', color)
        .transition().duration(400).ease(d3.easeCubicOut)
        .attr('cx', x(d.beta))

      // Beta label
      g.append('text')
        .attr('x', x(d.beta + ci) + 6).attr('y', cy + 4)
        .style('font-size', '11px').style('font-family', 'monospace').style('fill', color)
        .text(`${d.beta > 0 ? '+' : ''}${d.beta}${d.significant ? '*' : ''}`)
    })

    // Y axis labels
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').style('font-size', '12px').style('fill', '#CBD5E1'))

    // X axis
    g.append('g').attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(v => `${+v > 0 ? '+' : ''}${v}`))
      .call(g => g.select('.domain').attr('stroke', '#334155'))
      .call(g => g.selectAll('text').style('font-size', '10px').style('fill', '#64748B'))

  }, [data, width, height])

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="OLS regression coefficients for wage model" />
      <p className="text-xs text-slate-500 mt-1">* p &lt; 0.05 · Error bars show 95% CI · Outcome: log(median wage)</p>
    </div>
  )
}

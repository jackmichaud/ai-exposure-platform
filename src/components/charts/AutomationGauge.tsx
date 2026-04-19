import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { scoreToColor } from './utils/createColorScale'

interface Props {
  score: number
  label: string
}

const R_OUTER = 80
const R_INNER = 55
const CX = 100
const CY = 100
const GAUGE_START = -Math.PI / 2
const GAUGE_END = Math.PI / 2

function scoreToAngle(score: number): number {
  return GAUGE_START + (score / 100) * Math.PI
}

function buildArc(startAngle: number, endAngle: number): string {
  const arc = d3
    .arc<null>()
    .innerRadius(R_INNER)
    .outerRadius(R_OUTER)
    .startAngle(startAngle)
    .endAngle(endAngle)
  return arc(null) ?? ''
}

export default function AutomationGauge({ score, label }: Props) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const scoreAngle = scoreToAngle(clampedScore)
  const fillColor = scoreToColor(clampedScore)

  // Background zone arcs
  const greenStart = GAUGE_START
  const greenEnd = scoreToAngle(30)
  const amberStart = greenEnd
  const amberEnd = scoreToAngle(60)
  const redStart = amberEnd
  const redEnd = GAUGE_END

  const greenPath = buildArc(greenStart, greenEnd)
  const amberPath = buildArc(amberStart, amberEnd)
  const redPath = buildArc(redStart, redEnd)

  // Value arc from 0 (left) to score
  const valuePath = buildArc(GAUGE_START, scoreAngle)

  // Needle ref for D3 animation
  const needleRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    if (!needleRef.current) return

    const angle = scoreToAngle(clampedScore)
    const len = R_INNER - 10

    d3.select(needleRef.current)
      .attr('x1', CX)
      .attr('y1', CY)
      .attr('x2', CX)
      .attr('y2', CY - len) // start pointing straight up (score ~50)
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut)
      .attr('x2', CX + len * Math.sin(angle))
      .attr('y2', CY - len * Math.cos(angle))
  }, [clampedScore])

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto">
      {/* Background zones */}
      <path d={greenPath} fill="#059669" fillOpacity={0.25} transform={`translate(${CX},${CY})`} />
      <path d={amberPath} fill="#D97706" fillOpacity={0.25} transform={`translate(${CX},${CY})`} />
      <path d={redPath} fill="#DC2626" fillOpacity={0.25} transform={`translate(${CX},${CY})`} />

      {/* Value arc */}
      <path d={valuePath} fill={fillColor} transform={`translate(${CX},${CY})`} />

      {/* Needle — animated via useRef */}
      <line
        ref={needleRef}
        x1={CX}
        y1={CY}
        x2={CX}
        y2={CY - (R_INNER - 10)}
        stroke="#F1F5F9"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={5} fill="#F1F5F9" />

      {/* Score text */}
      <text
        x={CX}
        y={95}
        textAnchor="middle"
        fontSize={32}
        fontWeight={700}
        fill="white"
        fontFamily="monospace"
      >
        {Math.round(clampedScore)}
      </text>

      {/* Label */}
      <text
        x={CX}
        y={115}
        textAnchor="middle"
        fontSize={11}
        fill="#94A3B8"
      >
        {label}
      </text>
    </svg>
  )
}

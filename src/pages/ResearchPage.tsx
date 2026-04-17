import { useState } from 'react'
import findings from '../data/research-findings.json'
import ExposureHistogram from '../components/charts/ExposureHistogram'
import WageScatterPlot from '../components/charts/WageScatterPlot'
import ModelAgreementMatrix from '../components/charts/ModelAgreementMatrix'
import OLSCoefficientChart from '../components/charts/OLSCoefficientChart'
import LiteratureTimeline from '../components/charts/LiteratureTimeline'
import Equation from '../components/Equation'

const EQUATIONS = [
  {
    label: 'Acemoglu-Restrepo Net Wage Effect',
    tex: '\\Delta w = \\underbrace{-\\frac{\\partial Y}{\\partial L}\\cdot\\Delta T_{\\text{auto}}}_{\\text{displacement}} + \\underbrace{\\frac{\\partial Y}{\\partial L_{\\text{new}}}}_{\\text{reinstatement}}',
    note: 'Net wage impact depends on the balance between displacement and reinstatement forces.',
  },
  {
    label: 'Routine Task Intensity (Autor, Levy & Murnane)',
    tex: '\\text{RTI}_k = \\ln(T_{R,k}) - \\ln(T_{NR,k})',
    note: 'High RTI predicts susceptibility to automation. Clerical and data-entry roles score highest.',
  },
  {
    label: 'AIOE — Felten, Raj & Seamans',
    tex: '\\text{AIOE}_o = \\sum_{a} w_{o,a} \\cdot \\text{AIOE}_a',
    note: 'Ability-weighted exposure index. Measures total AI relevance — augmentation and automation alike.',
  },
  {
    label: 'Agentic Task Exposure — Gupta & Kumar',
    tex: '\\text{ATE}_o = \\sum_t w_{o,t}\\cdot\\text{CAP}(t)\\cdot\\text{COV}(t,o)\\cdot V(t,r,\\tau)',
    note: 'COV penalises tasks requiring physical presence or regulatory accountability — limits agentic completion.',
  },
]

interface ReportSection {
  title: string
  content: string
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    title: 'Introduction',
    content: `The deployment of large language models (LLMs) since 2022 represents a qualitative break from prior automation waves. Unlike industrial robotics — which primarily displaced routine manual labor — generative AI targets cognitive, linguistic, and analytical tasks historically considered immune to automation. Frey & Osborne (2017) estimated 47% of U.S. occupations at high computerization risk, but their bottleneck framework predated LLMs. Eloundou et al. (2023) subsequently found that roughly 80% of U.S. workers have at least 10% of their tasks exposed to GPT-class assistance, with 19% exposed on more than half their tasks — a dramatic upward revision concentrated in white-collar work. Despite high theoretical exposure, aggregate labor market data through 2025 shows limited disruption. This gap between measured exposure and observed outcomes is the central research puzzle.`,
  },
  {
    title: 'Theoretical Frameworks',
    content: `Acemoglu & Restrepo (2022) provide the theoretical backbone via a task-based production framework. AI's net wage effect decomposes into two opposing forces: displacement (AI automates existing tasks, reducing labor demand) and reinstatement (AI creates new tasks where humans hold comparative advantage). The outcome is empirically indeterminate, motivating the empirical approach below.\n\nAutor, Levy & Murnane (2003) established the foundational routinization hypothesis. Routine task intensity (RTI) predicts susceptibility: high-RTI occupations (clerks, bookkeepers, data entry) are most vulnerable.\n\nFrey & Osborne (2017) scored 702 occupations on a P(automatable) ∈ [0,1] via a machine learning classifier trained on three engineering bottlenecks: perception/manipulation, creative intelligence, and social intelligence.\n\nFelten, Raj & Seamans (2023) introduced the AIOE index linking AI capability benchmarks to O*NET ability requirements. Eloundou et al. (2023) apply a three-tier rubric at the task level (E0/E1/E2). Webb (2020) measures AI exposure via patent-task text similarity. More recently, Gupta & Kumar (2026) extend the A-R framework to autonomous AI agents (ATE); Massenkoff & McCrory (2026) introduce Observed Exposure grounded in actual Claude usage data; and Korinek & Suh (2023) model macro wage trajectories under Tool AI, Weak AGI, and Strong AGI scenarios.`,
  },
  {
    title: 'Empirical Strategy',
    content: `Data: O*NET 28.0 (task descriptions, ability weights), BLS OES 2023 (median wage, employment by SOC), Felten et al. AIOE dataset (SSRN replication files), Frey-Osborne dataset (Oxford Martin School), and Massenkoff & McCrory (2026) Observed Exposure scores.\n\nMethod: (1) Compile five exposure scores per occupation; (2) compute pairwise Pearson correlations — indices correlate at r = 0.7–0.9 overall but diverge for high-exposure cognitive roles; (3) merge with BLS wage/employment data; (4) estimate OLS: ln(wage) = α + β₁·AIOE + β₂·RTI + β₃·ATE + δ·X + ε, where X includes education requirement and sector fixed effects; (5) test skill-tier heterogeneity by interacting exposure with low/mid/high skill tier dummies.`,
  },
  {
    title: 'Key Findings',
    content: `H1 confirmed: High-wage cognitive occupations (software engineers, lawyers, analysts) score in the top quartile of AIOE and Observed Exposure.\n\nH2 confirmed: Middle-skill routine cognitive roles (data entry clerks, bookkeepers, customer service) show highest RTI and ATE, placing them displacement-dominant.\n\nH3 confirmed: OLS β̂₁ = +0.31 (p < 0.05) — exposure positively correlated with current wages, consistent with augmentation-dominant composition of the sample. RTI coefficient β̂₂ = −0.18 (p < 0.05) — routine intensity associated with lower wages.\n\nH5 (null) partially confirmed: No economy-wide wage collapse observed. Consistent with Humlum & Vestergaard (2025) Danish admin data finding zero earnings effect through 2024. Theoretical exposure leads realized disruption by multiple years.`,
  },
  {
    title: 'Limitations',
    content: `Exposure measures technical feasibility, not actual adoption speed or displacement magnitude. Cross-sectional analysis cannot establish causation; IV strategy left for future work. Indices disagree most on high-exposure occupations (Budget Lab, 2025) — exactly where precision matters most. All exposure indices are point-in-time snapshots; the Massenkoff & McCrory Observed Exposure index is uniquely dynamic but covers only Claude-mediated work. Geographic and firm-size variation in AI adoption is not captured in the occupation-level analysis.`,
  },
  {
    title: 'References',
    content: `Acemoglu, D. & Restrepo, P. (2022). Tasks, automation, and the rise in U.S. wage inequality. Econometrica, 90(5), 1973–2016.\n\nAutor, D., Levy, F., & Murnane, R. (2003). The skill content of recent technological change. QJE, 118(4), 1279–1333.\n\nBudget Lab at Yale. (2025). Labor market AI exposure: What do we know?\n\nChopra, A. et al. (2025). The Iceberg Index. arXiv:2510.25137.\n\nEloundou, T. et al. (2023). GPTs are GPTs. arXiv:2303.10130.\n\nFelten, E., Raj, M., & Seamans, R. (2023). Occupational heterogeneity in exposure to generative AI. SSRN:4414065.\n\nFrey, C.B. & Osborne, M.A. (2017). The future of employment. Technological Forecasting and Social Change, 114, 254–280.\n\nGupta, R. & Kumar, S. (2026). Agentic AI and occupational displacement. arXiv:2604.00186.\n\nHumlum, A. & Vestergaard, E. (2025). Large language models, small labor market effects. NBER WP 33777.\n\nKorinek, A. & Suh, D. (2023). Scenarios for the transition to AGI. NBER WP 32255.\n\nMarguerit, D. (2025). Augmenting or automating labor? arXiv:2503.19159.\n\nMassenkoff, M. & McCrory, P. (2026). Labor market impacts of AI. Anthropic Economic Index.\n\nWebb, M. (2020). The impact of artificial intelligence on the labor market. Stanford Working Paper.`,
  },
]

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-gray-900">{children}</h2>
}

export default function ResearchPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      {/* Page header */}
      <div>
        <h1 className="mb-2 text-gray-900">Economic Research</h1>
        <p className="text-gray-500 text-sm max-w-2xl">
          Empirical foundations of the AI Exposure Platform — cross-validated exposure indices, wage regression results, and the academic literature behind every score.
        </p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Occupations Analyzed', value: findings.meta.totalOccupations },
          { label: 'Avg AIOE Score', value: `${findings.meta.avgAIOE}/100` },
          { label: 'Displacement-Dominant', value: `${findings.meta.pctDisplacementDominant}%` },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center">
            <p className="text-3xl font-bold text-indigo-600 font-mono">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Section 1: Visual overview */}
      <section>
        <SectionHeader>Exposure Distribution</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="mb-1 text-gray-700">AIOE Score Distribution</h3>
            <p className="text-xs text-gray-400 mb-4">Count of occupations by exposure score bin</p>
            <ExposureHistogram data={findings.exposureDistribution} />
          </Card>
          <Card>
            <h3 className="mb-1 text-gray-700">Model Index Agreement</h3>
            <p className="text-xs text-gray-400 mb-4">Pairwise Pearson r — indices agree on low-exposure, diverge on high</p>
            <ModelAgreementMatrix data={findings.modelCorrelations} />
          </Card>
        </div>
      </section>

      {/* Wage scatter */}
      <section>
        <Card>
          <h3 className="mb-1 text-gray-700">Wage × AI Exposure</h3>
          <p className="text-xs text-gray-400 mb-4">
            Median wage vs. AIOE score · circle size = employment · dashed line = OLS fit · click a point to view occupation profile
          </p>
          <WageScatterPlot data={findings.wageScatter} />
        </Card>
      </section>

      {/* OLS results */}
      <section>
        <SectionHeader>Regression Results</SectionHeader>
        <Card>
          <h3 className="mb-1 text-gray-700">OLS Coefficients</h3>
          <p className="text-xs text-gray-400 mb-2">Outcome: log(median wage) · n={findings.olsResults.n} · R²={findings.olsResults.rSquared}</p>
          <div className="mb-4 p-3 bg-gray-50 rounded-md overflow-x-auto">
            <Equation tex={findings.olsResults.equation} display={false} className="text-sm" />
          </div>
          <OLSCoefficientChart data={findings.olsResults.coefficients} />
        </Card>
      </section>

      {/* Key equations */}
      <section>
        <SectionHeader>Key Equations</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {EQUATIONS.map(eq => (
            <Card key={eq.label}>
              <h3 className="text-gray-700 mb-3">{eq.label}</h3>
              <div className="overflow-x-auto py-2 flex justify-center">
                <Equation tex={eq.tex} display className="text-base" />
              </div>
              <p className="text-xs text-gray-400 mt-3">{eq.note}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Literature timeline */}
      <section>
        <SectionHeader>Literature Timeline</SectionHeader>
        <Card>
          <p className="text-xs text-gray-400 mb-4">Key papers from 2003–2026</p>
          <LiteratureTimeline data={findings.literatureTimeline} />
        </Card>
      </section>

      {/* Full report accordion */}
      <section>
        <SectionHeader>Full Research Report</SectionHeader>
        <div className="space-y-2">
          {REPORT_SECTIONS.map(section => (
            <div key={section.title} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <h3 className="text-gray-800">{section.title}</h3>
                <span className="text-gray-400 text-lg">{openSection === section.title ? '−' : '+'}</span>
              </button>
              {openSection === section.title && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {section.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed mt-3">{para}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

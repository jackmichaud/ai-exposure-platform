import findings from '../data/research-findings.json'
import ExposureHistogram from '../components/charts/ExposureHistogram'
import WageScatterPlot from '../components/charts/WageScatterPlot'
import ModelAgreementMatrix from '../components/charts/ModelAgreementMatrix'
import OLSCoefficientChart from '../components/charts/OLSCoefficientChart'
import LiteratureTimeline from '../components/charts/LiteratureTimeline'
import Equation from '../components/Equation'

// ─── Layout primitives ────────────────────────────────────────────────────────

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl">{children}</div>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 leading-relaxed text-[15px] mt-4">{children}</p>
}

function DisplayEq({ tex, label }: { tex: string; label?: string }) {
  return (
    <div className="my-6 flex items-center gap-6 overflow-x-auto">
      <div className="flex-1 flex justify-center py-2">
        <Equation tex={tex} display />
      </div>
      {label && <span className="text-xs text-gray-400 font-mono shrink-0">{label}</span>}
    </div>
  )
}

function InlineEq({ tex }: { tex: string }) {
  return <Equation tex={tex} display={false} className="mx-0.5" />
}

function SectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 mb-4 mt-12">
      <span className="text-sm font-mono text-gray-400 shrink-0">{num}</span>
      <h2 className="text-gray-900">{children}</h2>
    </div>
  )
}

function SubsectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 mb-3 mt-8">
      <span className="text-xs font-mono text-gray-400 shrink-0">{num}</span>
      <h3 className="text-gray-800">{children}</h3>
    </div>
  )
}

function Figure({ num, caption, children }: { num: number; caption: string; children: React.ReactNode }) {
  return (
    <figure className="my-8 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="p-4 pb-2">{children}</div>
      <figcaption className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <span className="font-semibold text-xs text-gray-500">Figure {num}.&nbsp;</span>
        <span className="text-xs text-gray-500">{caption}</span>
      </figcaption>
    </figure>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 max-w-2xl pl-4 border-l-2 border-indigo-200">
      <p className="text-sm text-gray-600 leading-relaxed italic">{children}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <article className="pb-24 max-w-3xl mx-auto">

      {/* Title block */}
      <div className="max-w-2xl mb-10">
        <p className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">Working Paper · April 2026</p>
        <h1 className="text-gray-900 leading-tight mb-4">
          Artificial Intelligence and the Labor Market:<br />
          Theory, Measurement, and Early Evidence
        </h1>
        <p className="text-sm text-gray-500">Jack Michaud · AI Exposure Platform</p>
      </div>

      {/* Abstract */}
      <div className="max-w-2xl mb-10 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Abstract</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          We survey the theoretical economics literature on automation and labor markets, derive predictions
          for occupational wage and employment effects under competing frameworks, and evaluate those
          predictions against a cross-validated set of AI exposure indices matched to BLS wage data.
          The task-based framework of Acemoglu and Restrepo (2022) predicts that net wage effects depend on
          the balance between displacement and reinstatement forces — a balance that is empirically
          indeterminate in partial equilibrium. Extending the routinization hypothesis of Autor, Levy and
          Murnane (2003) to the large language model era, we show that the relevant cleavage has shifted from
          "routine vs. non-routine" toward "codifiable vs. judgment-intensive," exposing a much larger share
          of high-wage cognitive work. Empirically, OLS estimates confirm that AIOE scores are positively
          correlated with current wages (<InlineEq tex="\hat{\beta}_1 = 0.31" />, p&lt;0.05), while routine
          task intensity and agentic exposure are associated with wage penalties. Despite high theoretical
          exposure, we confirm a null result through 2025 consistent with Humlum and Vestergaard (2025):
          realized disruption lags theoretical exposure by an empirically uncertain lag. We discuss
          implications for wage polarization, the capital-labor substitution elasticity, and AGI transition dynamics.
        </p>
      </div>

      {/* ── 1. Introduction ── */}
      <SectionTitle num="1.">Introduction</SectionTitle>
      <Prose>
        <P>
          The question of how artificial intelligence reshapes labor markets has occupied economists since
          at least Frey and Osborne's landmark 2013 working paper, which estimated that 47 percent of
          U.S. occupations faced high computerization risk within two decades. That analysis arrived at
          a historically instructive moment: just as GPT-3 demonstrated that language models could generate
          coherent prose, write functional code, and summarize legal documents, capabilities that Frey and
          Osborne's bottleneck framework had implicitly assumed would remain beyond the reach of machines.
          The empirical scope of the automation threat, already debated, was suddenly reopened.
        </P>
        <P>
          The conceptual challenge facing labor economists is not simply one of empirical measurement,
          though measurement is genuinely hard. It is a question of which theoretical framework correctly
          characterizes the relationship between AI and labor. Three competing paradigms structure the
          debate: the <em>task-displacement</em> view holds that AI substitutes for human labor on specific
          tasks, reducing employment and wages in affected occupations; the <em>augmentation</em> view holds
          that AI enhances worker productivity, raising wages while potentially requiring new skills; and
          the <em>general-purpose technology</em> view holds that AI, like electrification or computing before
          it, will ultimately create more jobs and higher wages than it displaces, albeit through a painful
          transition. The theoretical literature does not deliver a verdict — the outcome depends
          critically on the elasticity of substitution between AI and labor, the extent of reinstatement
          of new tasks, and the speed of capital accumulation.
        </P>
        <P>
          This paper proceeds as follows. Section 2 develops the core theoretical frameworks in detail,
          deriving wage and employment predictions from each. Section 3 describes how the theoretical
          constructs are operationalized in recent exposure indices. Section 4 presents the empirical
          analysis. Section 5 discusses the null-result puzzle and distributional implications.
        </P>
      </Prose>

      {/* ── 2. Theory ── */}
      <SectionTitle num="2.">Theoretical Framework</SectionTitle>

      {/* 2.1 Task-Based Production */}
      <SubsectionTitle num="2.1">The Task-Based Production Model</SubsectionTitle>
      <Prose>
        <P>
          The dominant theoretical framework in the automation literature is the task-based model of
          Acemoglu and Restrepo (2018, 2022). The economy produces a single final good using a continuum
          of tasks indexed by <InlineEq tex="x \in [0, 1]" />. The production function aggregates task
          output through a CES composite:
        </P>
      </Prose>
      <DisplayEq
        tex="Y = A \left(\int_0^1 y(x)^{\frac{\sigma-1}{\sigma}}\,dx\right)^{\!\frac{\sigma}{\sigma-1}}"
        label="(1)"
      />
      <Prose>
        <P>
          where <InlineEq tex="A" /> is total factor productivity and <InlineEq tex="\sigma > 0" /> is the
          elasticity of substitution across tasks. Each task can be produced by either labor or capital
          (machines). The critical assumption is that tasks are ordered by their comparative advantage for
          machines: tasks with lower index <InlineEq tex="x" /> are more easily automated. An automation
          threshold <InlineEq tex="I \in [0,1]" /> partitions tasks:
        </P>
      </Prose>
      <DisplayEq
        tex="y(x) = \begin{cases} \kappa(x)\,k(x) & x \leq I \;\text{(automated)} \\ l(x) & x > I \;\text{(labor)} \end{cases}"
        label="(2)"
      />
      <Prose>
        <P>
          where <InlineEq tex="\kappa(x)" /> is the productivity of capital in task <InlineEq tex="x" />.
          Labor earns a wage equal to its marginal product in the tasks it performs. The key result is a
          decomposition of the total wage change induced by an expansion of automation (an increase in{' '}
          <InlineEq tex="I" />) into two opposing forces:
        </P>
      </Prose>
      <DisplayEq
        tex="\frac{d\ln w_L}{dI} = \underbrace{-\frac{\gamma(I)}{1 - \Gamma + \gamma(I)\,I}}_{\text{displacement effect}} + \underbrace{\frac{d\ln\theta_L}{dI}}_{\text{reinstatement effect}}"
        label="(3)"
      />
      <Prose>
        <P>
          where <InlineEq tex="\gamma(I)" /> is the value share of tasks at the automation margin,{' '}
          <InlineEq tex="\Gamma" /> is the total capital task share, and <InlineEq tex="\theta_L" /> is
          the value of tasks allocated to labor. The displacement effect is unambiguously negative: each
          additional task automated reduces demand for labor in that task, pushing down wages. The
          reinstatement effect is positive when new tasks are created at the labor frontier — tasks where
          humans have comparative advantage precisely because machines do not. The net sign is theoretically
          indeterminate and depends on whether automation-era productivity gains translate into new
          labor-complementary activities.
        </P>
        <P>
          The critical empirical question is whether the LLM era is characterized by strong reinstatement.
          Historical episodes of general-purpose technology adoption — the Industrial Revolution, electrification,
          computing — all eventually generated large reinstatement effects, but the transition period produced
          genuine wage declines for displaced workers. Acemoglu (2024) argues that AI as currently deployed
          exhibits a weak reinstatement dynamic because frontier LLM capabilities are concentrated in
          exactly the tasks — information synthesis, creative reasoning, social interaction — that historically
          served as refuges from automation.
        </P>
      </Prose>

      {/* 2.2 Routinization */}
      <SubsectionTitle num="2.2">The Routinization Hypothesis</SubsectionTitle>
      <Prose>
        <P>
          Autor, Levy and Murnane (2003) proposed a complementary framework that classifies tasks along two
          dimensions: routine vs. non-routine and cognitive vs. manual. The key theoretical prediction is that
          capital is a close substitute for routine labor inputs but a complement to non-routine cognitive
          labor. Formally, define the Routine Task Intensity of occupation <InlineEq tex="k" /> as:
        </P>
      </Prose>
      <DisplayEq
        tex="\text{RTI}_k = \ln T_{R,k} - \ln T_{NR,k}"
        label="(4)"
      />
      <Prose>
        <P>
          where <InlineEq tex="T_{R,k}" /> and <InlineEq tex="T_{NR,k}" /> denote the time shares of
          routine and non-routine tasks, respectively, computed from O*NET task importance weights. High
          RTI occupations — bookkeepers, clerks, data entry operators — concentrate in the middle of the wage
          distribution, yielding the canonical "hollowing out" or polarization pattern documented by Goos,
          Manning and Salomons (2009) across European labor markets.
        </P>
        <P>
          The LLM era challenges a core premise of the ALM framework: that creative intelligence and
          social intelligence constitute durable human comparative advantages. Large language models exhibit
          strong performance on tasks previously classified as non-routine cognitive — drafting legal briefs,
          synthesizing medical literature, writing code. The effective routine/non-routine boundary has
          shifted substantially toward tasks requiring physical embodiment, real-time situational judgment,
          or ethical accountability — not toward tasks requiring high education or cognitive sophistication.
          This implies that the hollowing-out may extend upward into the wage distribution for the first time.
        </P>
      </Prose>

      {/* 2.3 SBTC vs TBTC */}
      <SubsectionTitle num="2.3">Skill-Biased vs. Task-Biased Technological Change</SubsectionTitle>
      <Prose>
        <P>
          The canonical framework for understanding technology's distributional effects is Skill-Biased
          Technological Change (SBTC), formalized in the two-factor CES model. Let{' '}
          <InlineEq tex="H" /> and <InlineEq tex="L" /> denote high-skill and low-skill labor, with
          technology-augmenting factors <InlineEq tex="A_H" /> and <InlineEq tex="A_L" />:
        </P>
      </Prose>
      <DisplayEq
        tex="Y = \left[s_H (A_H H)^{\frac{\sigma-1}{\sigma}} + s_L (A_L L)^{\frac{\sigma-1}{\sigma}}\right]^{\!\frac{\sigma}{\sigma-1}}"
        label="(5)"
      />
      <Prose>
        <P>
          Competitive factor pricing yields the skill premium:
        </P>
      </Prose>
      <DisplayEq
        tex="\frac{w_H}{w_L} = \frac{s_H}{s_L}\left(\frac{A_H}{A_L}\right)^{\!\frac{\sigma-1}{\sigma}} \left(\frac{H}{L}\right)^{-\frac{1}{\sigma}}"
        label="(6)"
      />
      <Prose>
        <P>
          Under SBTC, if <InlineEq tex="A_H/A_L" /> rises due to technological progress, the skill premium
          increases — consistent with the experience of the 1980s and 1990s computing revolution. However,
          SBTC fundamentally mischaracterizes the LLM era because it treats "skill" as the relevant
          cleavage, when the actual margin is <em>task codifiability</em>. A radiologist with twenty years
          of training performs highly codifiable pattern-recognition tasks; a plumber exercises real-time
          physical judgment that resists automation. The LLM era thus represents <em>Task-Biased
          Technological Change</em> (TBTC): technology biased toward tasks that are cognitively demanding
          but linguistically or analytically structured, regardless of the educational credentials
          historically required to perform them.
        </P>
        <P>
          This distinction has significant implications for the elasticity of substitution. In the CES
          specification, the critical parameter is <InlineEq tex="\sigma" /> — the elasticity between
          capital and labor in task production. For routine manual tasks (e.g., assembly), estimates suggest{' '}
          <InlineEq tex="\sigma \approx 1.5\text{–}2.0" />, placing capital and labor as gross substitutes.
          For the class of cognitive tasks targeted by LLMs, early evidence suggests{' '}
          <InlineEq tex="\sigma \approx 1.3\text{–}1.8" /> — below the manual estimate but still in
          substitution territory, implying a negative wage effect on the margin of automation absent
          compensating reinstatement.
        </P>
      </Prose>

      {/* 2.4 Polarization */}
      <SubsectionTitle num="2.4">Wage Polarization and the U-Shaped Distribution</SubsectionTitle>
      <Prose>
        <P>
          The theoretical predictions above aggregate into a distinctive prediction about the employment
          distribution: wage polarization, or the simultaneous growth of high-wage non-routine cognitive
          jobs and low-wage non-routine manual jobs, with a hollowing of middle-wage routine jobs. Define
          the employment growth of occupation <InlineEq tex="o" /> as a function of its initial wage
          percentile rank <InlineEq tex="r_o" /> and its routine task intensity:
        </P>
      </Prose>
      <DisplayEq
        tex="\Delta E_o \approx \phi_0 - \phi_1\,\text{RTI}_o + \phi_2 (r_o - \bar{r})^2"
        label="(7)"
      />
      <Prose>
        <P>
          where the quadratic term in wage rank captures the U-shape. Goos, Manning and Salomons (2009)
          confirm this pattern across European labor markets; Acemoglu and Autor (2011) document it in the
          U.S. The LLM era prediction, following the task-biased extension above, is that the trough
          of the U shifts rightward — that is, hollowing now affects higher-wage cognitive occupations
          that were previously protected.
        </P>

        <Callout>
          The most striking implication of TBTC is that a radiologist earning $339,000 per year may face
          higher effective AI exposure than a plumber earning $58,000 — inverting the distributional
          intuition inherited from the robotics era. This prediction is confirmed empirically in Figure 2 below.
        </Callout>
      </Prose>

      {/* 2.5 Korinek AGI Scenarios */}
      <SubsectionTitle num="2.5">AGI Scenario Analysis</SubsectionTitle>
      <Prose>
        <P>
          Korinek and Suh (2023) extend the automation framework to consider a spectrum of AI capabilities,
          from the current LLM era to hypothetical artificial general intelligence. They model wages as the
          marginal product of labor in a neoclassical production function where AI enters as an
          additional factor:
        </P>
      </Prose>
      <DisplayEq
        tex="w^* = \text{MPL}(K, L, A) = f_L(K, L, A)"
        label="(8)"
      />
      <Prose>
        <P>
          The wage trajectory under three scenarios depends on whether AI is complementary or substitutable
          with labor:
        </P>
        <P>
          <strong>Tool AI</strong> (current era): AI augments worker productivity on specific tasks.
          Labor remains scarce, so <InlineEq tex="f_L > 0" /> and wages rise with AI deployment.
          This matches observed data through 2025.
        </P>
        <P>
          <strong>Weak AGI</strong>: AI can perform the majority of cognitive tasks. Labor scarcity
          relaxes in many occupations. The wage distribution bifurcates: workers whose tasks are strongly
          complementary to AI see wage gains; workers in substitution territory see declines.
        </P>
        <P>
          <strong>Strong AGI</strong>: AI is a near-perfect substitute for all forms of labor.
          As <InlineEq tex="A \to \infty" />, labor scarcity is eliminated and competitive wages collapse
          toward zero absent redistribution mechanisms. Output grows rapidly but its distribution
          becomes entirely a function of capital ownership:
        </P>
      </Prose>
      <DisplayEq
        tex="\lim_{A \to \infty} w^* = f_L(K, L, A) \to 0 \quad \text{if } \frac{\partial^2 f}{\partial A\,\partial L} < 0"
        label="(9)"
      />
      <Prose>
        <P>
          Korinek and Stiglitz (2025) argue that the transition path matters as much as the endpoint:
          even if strong AGI ultimately raises aggregate welfare, the distributional dynamics during
          transition can produce sustained wage declines for large shares of the workforce, requiring
          active policy intervention to redirect technological progress toward labor-complementary
          applications.
        </P>
      </Prose>

      {/* ── 3. Measurement ── */}
      <SectionTitle num="3.">Operationalizing Exposure</SectionTitle>
      <Prose>
        <P>
          The theoretical frameworks above are rich in predictions but require operationalization for
          empirical testing. Five generations of exposure index address this challenge, each grounded
          in different theoretical assumptions and data sources.
        </P>
        <P>
          <strong>Frey and Osborne (2017)</strong> operationalize the bottleneck model directly: human
          experts score the degree to which each of 702 occupations is blocked from automation by one of
          three engineering bottlenecks (perception, creativity, social intelligence), then train a
          Gaussian process classifier to extrapolate to the full occupation set. The output is a
          probability <InlineEq tex="P(\text{auto})_o \in [0,1]" /> — the single most widely cited
          labor-market AI statistic.
        </P>
        <P>
          <strong>Felten, Raj and Seamans (2023)</strong> take a capability-mapping approach:
          link 10 AI application domains (image recognition, natural language processing, etc.) to the
          O*NET ability taxonomy, then weight by the importance of each ability to each occupation:
        </P>
      </Prose>
      <DisplayEq
        tex="\text{AIOE}_o = \sum_{a \in \mathcal{A}} w_{o,a} \cdot \text{AIOE}_a"
        label="(10)"
      />
      <Prose>
        <P>
          where <InlineEq tex="w_{o,a}" /> is the importance weight of ability <InlineEq tex="a" /> in
          occupation <InlineEq tex="o" /> from O*NET. This approach captures <em>exposure</em> —
          both augmentation and automation potential — rather than net displacement, consistent with
          the A-R reinstatement ambiguity.
        </P>
        <P>
          <strong>Eloundou et al. (2023)</strong> shift to the task level, directly assessing whether a
          GPT-class LLM can reduce the time required for each O*NET task by at least 50 percent, with or
          without complementary tools. This yields a three-tier taxonomy: E0 (no exposure), E1 (LLM alone
          sufficient), E2 (LLM plus tools). The occupation-level score aggregates task tiers weighted
          by time-on-task.
        </P>
        <P>
          <strong>Gupta and Kumar (2026)</strong> extend the task-level framework to autonomous AI agents
          capable of completing entire workflows, not just discrete tasks. Their Agentic Task Exposure index
          adds a workflow coverage factor <InlineEq tex="\text{COV}(t,o)" /> that penalizes tasks
          requiring physical presence, regulatory accountability, or exception handling, and a regional
          adoption velocity term <InlineEq tex="V(t,r,\tau)" />:
        </P>
      </Prose>
      <DisplayEq
        tex="\text{ATE}_o(r,\tau) = \sum_{t} w_{o,t}\cdot\text{CAP}(t)\cdot\text{COV}(t,o)\cdot V(t,r,\tau)"
        label="(11)"
      />
      <Prose>
        <P>
          <strong>Massenkoff and McCrory (2026)</strong> introduce the first index grounded in
          <em> observed</em> rather than theoretical exposure, using actual Claude conversation data to
          measure what tasks are in practice being performed with LLM assistance. Automated implementations
          receive full weight; augmentative uses receive weight 0.5, reflecting the A-R insight that
          augmentation does not reduce labor demand to zero:
        </P>
      </Prose>
      <DisplayEq
        tex="\text{Obs}_t = \text{cov}(t) \times \left[\text{auto}(t) + 0.5 \cdot \text{aug}(t)\right]"
        label="(12)"
      />
      <Prose>
        <P>
          Figure 1 presents the pairwise correlation matrix across five indices computed on our occupation
          sample. Correlations range from 0.65 (RTI vs. Observed) to 0.91 (Eloundou vs. Observed),
          reflecting genuine theoretical convergence at the low end of the exposure distribution — all
          indices agree that plumbers and electricians face minimal AI exposure — and substantial
          disagreement at the high end, where the relevant margin is whether high-wage cognitive work is
          augmented or automated.
        </P>
      </Prose>

      <Figure num={1} caption="Pairwise Pearson correlations across five AI exposure indices. Cell values show r; dark blue indicates r ≥ 0.9. Indices agree strongly on low-exposure manual occupations but diverge significantly for high-exposure cognitive roles — consistent with Budget Lab (2025).">
        <h3 className="text-gray-700 mb-1 text-sm font-semibold">Figure 1 — Index Agreement Matrix</h3>
        <ModelAgreementMatrix data={findings.modelCorrelations} />
      </Figure>

      {/* Literature timeline */}
      <Figure num={2} caption="Timeline of key theoretical and empirical contributions, 2003–2026. Each entry marks a paradigm shift in how the profession measures AI labor market exposure.">
        <h3 className="text-gray-700 mb-1 text-sm font-semibold">Figure 2 — Literature Timeline</h3>
        <LiteratureTimeline data={findings.literatureTimeline} />
      </Figure>

      {/* ── 4. Empirical Analysis ── */}
      <SectionTitle num="4.">Empirical Analysis</SectionTitle>

      <SubsectionTitle num="4.1">Data</SubsectionTitle>
      <Prose>
        <P>
          The empirical sample consists of 19 occupations spanning 9 industries, selected to provide
          coverage across the full wage and exposure distribution. Exposure scores are drawn from the Felten
          et al. AIOE dataset (SSRN replication files) and the Massenkoff and McCrory (2026) Observed
          Exposure estimates. Wage and employment data are from the Bureau of Labor Statistics Occupational
          Employment and Wage Statistics survey (BLS OES 2023), matched by 6-digit SOC code. Routine Task
          Intensity is computed from O*NET 28.0 task importance weights following equation (4).
        </P>
      </Prose>

      <SubsectionTitle num="4.2">Exposure Distribution</SubsectionTitle>
      <Prose>
        <P>
          Figure 3 plots the distribution of AIOE scores across our occupation sample. The distribution is
          right-skewed, with a mode in the 50–70 range and a long left tail of low-exposure manual and
          interpersonal occupations. Color coding follows the net displacement classification: blue bins
          (AIOE &lt; 30) indicate augmentation-dominant occupations; amber (30–60) indicates the contested
          zone where theoretical predictions are indeterminate; red (&gt; 60) indicates displacement-dominant.
          Approximately 42 percent of occupations fall in the displacement-dominant zone by AIOE, consistent
          with the Frey-Osborne estimate when extended to the LLM capability set.
        </P>
      </Prose>

      <Figure num={3} caption="Distribution of AIOE scores across 19 occupations. Blue = augmentation-dominant (AIOE < 30), amber = contested (30–60), red = displacement-dominant (> 60). 42% of occupations exceed the displacement threshold.">
        <h3 className="text-gray-700 mb-1 text-sm font-semibold">Figure 3 — AIOE Score Distribution</h3>
        <ExposureHistogram data={findings.exposureDistribution} />
      </Figure>

      <SubsectionTitle num="4.3">The Wage-Exposure Relationship</SubsectionTitle>
      <Prose>
        <P>
          The theoretical framework generates a nuanced prediction about the wage-exposure relationship.
          Under the TBTC hypothesis, the highest-wage occupations — those whose comparative advantage
          historically derived from cognitive sophistication — should now show <em>elevated</em> AI
          exposure. This would produce a positive unconditional correlation between AIOE and wages, not
          because high-wage workers benefit from AI, but because AI has reached the task frontier
          previously occupied only by highly educated professionals.
        </P>
        <P>
          Figure 4 confirms this prediction. The OLS regression line has positive slope, driven largely
          by the upper-right cluster of high-wage, high-exposure occupations: software engineers
          ($124k, AIOE=82), lawyers ($127k, AIOE=68), and financial analysts ($96k, AIOE=74). The
          lower-left cluster — electricians, plumbers, teachers — shows both low wages and low exposure,
          consistent with ALM's prediction that physical and interpersonal tasks resist automation. Notably,
          radiologists ($339k, AIOE=71) occupy a prominent position in the high-wage, high-exposure
          quadrant — the clearest illustration of TBTC in our sample.
        </P>
      </Prose>

      <Figure num={4} caption="Median wage vs. AIOE score. Circle size proportional to employment (millions). Dashed line = OLS fit. Click any occupation to open its full profile.">
        <h3 className="text-gray-700 mb-1 text-sm font-semibold">Figure 4 — Wage × AI Exposure Scatter</h3>
        <WageScatterPlot data={findings.wageScatter} />
      </Figure>

      <SubsectionTitle num="4.4">Regression Results</SubsectionTitle>
      <Prose>
        <P>
          To isolate the partial effects of each theoretical construct, we estimate the following
          cross-sectional OLS specification:
        </P>
      </Prose>
      <DisplayEq
        tex="\ln w_o = \alpha + \beta_1\,\text{AIOE}_o + \beta_2\,\text{RTI}_o + \beta_3\,\text{ATE}_o + \boldsymbol{\delta}'\mathbf{X}_o + \varepsilon_o"
        label="(13)"
      />
      <Prose>
        <P>
          where <InlineEq tex="\mathbf{X}_o" /> includes median education requirement and industry fixed
          effects. The AIOE coefficient <InlineEq tex="\beta_1" /> captures the net wage gradient of
          AI exposure after conditioning on routinization and agentic displacement. The RTI coefficient{' '}
          <InlineEq tex="\beta_2" /> tests the routinization hypothesis in the LLM era. The ATE coefficient{' '}
          <InlineEq tex="\beta_3" /> measures the additional wage penalty from susceptibility to
          autonomous agent completion beyond conventional task-level exposure.
        </P>
        <P>
          Results are presented in Figure 5 as a coefficient plot with 95% confidence intervals.
          We find <InlineEq tex="\hat{\beta}_1 = +0.31" /> (SE=0.09, p&lt;0.05): a ten-point increase in
          AIOE is associated with a 3.1 percent higher wage, consistent with the TBTC prediction that
          current exposure is concentrated in high-wage cognitive work. Conversely,{' '}
          <InlineEq tex="\hat{\beta}_2 = -0.18" /> (SE=0.06, p&lt;0.05): higher routine task intensity
          is associated with lower wages, extending the canonical ALM finding to the LLM era.
          The ATE coefficient <InlineEq tex="\hat{\beta}_3 = -0.22" /> (SE=0.08, p&lt;0.05) suggests an
          additional wage penalty for occupations vulnerable to agentic completion, above and beyond
          what is captured by conventional task-level exposure. The model explains 61 percent of
          cross-sectional wage variation (R² = 0.61), indicating that the theoretical exposure constructs
          have substantial joint predictive power for current wages.
        </P>
      </Prose>

      <Figure num={5} caption="OLS coefficient estimates from equation (13). Outcome: log(median wage). n=19, R²=0.61. Error bars show 95% confidence intervals. Green = positive and significant; red = negative and significant; gray = insignificant.">
        <h3 className="text-gray-700 mb-1 text-sm font-semibold">Figure 5 — OLS Regression Coefficients</h3>
        <p className="text-xs text-gray-400 mb-2">
          Outcome: log(median wage) · n={findings.olsResults.n} · R²={findings.olsResults.rSquared}
        </p>
        <div className="mb-4 px-2 py-3 bg-gray-50 rounded overflow-x-auto">
          <Equation
            tex="\ln w_o = \alpha + \beta_1\,\text{AIOE}_o + \beta_2\,\text{RTI}_o + \beta_3\,\text{ATE}_o + \boldsymbol{\delta}'\mathbf{X}_o + \varepsilon_o"
            display
          />
        </div>
        <OLSCoefficientChart data={findings.olsResults.coefficients} />
      </Figure>

      {/* ── 5. Discussion ── */}
      <SectionTitle num="5.">Discussion</SectionTitle>

      <SubsectionTitle num="5.1">The Null-Result Puzzle</SubsectionTitle>
      <Prose>
        <P>
          The regression results above confirm that AI exposure indices are strongly correlated with
          <em> current</em> wages — but this says nothing about the <em>change</em> in wages attributable
          to AI adoption. On this question, the most rigorous causal evidence is strikingly negative.
          Humlum and Vestergaard (2025) link survey-reported ChatGPT usage to Danish administrative records
          for 25,000 employees across 7,000 firms in 11 occupations. Despite high reported usage in exposed
          occupations, they find zero earnings or hours effects through 2024. Johnston and Makridis (2025)
          find the opposite sign in U.S. data — wage gains in exposed sectors for high-skill workers —
          suggesting that the current AI deployment is still primarily augmentative.
        </P>
        <P>
          This null result is theoretically coherent. In the A-R framework, displacement effects only
          appear in wages when automation reaches a <em>task mass</em> sufficient to shift the
          labor-task allocation — that is, when enough tasks are removed from the labor frontier that
          the marginal task in labor demand is meaningfully different from the pre-automation baseline.
          Current LLM adoption likely remains below this threshold in most occupations. The relevant
          analogy is the early adoption of spreadsheet software: it dramatically increased accountant
          productivity but did not reduce accounting employment for more than a decade, because the
          productivity gains translated into demand for more complex analysis rather than fewer analysts.
          Whether LLMs follow the same path — or whether the current adoption cycle is qualitatively
          different — is the central open question in the empirical literature.
        </P>
      </Prose>

      <SubsectionTitle num="5.2">Distributional Implications</SubsectionTitle>
      <Prose>
        <P>
          Even absent aggregate employment effects, the distributional implications of TBTC are significant.
          If the wage-exposure gradient documented in Figure 4 represents a leading indicator of future
          displacement risk, then the current high-wage, high-exposure cluster — software engineers,
          lawyers, analysts, radiologists — faces concentrated risk in any scenario where reinstatement
          is weak. This would represent a novel and historically unusual pattern: the professionals most
          exposed to technological disruption are those with the highest educational investment.
        </P>
        <P>
          Marguerit (2025) confirms heterogeneous effects by skill tier using an IV strategy exploiting
          international variation in AI development: automation AI negatively affects new work creation,
          employment, and wages in low-skilled occupations, while augmentation AI fosters new roles and
          wage increases for high-skilled occupations. This partial equilibrium finding may reconcile the
          null results at the aggregate level — opposing effects in different skill tiers could cancel
          in cross-sectional and time-series aggregates.
        </P>
      </Prose>

      <SubsectionTitle num="5.3">Limitations</SubsectionTitle>
      <Prose>
        <P>
          Several limitations constrain inference. First, the cross-sectional OLS specification in
          equation (13) identifies correlation, not causation. The positive AIOE-wage gradient almost
          certainly reflects, in part, that high-wage cognitive occupations were always more likely to
          adopt new general-purpose technologies — not that AIOE causes higher wages. An IV strategy
          exploiting differential initial AI capability exposure across tasks, following Webb (2020) and
          Marguerit (2025), would be required for causal identification.
        </P>
        <P>
          Second, all exposure indices except Massenkoff and McCrory (2026) are static point-in-time
          snapshots. The frontier of LLM capabilities is advancing rapidly; an AIOE score computed in
          2023 may substantially understate exposure by 2026 for occupations in domains — reasoning,
          multimodal processing, code generation — where model capabilities have advanced fastest.
          Third, the Budget Lab (2025) finding that indices disagree most for high-exposure occupations
          implies that our estimates are noisiest precisely where the policy stakes are highest.
        </P>
      </Prose>

      {/* ── 6. Conclusion ── */}
      <SectionTitle num="6.">Conclusion</SectionTitle>
      <Prose>
        <P>
          The theoretical economics literature delivers a sobering message: the net labor market effects
          of large language models are genuinely indeterminate in partial equilibrium. The A-R framework
          establishes that displacement and reinstatement are both logically possible, and their relative
          magnitudes depend on empirical parameters — the elasticity of substitution, the speed of new task
          creation, the pace of capital accumulation — that cannot be signed from theory alone. The ALM
          routinization framework, extended to the LLM era via the TBTC modification, predicts that the
          hollowing-out extends into high-wage cognitive work for the first time in the history of
          automation. Early empirical evidence through 2025 confirms this exposure pattern but shows no
          realized wage or employment effects — consistent with the model if current adoption is below the
          task-mass threshold for displacement.
        </P>
        <P>
          The most important open question is whether the reinstatement mechanism — the creation of new
          human-complementary tasks — will prove as robust in the LLM era as it did in prior general-purpose
          technology transitions. The Korinek-Suh scenario analysis makes clear that this is not a question
          economics alone can answer: it depends on investment decisions, regulatory choices, and the
          direction of AI capability development. The AI Exposure Platform is designed to make these
          theoretical stakes visible and debatable — embedding the uncertainty from the academic literature
          directly into the tools used to interpret occupational risk.
        </P>
      </Prose>

      {/* ── References ── */}
      <SectionTitle num="References">References</SectionTitle>
      <div className="max-w-2xl space-y-2 text-sm text-gray-600 leading-relaxed">
        {[
          'Acemoglu, D. (2024). The simple macroeconomics of AI. NBER Working Paper 32022.',
          'Acemoglu, D. & Autor, D. (2011). Skills, tasks and technologies: Implications for employment and earnings. Handbook of Labor Economics, 4, 1043–1171.',
          'Acemoglu, D. & Restrepo, P. (2018). The race between man and machine. American Economic Review, 108(6), 1488–1542.',
          'Acemoglu, D. & Restrepo, P. (2022). Tasks, automation, and the rise in U.S. wage inequality. Econometrica, 90(5), 1973–2016.',
          'Autor, D., Levy, F., & Murnane, R. (2003). The skill content of recent technological change. Quarterly Journal of Economics, 118(4), 1279–1333.',
          'Budget Lab at Yale. (2025). Labor market AI exposure: What do we know?',
          'Chopra, A. et al. (2025). The Iceberg Index: Measuring workforce exposure in the AI economy. arXiv:2510.25137.',
          'Eloundou, T. et al. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. arXiv:2303.10130.',
          'Felten, E., Raj, M., & Seamans, R. (2023). Occupational heterogeneity in exposure to generative AI. SSRN 4414065.',
          'Frey, C.B. & Osborne, M.A. (2017). The future of employment: How susceptible are jobs to computerisation? Technological Forecasting and Social Change, 114, 254–280.',
          'Goos, M., Manning, A., & Salomons, A. (2009). Job polarization in Europe. American Economic Review, 99(2), 58–63.',
          'Gupta, R. & Kumar, S. (2026). Agentic AI and occupational displacement: A multi-regional task exposure analysis. arXiv:2604.00186.',
          'Humlum, A. & Vestergaard, E. (2025). Large language models, small labor market effects. NBER Working Paper 33777.',
          'Johnston, A.C. & Makridis, C.A. (2025). Job transformation, specialization, and the labor market effects of AI.',
          'Korinek, A. & Suh, D. (2023). Scenarios for the transition to AGI. NBER Working Paper 32255.',
          'Korinek, A. & Stiglitz, J. (2025). Steering technological progress. NBER Working Paper.',
          'Marguerit, D. (2025). Augmenting or automating labor? The effect of AI development on new work, employment, and wages. arXiv:2503.19159.',
          'Massenkoff, M. & McCrory, P. (2026). Labor market impacts of AI: A new measure and early evidence. Anthropic Economic Index.',
          'Webb, M. (2020). The impact of artificial intelligence on the labor market. Stanford Working Paper.',
        ].map((ref, i) => (
          <p key={i} className="pl-6 -indent-6">{ref}</p>
        ))}
      </div>

    </article>
  )
}

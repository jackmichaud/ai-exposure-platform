# Debate Protocol

## Structure

Each debate consists of three rounds plus a synthesis step. The system orchestrates turn order and passes context between rounds.

## Rounds

### Round 1: Opening Statements

- **Purpose**: Each persona presents their initial analysis of the topic
- **Turn order**: Optimist → Realist → Skeptic → Worker Advocate
- **Input**: Occupation data (title, tasks, exposure scores, industry context)
- **Output**: Each persona's opening position (200-400 words)
- **Context**: Personas only see the occupation data, not each other's responses

### Round 2: Rebuttals

- **Purpose**: Each persona responds to the others' arguments
- **Turn order**: Same as Round 1
- **Input**: Occupation data + all Round 1 responses
- **Output**: Rebuttal addressing specific points from other personas (200-400 words)
- **Context**: Each persona sees all prior responses

### Round 3: Closing Statements

- **Purpose**: Final positions incorporating the full debate
- **Turn order**: Same as Round 1
- **Input**: Occupation data + all prior responses
- **Output**: Closing position with specific recommendations (200-300 words)
- **Context**: Full debate history

### Synthesis

- **Purpose**: Generate an objective summary combining all perspectives
- **Not a persona** — this is a system-level analysis
- **Input**: Full debate transcript + occupation data
- **Output**: Structured summary (see below)

## Synthesis Output Format

```
Key Takeaways: 3-5 bullet points
Risk Assessment: Overall level (low/moderate/high/critical) + explanation
Recommendations for Workers: 3-5 actionable items
Projected Changes:
  - Skills: Which skills gain/lose relevance
  - Wages: Direction and magnitude
  - Employment: Growth, decline, or transformation
Areas of Agreement: What all personas agreed on
Areas of Disagreement: Key unresolved tensions
```

## Orchestration

Debate turns are executed sequentially via the Claude API:

1. Send Round 1 prompt to each persona (sequentially, to manage rate limits)
2. Collect all Round 1 responses
3. Send Round 2 prompt (includes Round 1 context) to each persona
4. Collect all Round 2 responses
5. Send Round 3 prompt (includes all context) to each persona
6. Collect all Round 3 responses
7. Send synthesis prompt with full transcript

## Token Budget

- System prompt per persona: ~300-500 tokens
- Occupation context: ~200-500 tokens
- Prior round context: grows each round (~1,000-3,000 tokens by Round 3)
- Response per turn: 512-1024 max_tokens
- Synthesis response: 1024-2048 max_tokens

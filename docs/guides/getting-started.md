# Getting Started

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- A **Claude API key** from [console.anthropic.com](https://console.anthropic.com)

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd ai-exposure-platform
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```bash
VITE_CLAUDE_API_KEY=your-api-key-here
```

> **Important**: Never commit `.env` to version control. It is included in `.gitignore`.

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Project Structure Quick Tour

```
src/
├── components/    → Reusable UI components and charts
├── pages/         → Route-level page components
├── hooks/         → Custom React hooks
├── context/       → State management (React Context)
├── data/          → Static JSON data files
├── api/           → Data access layer and Claude API client
├── agents/        → Persona definitions and debate logic
├── types/         → Shared TypeScript types
└── utils/         → Utility functions
```

For full details, see [architecture/project-structure.md](../architecture/project-structure.md).

## Key Documentation

- [Architecture overview](../architecture/overview.md)
- [Tech stack](../architecture/tech-stack.md)
- [Data model](../data/data-model.md)
- [Claude API integration](../api/claude-integration.md)

## Troubleshooting

- **Port in use**: Vite will auto-increment the port. Check terminal output.
- **API key errors**: Ensure `.env` exists and the key is valid. Restart the dev server after changes.
- **TypeScript errors**: Run `npx tsc --noEmit` to check types without building.

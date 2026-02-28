# BugScribe

AI-powered bug ticket writer for PMs. Describe a bug in plain English — BugScribe matches it to your product's feature flows and generates a structured, ready-to-paste bug ticket for Jira, ADO, Linear, or Notion.

---

## How It Works

### Step 1 — Feature Library
Paste a list of features (one per line). BugScribe uses Gemini to generate a step-by-step user flow for each one. Review and edit each flow in an interactive card, then approve the ones you want to make available for ticket generation.

Approved flows are saved to `localStorage` and persist across page refreshes.

### Step 2 — Bug Ticket Generator
Describe a bug in plain English (e.g. *"unable to upload documents"*). Gemini matches the description to the most relevant approved flow and generates a fully structured bug ticket:

| Field | Description |
|---|---|
| **Title** | Concise bug title |
| **Feature Affected** | Matched from your approved flows |
| **Environment** | Browser, OS, URL — editable, starts blank |
| **Steps to Reproduce** | Derived from the matched feature flow |
| **Expected Result** | What should happen |
| **Actual Result** | What the bug causes |
| **Severity** | Auto-suggested: Critical / High / Medium / Low |
| **Additional Notes** | Context, edge cases, investigation hints |

All fields are editable before export.

### Step 3 — Export
Click **Copy Ticket** to copy the formatted ticket to your clipboard — clean plain text ready to paste into any tool.

---

## Tech Stack

- **[Next.js 14](https://nextjs.org/)** — App Router, API routes + React UI in one repo
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Google Gemini](https://ai.google.dev/)** — `gemini-2.5-flash` via `@google/genai` SDK
- **localStorage** — Approved flows persist across sessions, no database needed

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/bugscribe.git
cd bugscribe

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
bugscribe/
├── app/
│   ├── layout.js                    # Root layout
│   ├── page.jsx                     # Main app — step tabs and state
│   ├── globals.css                  # Tailwind base + utility classes
│   └── api/
│       ├── generate-flows/route.js  # POST /api/generate-flows
│       └── generate-ticket/route.js # POST /api/generate-ticket
├── components/
│   ├── FeatureInput.jsx             # Feature list textarea + generate button
│   ├── FlowCard.jsx                 # Editable, approvable flow card
│   ├── BugInput.jsx                 # Bug description input
│   ├── TicketPreview.jsx            # Fully editable ticket output
│   └── ExportButton.jsx             # Copy-to-clipboard formatter
└── lib/
    ├── gemini.js                    # Gemini client wrapper
    ├── prompts.js                   # Flow + ticket prompt builders
    └── storage.js                   # localStorage helpers
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ | — | Your Google Gemini API key |
| `GEMINI_MODEL` | ❌ | `gemini-2.5-flash` | Gemini model to use |

---

## License

MIT

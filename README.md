\# AI-First CRM - HCP Interaction Module



An AI-powered CRM system for pharmaceutical field representatives to log and manage interactions with Healthcare Professionals (HCPs).



\## Features

\- \*\*Dual Logging:\*\* Log interactions via a structured form OR conversational AI chat

\- \*\*AI Agent:\*\* LangGraph-powered agent with 5 specialized tools

\- \*\*LLM:\*\* Groq's llama-3.3-70b-versatile model for natural language processing



\## Tech Stack

\- \*\*Frontend:\*\* React + Redux

\- \*\*Backend:\*\* Python + FastAPI

\- \*\*AI Framework:\*\* LangGraph

\- \*\*LLM Provider:\*\* Groq (llama-3.3-70b-versatile)

\- \*\*Database:\*\* SQLite (easily swappable to PostgreSQL)

\- \*\*Font:\*\* Google Inter



\## LangGraph Agent Tools

1\. \*\*Log Interaction\*\* - Records new HCP interactions with AI-assisted data extraction

2\. \*\*Edit Interaction\*\* - Modifies existing interaction records

3\. \*\*Search Interactions\*\* - Searches through past interactions by keyword/HCP

4\. \*\*Summarize Interaction\*\* - Provides detailed summaries of specific interactions

5\. \*\*Get HCP History\*\* - Retrieves full engagement history for any HCP



\## How to Run



\### Prerequisites

\- Node.js 18+

\- Python 3.10+

\- Groq API key from https://console.groq.com



\### Backend Setup

```bash

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

\# Create .env file with:

\# GROQ\_API\_KEY=your\_key\_here

\# DATABASE\_URL=sqlite:///./crm\_hcp.db

uvicorn main:app --reload --port 8000

```



\### Frontend Setup

```bash

cd frontend

npm install

npm start

```



Open http://localhost:3000



\## Project Structure

```

ai-crm-hcp/

├── backend/

│   ├── main.py              # FastAPI entry point

│   ├── database.py          # Database connection

│   ├── models.py            # SQLAlchemy models

│   ├── schemas.py           # Pydantic schemas

│   ├── agent/

│   │   ├── graph.py         # LangGraph agent

│   │   └── tools.py         # 5 LangGraph tools

│   └── routes/

│       ├── interactions.py  # REST API routes

│       └── chat.py          # AI chat endpoint

├── frontend/

│   └── src/

│       ├── App.js

│       ├── store/           # Redux store

│       └── components/      # React components

└── README.md

```


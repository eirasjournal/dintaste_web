
# Din Taste Lab

Din Taste is a digital notebook for robotics engineering and experimental dream analysis. The public site combines short-form theory, interactive kinematics visualizations, a formula-driven palletizer, and a separate AI-backed dream journal.

The frontend is built with Next.js App Router and React. Robotics simulations run in the browser with Three.js and mathjs. Dream analysis is served by the Python service under `app/dreams/backend`, which coordinates SQLAlchemy persistence with optional Groq and Hugging Face integrations.

```
### Dream API

The backend has its own Python dependencies and is intentionally kept beside the feature that consumes it:

```bash
cd app/dreams/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` when the API is not running at its default address.

## Environment Variables

Frontend variables:

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for dream submissions | No, defaults to local FastAPI |
| `RESEND_API_KEY` | Sends newsletter notifications from the server action | Yes for newsletter delivery |

Backend variables:

| Variable | Purpose | Required |
| --- | --- | --- |
| `DATABASE_URL` | SQLite or PostgreSQL connection string | No, local SQLite fallback exists |
| `GROQ_API_KEY` | Generates structured dream interpretations | Recommended |
| `HF_TOKEN` | Requests embedding vectors for similarity scoring | Recommended |

Keep secrets in local environment files or the deployment provider. They should never be committed to the repository.

## Error Handling

All API routes must return a `422` status code for invalid data validation. Client-facing forms should preserve the server message and return to an actionable state after a failed request.

The current implementation is still being brought into alignment with that rule. In particular, the dream client currently reduces non-success responses to a generic error, and the backend has fallback paths for malformed dates and unavailable analysis providers.

## Known Debt

- Newsletter delivery is a notification email, not a durable subscriber list; error handling around missing Resend configuration and thrown server actions is incomplete.
- The dream schema is created at application import time. A migration workflow is planned before the next production schema change.
- Dream analysis depends on external services and can return fallback labels that look like successful analysis.
- The daily-cluster client is present, but its corresponding backend endpoint is not complete.
- The palletizer intentionally treats invalid mathjs expressions as an empty generated layout; this needs a visible validation state.
- There is no automated test suite yet. `npm run lint` and `npm run build` are the current release checks.

## Delivery Notes

Theory and simulation content is local and statically generated, while dream data is handled by the separate Python service. Deploy the frontend and API independently, then set the frontend API URL and backend CORS origins to match the deployed domains.

The application exclusively uses the new authentication system for protected experiences. Authentication is not yet exposed in the public navigation, but new integrations should use the same identity boundary rather than adding page-local checks.

## Project Layout

```text
app/
	actions.ts                    newsletter server action
	dreams/                       dream UI, client, and FastAPI service
	robotics/                     notebook pages and interactive simulations
	portal/page.tsx               experience selector
	globals.css                   global styles and notebook effects
public/                         images and static assets
```

This document tracks the current shape of the lab and its known unfinished edges.

Update the architecture and setup notes when a planned migration or API contract changes.











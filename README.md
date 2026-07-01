# Support Tickets Assessment

This repository contains a full assessment implementation with a separate frontend and backend.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style components (Table, Dialog)
- TanStack Query
- TanStack Table

## Implemented Requirements

- Tickets table shows:
  - ID
  - Subject
  - Requester
  - Status
  - Priority
  - Created Date
  - Description (in details dialog)
- Search by Subject or Requester (server-side query parameter)
- Filter by Status (client-side)
- Sort by Created Date or Priority (client-side)
- Ticket details on row click using Dialog
- Loading, error, and success states
- Frontend consumes an API abstraction (`getTickets(search?)`)
- Backend Lambda handler for `GET /tickets?search=<term>`

## API Cross-Cutting Patterns

- Centralized Lambda wrapper for success/error normalization
- Shared schema validation wrapper using Zod validators
- Structured JSON logging in common API utilities
- Request ID correlation:
  - Uses AWS `requestContext.requestId` in Lambda flow
  - Generates request IDs in local adapter flow
  - Returns request ID in `X-Request-Id` response header
  - Includes request ID in error payload for easier debugging
- Configurable CORS via `API_CORS_ORIGIN` environment variable (defaults to `*`)

## Repository Structure

- [web](web) - Frontend app
- [api](api) - API logic and local server wrapper
- [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) - Interview prep log (what/why/tradeoffs)
- [BONUS_PRODUCTION_README.md](BONUS_PRODUCTION_README.md) - Production design notes for Lambda + DocumentDB search architecture

### Frontend UI Structure (Current)

- `web/src/components/ui` - Shared UI primitives and reusable form building blocks
  - `button.tsx`, `input.tsx`, `select.tsx`, `table.tsx`, `dialog.tsx`, `field.tsx`, `label.tsx`
- `web/src/features/tickets` - Ticket-specific feature composition
  - `components/tickets-search-controls.tsx`
  - `components/table-tickets.tsx`
  - `components/table-column-header.tsx`
  - `lib/ticket-column-defs.tsx`

This separation keeps style and interaction contracts centralized in shared UI, while feature files focus on business behavior and table composition.

## Local Development

### One command from root

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Start both API and UI:
   ```bash
   npm run dev
   ```

This starts:

- API at `http://localhost:8787`
- UI at `http://localhost:5173`

### Service-specific commands

- API only: `npm run dev:api`
- Web only: `npm run dev:web`
- API tests: `cd api && npm test`

## API Contract

- Endpoint: `GET /tickets?search=<term>`
- Search behavior: case-insensitive match on `subject` OR `requester`
- Validation:
  - Empty search is allowed
  - Non-empty search must be at least 2 characters
  - Max search length is 120 characters
- Response shape:

```json
{
  "data": [
    {
      "id": "TCK-1001",
      "subject": "Unable to reset account password",
      "requester": "Ava Johnson",
      "status": "Open",
      "priority": "High",
      "createdDate": "2026-06-24T09:11:00.000Z",
      "description": "Requester reports the password reset email never arrives."
    }
  ],
  "meta": {
    "total": 1,
    "search": "ava"
  }
}
```

### Error Response Notes

- Validation failures return `400`
- Unexpected failures return `500`
- Error responses include `requestId` and `X-Request-Id` for log correlation

Example validation error response (`400`):

```json
{
  "message": "Invalid query parameters",
  "requestId": "2b1f1e1a-9f58-4e8f-9b4f-1c4f33b9be51",
  "details": {
    "issues": ["search: Search must be at least 2 characters."]
  }
}
```

## Testing Checklist

- Load page and confirm ticket list renders
- Search by requester (example: `Ava`)
- Search by subject keyword (example: `VPN`)
- Filter by each status value
- Sort by created date and by priority
- Click row and verify details dialog content

## Interview Notes

- Status filter and sort are intentionally client-side for this assessment.
- Search is server-side because backend requirements explicitly call for `GET /tickets?search=`.
- In production, status/sort/pagination would typically also be server-side query parameters.
- Styling is standardized through shared UI primitives + CSS tokens; features should compose primitives and avoid per-page control styling.
- Dark mode was intentionally not implemented for scope focus; token setup keeps future theming extension straightforward.

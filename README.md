# Noblecare4u Lead Operations Dashboard (NOBLECARE4U-LD)

Dedicated, private operations dashboard for Noblecare4u administrators to view, analyze, and manage patient care enquiries and multi-touch acquisition attribution.

Matches the standard C2C lead dashboard architecture used across JIB Solar, Dhrugo, and Ralsha.

## Architecture & Collections

The dashboard connects server-side in read-only mode to the same MongoDB database used by the public website (`NOBLE CARE 4 U`):

- **`users`**: Patient & contact demographics deduplicated by normalized 10-digit Indian phone number (`name`, `phone`, `email`, `city`, `status`, `createdAt`).
- **`care_info`**: Individual healthcare enquiries (`userId`, `careNeeded`: `Elder Care` | `Nursing` | `Physiotherapy` | `Not sure yet`, `additionalInfo`, `createdAt`).
- **`utm_campaigns`**: Multi-touch marketing touchpoints (`userId`, `route`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `platform`, `createdAt`).

> **Attribution Notice**: The database does not contain a direct `submissionId` or `careInfoId` foreign key linking `care_info` to `utm_campaigns`. Therefore, the dashboard displays individual care enquiries alongside the user's complete campaign touchpoint history, without falsely claiming a 1:1 binding between a specific enquiry and a specific UTM touchpoint.

## Privacy & Search Engine Controls

- **Robots Disallow**: A restrictive [`app/robots.ts`](file:///Users/Ishant/Downloads/Dev-Clapingo/NOBLECARE4U-LD/app/robots.ts) disallows all web crawlers (`User-agent: *`, `Disallow: /`).
- **No-Index Metadata**: All pages include `noindex, nofollow, noarchive` metadata directives.
  *(Note: These controls reduce search engine indexing but do not provide access security).*
- **No Telemetry**: `clientIp` and `userAgent` are never queried, recorded, or displayed.
- **Privacy Phone Masking**: Phone numbers are masked on Overview summary tables (`+91 98XXX XX123`).

## Environment Variables

Only one environment variable is required in `.env.local`:

```env
# Server-side MongoDB Connection (Connects to the same database as the main website)
MONGODB_URI=mongodb+srv://...
```

Never commit `.env.local`. Keep placeholders in `.env.example`.

## Development & Production Build

```bash
# Install dependencies
npm install

# Start development server on port 3001
npm run dev

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Production build
npm run build
```

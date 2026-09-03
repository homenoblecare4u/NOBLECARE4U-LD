# Noblecare4u Lead Operations Dashboard (NOBLECARE4U-LD)

Dedicated, private operations dashboard for Noblecare4u administrators to securely monitor, analyze, and manage patient care enquiries and multi-touch acquisition attribution.

## Architecture & Collections

The dashboard connects server-side in read-only mode to the same MongoDB database used by the public website (`NOBLE CARE 4 U`):

- **`users`**: Patient & contact demographics deduplicated by normalized 10-digit Indian phone number (`name`, `phone`, `email`, `city`, `status`, `createdAt`).
- **`care_info`**: Individual healthcare enquiries (`userId`, `careNeeded`: `Elder Care` | `Nursing` | `Physiotherapy` | `Not sure yet`, `additionalInfo`, `createdAt`).
- **`utm_campaigns`**: Multi-touch marketing touchpoints (`userId`, `route`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `platform`, `createdAt`).

## Security Controls

- **Edge Route Protection**: Next.js Edge Middleware enforces authentication on all dashboard routes and APIs.
- **Server Session Management**: HMAC-SHA256 signed JWT session cookie (`noblecare4u_session`) using `jose` with `httpOnly`, `SameSite=Lax`, and `Secure` in production.
- **Password Security**: Passwords hashed with `bcryptjs` (salt rounds: 10); raw passwords are never logged or stored.
- **Privacy Enforcement**: Telemetry fields (`clientIp`, `userAgent`) are strictly prohibited and never queried or displayed. Phone numbers are masked on overview widgets.
- **Defense in Depth**: Every API endpoint independently verifies the session server-side.
- **Best-Effort Rate Limiting**: In-memory login attempt throttle (max 5 failed attempts per IP per 15 minutes) as a development & local defense control. *(Note: Distributed serverless deployment on Vercel requires an external store like Redis for cross-lambda rate limiting).*

## Environment Variables

Create `.env.local` based on `.env.example`:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your_32_byte_hex_secret
ADMIN_EMAIL=admin@noblecare4u.com
ADMIN_PASSWORD_HASH=$2b$10$...
```

### Generating Secrets

1. **AUTH_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **ADMIN_PASSWORD_HASH**:
   ```bash
   npm run hash-password "your-admin-password"
   ```

## Development & Build

```bash
# Install dependencies
npm install

# Run locally on port 3001
npm run dev

# Lint code
npm run lint

# Typecheck and build for production
npx tsc --noEmit
npm run build
```

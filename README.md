# Lighthouse

## No student should disappear quietly.

Lighthouse is a full-stack, AI-assisted early-support system for schools. It notices the first signs of disengagement, listens for the reason, coordinates a human intervention, recovers missed learning, and measures whether the help worked.

## Why it is different

Most school systems store fees, grades and attendance. Lighthouse closes the support loop:

> Signal → Conversation → Assigned action → Family response → Learning recovery → Follow-up → Measured outcome

It asks not only “Who was absent?” but “Why, what learning was lost, who owns the response, and did the intervention work?”

## Implemented features

### Real full-stack platform
- PostgreSQL persistence with automatic schema initialization
- Secure hashed demo PINs and signed eight-hour JWT sessions
- Role permissions for administrators, teachers, students, parents and safeguarding staff
- Confidential-signal filtering by role
- Login rate limiting and security headers
- Immutable-style audit events for important actions
- Temporary in-memory demo fallback when no database is configured

### Student
- Private barrier check-in
- Same-day support flag
- Offline action queue and reconnection sync
- Voice check-in transcription through Groq Whisper
- AI-generated safe next step and human routing
- Private free-text note excluded from the language-model prompt

### Teacher
- Contextual attendance persisted to the database
- Rotating five-minute attendance QR
- Anonymous class-understanding pulse
- Live Groq teaching adjustment and quick check
- AI-generated low-data catch-up capsule
- Teacher approval and persistent assignment of recovery work

### Parent
- Plain, non-blaming updates
- English, Nigerian Pidgin and Hausa generation
- Persisted parent responses
- Groq-generated shared next step with clear school ownership
- Optional Termii SMS and WhatsApp Cloud API delivery

### Administrator and safeguarding
- Live support-signal dashboard
- Restricted safeguarding visibility
- Explainable Groq case briefs
- Intervention Copilot with human approval
- Persisted owner, actions and follow-up date
- School barrier patterns by route
- Seven-day outcome measurement
- Audit endpoint for accountability
- Live cross-role inboxes refreshed every seven seconds
- Student signals reach authorised school staff
- Support plans and recovery lessons reach the student
- Parent replies reach the administrator activity feed
- Assigned interventions reach the teacher inbox

### Responsible AI
- AI recommends; humans decide.
- No automatic punishment, suspension, grading or diagnosis.
- Risk scores prompt conversations and are not treated as facts.
- Authentication, permissions, attendance facts, approvals and audit records remain deterministic.
- Safety details are restricted and private notes are not sent to Groq.

## Judge demo accounts

| Role | School ID | PIN |
|---|---|---|
| Administrator | `LH-ADMIN` | `2026` |
| Teacher | `LH-TEACHER` | `2468` |
| Student | `LH-STUDENT` | `1357` |
| Parent | `LH-PARENT` | `8642` |
| Safeguarding | `LH-SAFE` | `9753` |

Security-question answer: `people`.

The visible credentials and cross-role switcher exist only for judging. A real school deployment should disable demo switching, provision users administratively, and add MFA or single sign-on.

## Deploy on Render

1. Create a PostgreSQL database on Render, Supabase or Neon and copy its external connection string.
2. Go to https://dashboard.render.com/blueprints and create a Blueprint from this repository.
3. Add the required environment variables listed below.
4. Deploy. `schema.sql` runs automatically and seeds fictional judge accounts.
5. Open `/health` to confirm AI, database and notification configuration.

If creating a normal Render Web Service instead, use:

```text
Build command: npm install
Start command: npm start
Health check: /health
```

## Environment variables

### Required for the full experience

```text
GROQ_API_KEY=your_private_groq_key
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=a_long_random_secret_at_least_32_characters
```

### Recommended

```text
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_WHISPER_MODEL=whisper-large-v3-turbo
DATABASE_SSL=true
NODE_ENV=production
```

### Optional Termii SMS

```text
TERMII_API_KEY=your_termii_key
TERMII_SENDER_ID=Lighthouse
TERMII_CHANNEL=generic
TERMII_API_URL=https://v3.api.termii.com/api/sms/send
```

### Optional WhatsApp Cloud API

```text
WHATSAPP_TOKEN=your_meta_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_VERSION=v21.0
```

### Optional demo customization

```text
DEMO_ADMIN_PIN=2026
DEMO_TEACHER_PIN=2468
DEMO_STUDENT_PIN=1357
DEMO_PARENT_PIN=8642
DEMO_SAFEGUARD_PIN=9753
DEMO_PARENT_PHONE=+234...
```

Never put these values in `app.js`, HTML, `.env.example`, or a GitHub commit. Add them under the Render service’s **Environment** section.

## API overview

- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET/POST /api/signals`
- `POST /api/attendance`
- `GET /api/attendance/qr`
- `POST /api/interventions`
- `POST /api/recoveries`
- `POST /api/family-responses`
- `POST /api/outcomes`
- `GET /api/audit`
- `POST /api/transcribe`
- `POST /api/notify`
- `POST /api/ai`
- `GET /health`

## Local development

```bash
cp .env.example .env
# Export the variables with your preferred environment loader.
npm install
npm start
```

The server listens on `PORT` or `10000`. Without `DATABASE_URL`, it uses temporary in-memory demonstration data.

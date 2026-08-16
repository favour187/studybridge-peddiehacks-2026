# Lighthouse

## No student should disappear quietly.

Lighthouse is an AI-assisted early-support system for schools. It notices the first signs of disengagement, listens for the reason behind them, and coordinates a human intervention before a student fails or drops out.

**Hackathon prototype:** https://favour187.github.io/studybridge-peddiehacks-2026/

## The problem

Most school management systems record attendance, grades and fees but react only after the damage is visible. Dropping out is usually a process: irregular attendance, lost learning, reduced confidence, weak family communication and unresolved access barriers accumulate over time.

A red attendance number cannot explain whether a student is facing transport costs, illness, safety concerns, a learning gap or a problem at home. Schools need an action system—not another database.

## The solution

Lighthouse connects four people around one support pathway:

1. **Students** privately explain what is making school difficult.
2. **Teachers** record attendance, mastery and lessons that require recovery.
3. **Parents** receive plain-language, actionable updates and can respond.
4. **Administrators** assign, track and verify interventions.

Every case moves through:

> Signal → Conversation → Action → Learning recovery → Follow-up → Resolved

## AI features

### Explainable early-warning engine
Combines changes in attendance, assignment completion, mastery, student check-ins and unrecovered learning. It shows the evidence behind each signal rather than producing a mysterious score.

### Intervention Copilot
Produces a concise case brief and drafts supportive next steps. It distinguishes likely access barriers from misconduct. A trained person must approve every action.

### Lesson Recovery AI
Turns a teacher-approved lesson objective into a low-data micro-lesson: explanation, worked task and proof-of-understanding question.

### Pattern detection
Finds shared barriers across students—for example, transport reports concentrated on one route—so administrators can solve a system problem instead of blaming individuals.

### Live teaching insight
Combines aggregate attendance and anonymous class-understanding signals to suggest an inclusive teaching adjustment and a quick check-for-understanding question.

### Student support routing
After a student selects a barrier category, Groq creates a safe immediate next step and recommends the appropriate human follow-up route. The private free-text note is not sent to Groq.

### Inclusive family communication and planning
Rewrites school messages in plain, non-blaming language, supports translation, and turns a parent's response into a shared school-owned next step.

### Where AI is intentionally not used
Authentication, attendance storage, safeguarding permissions, risk-score arithmetic, approvals and audit records remain deterministic. AI helps interpret and communicate; it cannot become the authority for identity, facts, punishment, grades or safety decisions.

## Responsible AI

- AI recommends; humans decide.
- No automatic punishment, suspension or grading.
- Attendance alone never determines risk.
- Sensitive safety details are restricted to safeguarding staff.
- Students are told why information is collected.
- Support outcomes are tracked to detect ineffective or biased interventions.
- The browser prototype uses transparent rules and scripted examples; a production model would require consented, secured school data and formal bias evaluation.

## Judge demo and role security

The prototype opens with a role-based access gateway. Judges can use **Start guided judge demo** or choose any role. Demo IDs, PINs and the security answer are prefilled so access is fast while the product still demonstrates separation between administrator, teacher, student and parent information.

The security question is: **What guides every Lighthouse decision?** The answer is **people**.

This is prototype authentication only. Production would use encrypted school-managed identity, least-privilege permissions, multi-factor authentication, audit logs and separate safeguarding access.

## Prototype walkthrough

- **Admin:** inspect early signals, open an AI case brief and approve a support plan.
- **Teacher:** mark attendance, inspect learning pulse and generate a catch-up capsule.
- **Student:** submit a private barrier check-in and request same-day support.
- **Parent:** translate the family message and respond with one tap.

The fictional Amina scenario demonstrates how a transport barrier causes missed Mathematics learning and how the school closes both gaps.

## Real Groq AI deployment on Render

**Never put `GROQ_API_KEY` in `app.js`, HTML, or a GitHub commit.** Browser visitors can read frontend values.

The repository includes `server.mjs` and `render.yaml`. The browser calls `/api/ai`; the Render server privately reads the key and calls Groq.

1. Open https://dashboard.render.com/blueprints and choose **New Blueprint Instance**.
2. Connect this GitHub repository. Render detects `render.yaml`.
3. When prompted for `GROQ_API_KEY`, paste the real Groq key into Render—not GitHub.
4. Create the service and wait for the deployment to finish.
5. Open the generated `onrender.com` URL and test **Run AI morning scan**.

If creating a normal Web Service instead of a Blueprint, use build command `npm install`, start command `npm start`, and add `GROQ_API_KEY` under **Environment**. The server binds to Render's `PORT` automatically.

GitHub Pages remains useful for the scripted interface demonstration but cannot securely hold a runtime Groq secret. A Netlify function is retained as an alternative deployment option.

## Technology

HTML, CSS, vanilla JavaScript, localStorage, a service worker, a Netlify serverless function and the Groq Chat Completions API. The frontend has no external library dependency.

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Production roadmap

- Secure role-based backend and audit logs
- SMS/USSD check-ins for families without smartphones
- Consent management and data-retention controls
- Integration with existing attendance and assessment systems
- Locally evaluated language models for case summaries and lesson recovery
- Outcome dashboard measuring attendance recovery, learning recovery and intervention fairness

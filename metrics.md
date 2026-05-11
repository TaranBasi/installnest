# InstallNest — Metrics & Traction

> Last updated: May 11, 2026 | Stage: Validation experiment

---

## Analytics Stack

| Tool | Purpose | What it does NOT do |
|------|---------|---------------------|
| **Microsoft Clarity** | Session recordings, heatmaps, rage clicks, scroll depth | Channel attribution, conversion counting |
| **Google Analytics 4** | Visitor counts, traffic sources, UTM attribution, real-time dashboard, conversion events | Session recordings |
| **Supabase `leads` table** | Signup-level channel attribution (which forum post → which signup) | Visit-level data |

Together these three tools give the full picture: Clarity for *why* people drop off, GA4 for *where* traffic comes from, Supabase for *which channel actually converts* to a signup.

### UTM Naming Convention

Every link posted externally **must** include UTM parameters. This is the only way to know which channels are driving signups vs. just visits.

| Channel | UTM string to append |
|---------|---------------------|
| SpeakEV forum | `?utm_source=speakev&utm_medium=forum&utm_campaign=validation` |
| Facebook groups (personal account) | `?utm_source=facebook-groups&utm_medium=social&utm_campaign=validation` |
| Facebook page | `?utm_source=facebook-page&utm_medium=social&utm_campaign=validation` |
| Reddit | `?utm_source=reddit&utm_medium=social&utm_campaign=validation` |
| Direct installer email outreach | `?utm_source=email&utm_medium=outreach&utm_campaign=installer-validation` |
| Other EV forums | `?utm_source=<forum-name>&utm_medium=forum&utm_campaign=validation` |

**Example:** `https://installnest.com?utm_source=speakev&utm_medium=forum&utm_campaign=validation`

### One-time setup required
1. Create a free GA4 property at [analytics.google.com](https://analytics.google.com) → get your Measurement ID (`G-XXXXXXXXXX`)
2. Replace both instances of `G-XXXXXXXXXX` in `index.html` with your real ID
3. In Supabase dashboard → Table Editor → `leads` table → add 4 nullable `text` columns: `utm_source`, `utm_medium`, `utm_campaign`, `referrer`
4. Redeploy the Edge Function: `supabase functions deploy submit-interest`

---

## North Star Metric

**Qualified consumer signups** — the number of UK residents who submit their details requesting EV charger installation quotes.

This is the single number that validates the core hypothesis: that there is real, actionable demand for this service. Everything else is a supporting signal.

---

## Validation Experiment

| Parameter | Value |
|-----------|-------|
| **Start date** | May 7, 2026 |
| **End date** | June 1, 2026 |
| **Duration** | 25 days |
| **Budget** | £0 (total project budget: £50, £30 already spent) |
| **Channels** | Organic only (forums, communities, outreach) |
| **Hypothesis** | There is sufficient latent demand that 500+ UK consumers will join a waitlist for a free EV charger installation comparison service within 25 days of launch — using zero paid media |

---

## Go / No-Go Criteria (June 1, 2026)

| Signal | Threshold | Decision |
|--------|-----------|----------|
| Consumer signups | < 500 | No-go — scrap or pivot |
| Consumer signups | 500–999 | Tentative go — investigate further |
| Consumer signups | 1,000+ | Confident go — build MVP |
| Installer waitlist signups | 200–300 | Positive signal on supply side |
| Site conversion rate | 20–30% | Healthy demand signal |
| Site conversion rate | < 10% | Message or audience problem |

**Decision date:** June 1, 2026

---

## Current Traction

> Snapshot: May 11, 2026 (Day 4 of 25)

| Metric | Current | Target (June 1) |
|--------|---------|-----------------|
| Total website visitors | ~30 | 2,000–5,000 |
| Consumer waitlist signups | 4 | 500 (min) / 1,000 (confident) |
| Installer waitlist signups | 0 | 200–300 |
| Site conversion rate (visitors → signups) | ~13% | 20–30% |
| SpeakEV thread views | 226 | — |
| SpeakEV thread replies | 24 | — |
| Days remaining | 21 | — |

**Run rate (Day 4):** ~1 signup/day. Need ~20–40/day to hit the minimum threshold. Traffic is the bottleneck, not conversion rate (13% is within range).

---

## Consumer Funnel

```
Awareness (see content / forum post)
        ↓
Traffic (visit installnest.co.uk)
        ↓
Interest (engage with page content)
        ↓
Signup (submit wishlist form) ← North star
        ↓
[Future MVP]
Quote request submitted
        ↓
Quotes received from installers
        ↓
Installer selected
        ↓
Job completed ← Revenue event
```

**Current bottleneck:** Awareness / traffic. Conversion rate is acceptable; reach is the problem.

---

## Installer Funnel

```
Awareness (outreach email / forum post / organic search)
        ↓
Visit installer landing page
        ↓
Installer waitlist signup ← Validation metric
        ↓
[Future MVP]
Onboarding + vetting (OZEV, NICEIC, insurance, reviews)
        ↓
Active on platform
        ↓
Lead received
        ↓
Lead payment ← Revenue event
```

**Current status:** Installer outreach not yet started. Zero signups. Priority: begin direct outreach to OZEV-approved installers this week.

---

## Key Metrics by Stage

### Validation (now — June 1, 2026)
- Consumer waitlist signups (north star)
- Installer waitlist signups
- Site conversion rate (visitors → signups)
- Traffic by channel (which channels are actually working)
- Forum thread engagement (views, replies, clicks)

### MVP (post-go, Q3 2026)
- Consumer quote requests submitted
- Installer response rate (% of leads responded to within 24h)
- Consumer-to-installer match rate
- Quote-to-job conversion rate (% of matched consumers who book an install)
- Installer churn / retention

### Scale (Q4 2026+)
- Monthly Recurring Revenue (MRR) from installer subscriptions
- Customer Acquisition Cost (CAC) — consumer and installer
- Lifetime Value (LTV) — installer
- Net Promoter Score (NPS) — consumer and installer
- Jobs completed per month
- Geographic coverage (% of UK postcodes served)

---

## 30 / 60 / 90 Day Targets (post-go)

> Applies only if June 1 go decision is made.

| Period | Consumer users | Installer partners | Jobs facilitated | MRR |
|--------|---------------|-------------------|-----------------|-----|
| 30 days (July 2026) | 1,500 | 50 | 10 | £0 (pre-revenue) |
| 60 days (Aug 2026) | 3,000 | 150 | 50 | £1,500 |
| 90 days (Sept 2026) | 6,000 | 300 | 150 | £4,500 |

---

## 6-Month and 1-Year OKRs (conditional on go)

### 6 months (November 2026)
- **O:** Prove the marketplace can match supply and demand at meaningful volume
- KR1: 10,000 consumer signups / active users
- KR2: 500 vetted installers across UK
- KR3: 500 jobs completed through the platform
- KR4: £15,000 MRR from installer subscriptions/leads

### 12 months (May 2027)
- **O:** Establish InstallNest as the recognisable name for EV charger installation in the UK
- KR1: 50,000 consumer signups / active users
- KR2: 2,000 vetted installers
- KR3: 5,000 jobs completed
- KR4: £75,000 MRR
- KR5: Inbound press coverage (≥2 pieces in national/trade media)

---

## Accelerator Pitch — Metrics You'll Need

When applying to accelerators (Entrepreneur First, Techstars, Seedcamp, etc.), these are the numbers that will be asked:

| Metric | What it tells investors |
|--------|------------------------|
| Waitlist signups | Validates demand without spending on ads |
| Conversion rate | Signals product-market fit at the top of funnel |
| Installer inbound interest | Validates supply-side pull |
| Traffic-to-signup velocity | Shows organic growth rate |
| CAC (£0 during validation) | Demonstrates capital efficiency |
| Channel breakdown | Shows you understand where your customers are |
| Go/no-go date (June 1) | Shows founder discipline — you have a defined experiment, not endless exploration |

**Frame the validation story:** "We went from 0 to [X] signups in 25 days with £0 in paid marketing, a 25-day time box, and a pre-defined go/no-go threshold." This is a strong signal to investors that you run structured experiments.

---

## Riskiest Assumptions (to disprove or validate)

| Assumption | How we're testing it | Status |
|------------|---------------------|--------|
| Consumers want a comparison platform for EV installers | Waitlist signups | In progress |
| Consumers will submit personal details to an unknown brand | Conversion rate | 13% so far — promising |
| Installers will pay for pre-qualified leads | Installer waitlist + outreach | Not started |
| Organic traffic is sufficient to reach 500 signups in 25 days | Channel performance vs. run rate | Behind pace — need to accelerate |

# InstallNest — Project Brief

> Last updated: May 11, 2026 | Stage: Validation experiment

---

## Vision

To become the UK's most trusted marketplace for home EV charger installation — making it effortless for any UK homeowner or renter to find a verified installer, access government grants, and get a fair deal.

## Mission

Remove the friction, confusion, and mistrust from the EV charger installation process by connecting consumers with only the most rigorously vetted local installers — for free.

---

## The Problem

### Consumer side
Getting a home EV charger installed costs £800–£1,200. But finding a trustworthy, OZEV-approved installer requires multiple phone calls, cold Google searches, and no reliable way to compare quotes. The process is opaque, slow, and often involves pushy sales tactics. Worse, many consumers don't know they're eligible for up to £500 off through the government's EV Chargepoint Grant.

### Installer side
Small and medium EV charger installation businesses struggle with lead generation. Their customer acquisition is inefficient — they're paying for generic lead-gen platforms (Checkatrade, Bark, etc.) that deliver unqualified leads, or relying entirely on word of mouth. There is no EV-specific marketplace that pre-qualifies consumer intent and delivers job-ready leads in a defined geography.

---

## The Solution

InstallNest is a free-to-use comparison marketplace for home EV charger installation in the UK.

**For consumers:**
- Submit one request, receive multiple competitive quotes from verified local installers
- Every installer is pre-screened: OZEV approval, NICEIC certification, insurance, and real customer reviews required
- Full guidance on the government EV Chargepoint Grant (up to £500 off)
- No phone calls, no obligation, no spam

**For installers:**
- Access to a steady pipeline of pre-qualified, geographically targeted job leads
- Pay only for the leads you receive (no subscription lock-in at launch)
- Build a verified review profile on an EV-specific platform

---

## Business Model

| Phase | Model | Revenue stream |
|-------|-------|----------------|
| Validation (now) | Free | £0 — proving demand exists |
| MVP | Pay-per-lead | Installers pay per consumer quote request received |
| Scale | Subscription | Monthly plans for installers (tiered by geography/volume) |

The consumer-side is permanently free. Revenue is generated entirely from the installer supply side.

---

## Target Audience

### Primary consumer persona
**Pre-purchase EV buyer researching total ownership cost**
- Actively considering buying an EV in the next 3–12 months
- Using total cost of ownership (TCO) as a decision framework
- Needs to understand charger installation cost upfront
- Likely unaware of the OZEV grant they may be eligible for
- Motivated by saving money, not just convenience

**Secondary consumer persona**
- Homeowners or grant-eligible renters who already own an EV and need a charger installed now

### Target installer profile
- OZEV-approved and NICEIC-certified
- Small to medium installation business (1–20 employees)
- Operating in a defined geographic area
- Wants consistent lead flow without managing their own marketing
- Currently relying on Checkatrade, Bark, or word of mouth — frustrated by lead quality

---

## Competitive Landscape

| Competitor | Type | Weakness vs. InstallNest |
|------------|------|--------------------------|
| Checkatrade | General trades directory | Not EV-specific, no grant guidance, installer quality varies widely |
| Bark | Lead-gen marketplace | No vetting standard, race-to-the-bottom pricing |
| Octopus Energy | Bundled charger + install | Tied to their own hardware, not independent |
| Ohme / Zappi / Wallbox | Charger brand portals | Brand-locked, not impartial |
| British Gas / OVO | Energy supplier bundles | Expensive, not consumer-first, no comparison |

**Our edge:** EV-specific, rigorously vetted (OZEV + NICEIC + reviews), completely free for consumers, and genuinely impartial — we don't favour any installer or hardware brand.

---

## Regulatory Context

- **EV Chargepoint Grant (OZEV):** UK government grant of up to £500 for eligible renters, flat owners, and households with off-street parking. Grant-eligible consumers are a high-intent audience — they're actively motivated to act.
- **NICEIC certification:** Required for safe, compliant electrical installation work in the UK. All listed installers must hold this.
- **OZEV approval:** Required for any installer to be eligible to claim the grant on a customer's behalf. Non-negotiable for our installer vetting.
- **Planning permission change (May 2025):** UK government removed the requirement for planning permission for most home EV charger installations. Removed a key friction point that previously slowed adoption.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Single-page HTML, Tailwind CSS (CDN), vanilla JS |
| Backend / DB | Supabase (Postgres + Auth) |
| Hosting | Static hosting (domain registered) |
| Analytics | Microsoft Clarity (session recording, heatmaps) |
| Comms | Email notifications via Supabase hooks |

Deliberately minimal — no framework overhead during validation. Full stack re-evaluation happens if the go decision is made in June.

---

## Current Stage: Validation Experiment

**Thesis:** There is sufficient unmet demand among UK consumers for a free, trusted EV charger installer comparison service that the problem is worth solving at scale.

**Test:** A landing page with a waitlist signup, driven entirely through organic channels, over a 25-day window.

**Window:** May 7 – June 1, 2026

**Go/no-go decision:** June 1, 2026

See [metrics.md](./metrics.md) for full go/no-go criteria and current traction.

---

## Team

**Taran Basi** — Founder
Solo founder. Identified the opportunity through market research into the friction points in UK EV adoption. Background: [to be completed]. Currently wearing all hats: product, marketing, tech, operations.

*Looking for:* A co-founder or early operator with domain expertise in energy/EV, or a strong B2B sales background to lead installer acquisition.

---

## What We Are NOT Doing (Scope Guardrails)

- Not building hardware — purely a software marketplace
- Not endorsing or selling specific EV charger brands
- Not operating outside the UK (at launch)
- Not running as a directory (active quote-matching, not passive listing)
- Not accepting unvetted installers — quality over quantity on supply side
- Not spending on paid ads during validation — zero-cost traction only

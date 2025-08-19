# Current UI & Interaction Patterns — Audit & Rationale
*(Companion to the carousel taxonomy & prototypes package)*

## 0) Executive Summary
- **Problem:** Car cards and rails exhibit **low differentiation**, reducing scannability and discovery. Users see “the same” cells with weak cues for state (LIVE, upcoming, watched), intent (resume vs explore), or value (new, trending, expiring).
- **Impact:** Lower content throughput, shallow engagement, and decision fatigue. High bounce on Home scrollers, low rail depth, confusion between LIVE and Starting Soon.
- **Direction:** A **differentiated rail system** with consistent inputs and semantics, viewport-aware dedupe, and rail-specific visual tokens to convey intent at a glance.

## 1) Methodology
- Reviewed screen captures and images you provided (hero/featured modules; suggested reels/grids; people & sponsored units).
- Heuristic evaluation across **Nielsen’s 10 heuristics**, **media IA best practices**, **TV/D‑pad ergonomics**, and **attention economics**.
- Compared to patterns popularized by **Instagram, Netflix, Apple News** (as references, not visuals).

## 2) Findings (Symptoms & Evidence)
1) **Visual Sameness Across Cards**
- Card silhouettes, density, and metadata lines are uniform. Distinct intents (resume, live, upcoming, pack, channel) **look identical**.
- **Effect:** Users cannot triage quickly; they scroll past rails without meaningful choices.

2) **Intent Signals Underpowered**
- LIVE, Expiring, New/Recency, Progress are not clearly distinguishable or consistently placed.
- **Effect:** “What should I do now?” is not answered at the per‑card level.

3) **Hierarchy & IA**
- Above-the-fold modules don’t clearly encode **situational intent** (e.g., “I want live now” vs “I want to resume”). Continue Watching can be buried or look like any other rail.
- **Effect:** Cognitive load increases; quick paths to value are hidden.

4) **Motion & Preview Policy**
- Previews (if any) are not governed by a clear policy (on-hover, on-focus, auto). Competing motion draws attention indiscriminately.
- **Effect:** Noise over signal; users lose track of context.

5) **Duplication & Redundancy**
- The same title can appear in multiple rails without suppression or explanation.
- **Effect:** Perceived content pool feels smaller and repetitive.

6) **LIVE vs Upcoming Ambiguity**
- Time cues live inline with titles; no countdown baselines; inconsistent “LIVE” placement.
- **Effect:** Users can’t tell if something is live, starting soon, or a replay.

7) **People/Commerce Units Mixed with Content**
- Follow/Shop units share card anatomy with long-form content.
- **Effect:** Intent switching within the same rhythm; ad blindness and misclicks.

8) **Accessibility & TV/D‑pad**
- Focus/hover parity is unclear; keyboard/remote left/right behavior not standardized per rail.
- **Effect:** Non-mouse navigation is brittle; poor living‑room ergonomics.

9) **Copy & Micro‑Labels**
- Row headers and microcopy don’t carry intent (“Because you watched…”, “Expiring…”). Badges are inconsistent.
- **Effect:** Missed opportunities to communicate why an item is recommended and what the user should do.

## 3) Root Causes
- **Single-card template** used everywhere.
- Lack of a **rail taxonomy** mapping content types to **distinct silhouettes & tokens**.
- No **ranking & dedupe governance**; no “ownership” rule for titles.
- Motion/preview **policy not encoded** in components.
- Copy system doesn’t separate **source (why) + state (when) + action (what)**.

## 4) Rationale for the Proposed System
**Principle:** *Different intents deserve different silhouettes.*
Differentiated rails + consistent semantics → lower decision friction and higher throughput.

### How each proposal addresses findings
- **Continue Watching (progress-first)** → Solves hierarchy-to-value (Finding #1/#3). Progress bar + “Resume” CTA.
- **Live Now (ticker cadence)** & **Starting Soon (countdown)** → Resolve LIVE vs upcoming (Finding #6).
- **For You Mosaic** & **Because You Watched** → Personalization disclosed in header/microcopy (Finding #9).
- **New & Noteworthy / Expiring Soon** → Recency/urgency tokens (Finding #2).
- **Collections/Packs; Channel Surf** → Navigation affordances distinct from content tiles (Finding #7).
- **Reels/Highlights; Reels Grid** → Short‑form carved out with 9:16 aspect + hover/focus preview policy (Finding #4).
- **Viewport-aware de‑dup + priority order** → Reduces perceived repetition; one rail “owns” a title (Finding #5).
- **TV/D‑pad focus rules** → Predictable left/right motion; clear focus ring and button order (Finding #8).

## 5) Proposed IA (Home)
**Top:** Continue Watching • Live Now • Starting Soon
**Middle:** For You Mosaic • Because You Watched • New & Noteworthy • Trending • Collections/Packs
**Bottom:** Channel Surf • Expiring Soon • Reels/Highlights

> *This IA is implemented in the prototypes and can be A/B tested with ordering toggles.*

## 6) Component Tokens (Visual & Behavioral)
- **Card tokens:** silhouette (16:9 / 9:16 / 1:1 / stacked), progress, badges (LIVE/NEW/EXP), meta (channel, time), CTA label (Resume/Watch/Open/Shop/Follow).
- **Rail tokens:** header label + microcopy, accent stripe, density (wide/compact), motion policy (auto/hover/focus/off).
- **State tokens:** LIVE placement top-left; countdown below title; expiring date in meta; progress above meta.

## 7) Motion/Preview Policy
- **Hero:** optional auto-advance preview trials; default off.
- **Live Now:** ticker auto-scroll allowed; speed capped; pause on hover/focus.
- **Reels:** preview on hover/focus only; never auto.
- **Other rails:** static by default; consider subtle poster parallax on focus.

## 8) Ranking & De‑dup Governance
- Priority (highest→lowest): **Continue Watching** > **Live Now** > **Starting Soon** > **For You Mosaic** > **Because You Watched** > **New & Noteworthy** > **Trending** > **Collections/Packs** > **Reels/Highlights** > **Channel Surf** > **Expiring Soon**.
- **Ownership rule:** first rail in priority to present a title claims it; others suppress or show **explainer microcopy** (“Also in For You”).

## 9) Copy System
**Header:** “Because you watched *Team Y*” • “Trending near you” • “Expiring this week”.
**Badges:** `LIVE`, `NEW`, `EXP`.
**Meta:** `channel • league • runtime • date`.
**CTA:** `Resume`, `Watch`, `Open`, `Follow`, `Shop Now`.

## 10) Accessibility & TV/D‑pad
- Focus rings always visible on focusable tiles (2–3px).
- Arrow keys or remote left/right advance by ~90% viewport width.
- Ensure tab order: rail header → prev/next → track → first card.

## 11) Metrics & Instrumentation
- **Rail:** impressions, visible ms, header clicks.
- **Card:** focus count, preview start, play/open/follow/shop clicks.
- **Dedupe:** duplicates suppressed (count), ownership distribution.
- Funnel: Home view → rail impression → card preview → play.

## 12) Experiment Plan (90 Days)
- **A/B**: Reels above/below the fold; CW density; Expiring badge on/off; Mosaic vs standard.
- **MVT**: Motion policy (Hero auto-preview on/off) × (Live ticker speed slow/med).
- **Success metrics:** CTR to play/resume; unique titles started per session; rail dwell; duplicate perception score (survey).

## 13) Risks & Mitigations
- **Visual noise from motion:** cap auto-movement; pause on hover/focus.
- **Over‑personalization:** guarantee editorial slots; expose “why”.
- **Dedupe side effects:** show “Also in …” explainer if suppressed.

## 14) Implementation Checklist
- [ ] Define rail priority + ownership map
- [ ] Apply card tokens per rail type
- [ ] Add countdown/live/expiring helpers
- [ ] D‑pad focus/states parity
- [ ] Instrumentation hooks
- [ ] Copy system tokens
- [ ] QA with keyboard and remote testing

## 15) Roadmap (30/60/90)
- **30 days:** Implement CW, Live Now, Starting Soon, For You; ship dedupe; add metrics.
- **60 days:** Add Collections, Expiring, Channel Surf; tune copy; roll first A/Bs.
- **90 days:** Introduce Reels Grid, People/Shop units (if applicable); finalize governance & dashboards.

---
**Appendix A — Heuristic Scorecard (1–5)**
- Visibility of system status: 3
- Match between system & real world: 3
- User control & freedom: 3
- Consistency & standards: 2
- Error prevention/recovery: 4
- Recognition rather than recall: 2
- Flexibility & efficiency: 3
- Aesthetic & minimalist design: 3
- Help users recognize/diagnose/recover: 3
- Help & documentation: 2

**Appendix B — Mapping (Current → Proposed)**
- Uniform “Content Row” → **Rail-type components** (CW, Live, Soon, Mosaic, Reels, Packs, Channels, Expiring).
- In-title time cues → **Badges + structured meta**.
- Generic Play CTA → **Rail-specific CTAs** (Resume/Watch/Open/Follow/Shop).



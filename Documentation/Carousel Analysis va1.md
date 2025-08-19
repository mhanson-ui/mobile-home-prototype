Carousel Analysis v1
For each segment, I’ll cover:
Flow Summary – what task you were attempting and how the app supported it.
Strengths – what worked well in the interaction.
Friction Points – where you slowed down, hesitated, or the app added unnecessary steps.
Opportunities to Improve – specific UI/UX or flow changes that would make the task smoother.
Whart we have goes beyond just fixing friction: it’s about breaking out of a flat “endless carousel” model into something structured, differentiated, and scalable. Ill review the inventory from the mobile home page Derrick and Julie created to build a taxonomy + IA proposal + carousel redesign direction.

🔎 Step 1. Segment Analysis
For each clip, I did a structured review:
Task flow: what you were trying to do.
Strengths: what worked well.
Friction: repetitive, confusing, or inefficient interactions.
Opportunities: immediate fixes and long-term structural ideas.
🧩 Step 2. Identify Core Problems 
All carousels look the same → users can’t tell what’s different (e.g., “Trending,” “New Releases,” “For You” blur together).
No strong IA layer → every entity (show, category, pack, recommendation) collapses into the same UI pattern.
Limited sense of progression → browsing feels like horizontal scrolling forever.
📚 Step 3. Taxonomy of Entities
Define the “building blocks” based on common OTT / content-forward patterns, you likely need distinctions such as:
Content entities: shows, movies, clips, packs, genres, events.
Meta entities: personalized recs, trending, continue watching, new releases.
System entities: ads, promos, upsells, calls to action.
Each entity type can map to different carousel treatments (visual hierarchy, size, interactivity)
🎨 Step 4. Carousel & Unit Differentiation
Using references like Instagram (exploration, reels, social overlays) and Netflix (category blending, big hero rows, editorial curation), we can design a set of carousel archetypes, e.g.:
Hero carousel: oversized cards with motion/preview.
Cluster carousel: grouped by theme, mood, or pack.
Utility carousel: continue watching, resume, shortcuts.
Discovery carousel: smaller tiles, faster browsing.
Editorial carousel: curated blends (like “Because you watched X”).
Each archetype solves a different browsing need (continue, discover, explore, decide, upsell).
🗺 Step 5. Information Architecture & Structure Proposal
We’d move toward a layered IA where:
Top level: big differentiating units (hero, featured, continue watching).
Middle level: thematic discovery carousels (genre, trending, packs).
Bottom level: long-tail exploration (deep dives, full catalogs).
This layering solves the sameness problem and helps users instantly know what kind of browsing they’re doing.
After reviewing the carousel I defined a granular breakdown and a strategic proposal.




Executive Summary
Your core issue isn’t just “too many carousels”—it’s undifferentiated rails and flat information architecture. Everything looks and behaves the same, so users can’t tell whether they’re resuming, discovering, or deciding. The fix is a layered IA and a carousel differentiation system that (1) clarifies intent per row, (2) varies card size/shape/behavior, and (3) governs ranking & duplication so rows feel purposeful.
What follows is a pragmatic blueprint to ship in phases: taxonomy → IA → 10 archetype rails → dedupe/ranking rules → metrics & experiments.

1) Content taxonomy (entities & attributes)
Define the building blocks so UI can treat them differently.
Entity
Examples
Key attributes for UI
Primary use
Title (Show/Movie)
Series, films
Poster, title, rating, runtime, progress, availability, expiring_at, is_new
Discovery & Decide
Episode
S1E3, highlights
Season/ep, synopsis, progress, next_up
Resume & Decide
Live Event
Games, matches
Start/end, is_live, score/state, starts_in
Now/Next
League/Team
NFL, Yankees
Crest, schedule, standings
Deep dive browse
Channel/Network
ABC, ESPN
Logo, live/next, DVR
Surf & Now/Next
Collection/Pack
“Best of…”, “Clutch plays”
Curator, theme, item_count
Editorial Discovery
Clip/Highlight
Short-form
Duration, source, moment_tag
Fast discovery
Personalized Set
Because you watched X
Anchor seed(s), similarity
Discovery
System Unit
Upsell, promo
plan_id, value_prop
Monetization
Utility
Continue watching
last_position, last_viewed_at
Resume


Of course. Here is the provided text formatted for a clean copy-paste into Google Docs.
Tip: Most formatting like headings, bolding, and lists should transfer correctly. You can replace the --- separators with a horizontal line in Google Docs by going to Insert > Horizontal line.

2) Layered information architecture (Home)
Move from flat to layered. Think of Home as three purposeful bands:
A. Top (utility & intent-setting)
Hero Spotlight (1–2 items max): big, motion-capable; seasonal or “must watch.”
Continue Watching (utility rail): progress bars, “Resume” primary action.
Live Now / Starting Soon: for time-sensitive content with countdowns.
B. Middle (discovery clusters)
Because You Watched… (seeded, editorially capped duplicates)
Trending Near You (geo/time scoped)
New & Noteworthy (recency-weighted)
Collections & Packs (curated themes)
Genre/Mood Hubs (navigational, not just content lists)
C. Bottom (deep catalog & service)
Full Genres (compact grid)
Channels (logo rail with live/next peek)
Upsells/Promos (plan-aware, frequency capped)
Other surfaces: Sports, TV/Movies, For You, Search, each with a smaller subset of the archetype rails below.

3) Carousel archetypes (differentiated rails)
Ten rails that look/feel distinct and map to different jobs:
Hero Spotlight
Full-bleed, auto-preview muted, text-safe overlay.
Use sparingly (≤2 slots). Rotates seasonally or per campaign.
Continue Watching (Utility Rail)
Wide cards with progress bars and Resume as primary.
De-duplicate titles from adjacent discovery rails for one viewport.
Live Now (Ticker Rail)
Slim, horizontally auto-scrolling scoreboard or channel tiles with state badges (LIVE, HT, Q3).
Secondary action: “Go Live”; tertiary: DVR/Start Over.
Starting Soon / Countdown
Cards with start time chips (e.g., “in 12m”), optional notify toggle.
Moves items into Live Now rail at T-0.
Because You Watched X (Editorial Cluster)
Mixed sizes (1 large + 6 medium) to avoid monotony.
Header includes the seed (“Because you watched Hard Knocks”).
New & Noteworthy (Recency Rail)
Badge NEW or Just added; sort = recency with novelty penalty for repeats.
Trending Near You (Social Proof Rail)
Badge Trending; optional small sparkline showing velocity.
Region-aware; weekday/daypart-aware.
Collections / Packs (Stacked Cards)
Stacked card with curator avatar/label (Editor’s Picks, Team Picks).
Tap opens a collection page, not a long horizontal list.
Reels/Highlights (Vertical Short-form)
Reel-style vertical player rail; swipe to advance, long-press for details.
Great for “Clutch plays,” recaps, trailers.
Channel Surf (Logo Chip Rail)
Uniform logo chips with live/next mini-EPG on focus.
Long-press opens channel page; primary action: “Watch Live.”
(Optional advanced rails later: “For You” mosaic, “Deep Dive” accordion, “Expiring Soon.”)
4) Visual differentiation tokens (so rails don’t look the same)
Use a token set that systematically varies rails:
Row header style: icon + label + microcopy (e.g., “Because you watched…”).
Card silhouette: poster (2:3), thumbnail (16:9), square (1:1), stack.
Motion behavior: preview-on-focus (Hero/Trending), static elsewhere.
Metadata overlay: progress bars, badges (LIVE, NEW, 4K, HDR, Expiring), rating.
Accent color per rail (subtle line/label, not full backgrounds).
Action affordances: primary (Play/Resume), secondary (Details), tertiary (Add, Notify).
These cues let users scan the page and instantly know “resume vs discover vs explore vs live.”
5) Ranking, duplication & rail governance
Consistency rules so Home feels curated rather than chaotic:
Max appearances per title on Home: 2 (never within the same viewport).
Priority order for conflicts: Continue Watching > Live/Starting Soon > Personalization > Trending > Collections.
Dedupe window: if a title appears in a higher-priority rail, suppress it from lower-priority rails until the user scrolls past the first rail (viewport-aware).
Editorial caps: limit Personalized rails to N per view; rotate seeds daily.
Cold start: fall back to Trending, New, and Staff Picks; inject an Onboarding Picks mini-rail.
6) Sports-specific layer (ties to your clutch-update vision)
Clutch Moments rail (reel archetype): near-real-time highlights with moment tags (Game-winner, 4th & Long, Buzzer Beater).
Team/League hubs: reusable page pattern with fixtures, standings, VOD, and related packs.
Game page: live state, multi-angle highlights, timeline scrub of key plays.
7) Card & rail specs (concise)
Card sizes:
S (grid),
M (standard poster)
L (landscape hero)
Stack (collections).
Key states: default, focus/hover (preview allowed on select rails), pressed, disabled, watched.
Badges: LIVE (red), NEW, 4K, HDR,
Expiring (date), 
Just added. 
Progress: 2px bar with percentage + “Resume” CTA if >5%.
Preview rules: only Hero, Trending, Reels auto-preview on focus (mute + captions).
Accessibility: visible focus rings, caption-first previews, color contrast, D-pad affordances for TV.
8) Measurement plan (what “good” looks like)
Rail-level KPIs
Viewport reach (% of sessions that see the rail)
Rail CTR (focus → play/details)
Scroll-past rate & dwell time per rail
Unique titles exposure (diversity)
Outcome KPIs
Resume rate (CW)
Starts per session, completion %
Live tune-in rate & pre-game reminders
Monetization (upsell view→start), ad viewability for promos
Quality signals
Duplicate exposure rate on Home
Time-to-content start (from app open)
“I found something to watch” proxy: starts within first 90s
Instrumentation events we will need: rail_impression, rail_visible_ms, rail_header_click, card_focus, card_click_play, card_click_details, card_preview_start, card_preview_ms, duplicate_suppressed, upsell_impression, upsell_click.
9) Experiment backlog (shippable A/Bs)
Continue Watching: wide vs compact (hyp: wide increases resume rate).
Trending: motion preview vs static (hyp: preview ↑ CTR, check bounce).
Collections: stack vs flat rail (hyp: stack ↑ open rate to collection pages).
Dedup rule strictness (1 vs 2 max appearances).
Clutch Reels above the fold (hyp: ↑ short-form starts without hurting long-form).
Row accent color vs monochrome (scan speed & CTR).
11) What this fixes immediately
Users understand what each rail is for (resume vs discover vs live).
Visual sameness is gone via silhouettes, motion policy, headers, and badges.
Dupes feel managed, not random.
You unlock space for sports-specific experiences (clutch reels, live funnels).
🆕 Units we should add explicitly
Editorial Hero with Label
Like Apple News “Food / Featured Recipe”.
Mixes section header + featured card.
Belongs in Editorial Hero rail archetype.
Profile Suggestion Rail
Cards are circular avatars with CTA (Follow).
Equivalent to People Discovery rail.
Distinct from content rails (different entity type).
Sponsored Shop Rail
Product cards + hero ad.
Needs dedicated Commerce/Ad rail archetype with “Shop Now” action.
Can adopt “Expiring Soon” token styling for urgency.
Reels Grid Rail
Instead of horizontal only, supports 3-up vertical scrolling cards (like IG reels module).
Extension of our Reels/Highlights rail.
Note: Most patterns are already covered at the rail level, but some (profile, commerce, editorial hero) should be added explicitly into your archetype library and taxonomy so they’re not just “miscellaneous.” Extend the prototype pack to include these new rail types (Editorial Hero, People Suggestion, Sponsored Shop, Reels Grid), and update the spec so your taxonomy fully covers content, people, and commerce units.



Carousel_prototypes_spec_bundle.zip: This includes the spec document and all visual assets (taxonomy, IA, user flows, differentiation charts) to walk partners through both the rationale and functional details.
Interactive HTML prototypes (open index.html) covering 16 rail types:
Hero, Continue Watching, Live Now, Starting Soon, For You Mosaic, Because You Watched, New & Noteworthy, Trending Near You, Collections & Packs, Highlights & Reels, Channel Surf, Expiring Soon, Editorial Hero, People Suggestion, Sponsored Shop, Reels Grid.
Per-rail demo pages (/demos/), e.g. demos/demo_reels_grid.html – perfect for stakeholder walk-throughs.
Spec in both Markdown (SPEC.md) and HTML (SPEC.html) so you can share or convert easily.
Images (/images/):
Static diagrams: taxonomy.png, ia.png, user_flow.png, differentiation.png
Mock wireframe screenshots for each rail: wire_<rail>.png
Notes
These demos include the behaviors we discussed: viewport-aware de-duplication with priority, experiment toggles, metrics console, and TV/D-pad left/right navigation.

📦 Deliverables
Here’s what we prepared for as a complete, partner-ready package with two tailored versions:
1. Specs (Sports-Heavy & Balanced Mix)
SPEC_sports.md / .html → IA, taxonomy, rail descriptions, all examples drawn from sports (live games, highlights, replays, fantasy integrations, etc.).
SPEC_balanced.md / .html → IA and rails populated with Sports + Shows + Movies + News + Kids to demonstrate breadth of offering.
2. Information Architecture & Taxonomy Images
IA_sports.png → diagram showing sports-forward hierarchy (Live Now, Highlights, Upcoming Games, By League).
IA_balanced.png → taxonomy diagram with Sports, Shows, Movies, News, Kids, My Stuff, etc.
Each diagram annotated with personalized vs editorial vs monetized rails.
3. Functional Prototypes
Interactive HTML demos (two versions):
/demo_sports/ → live rails using mock JSON feeds filled with sports categories.
/demo_balanced/ → mixed JSON feeds across all content types.
Behaviors included:
Scrollable carousels (horizontal, vertical, stacked)
Hover states, “More Info,” “Expand to Grid”
Input handling for arrows, clicks, and swipe simulation
Powered by sample JSON so partners can swap in real data easily.
4. Screenshots
Static PNGs auto-captured from each demo:
Sports examples: live_now_sports.png, nba_highlights.png, upcoming_matches.png
Balanced mix: continue_watching.png, trending_movies.png, news_live.png, etc.
Each image labeled to match the rail spec for easy walkthroughs.
5. Partner-Facing PDF Deck
Styled PDF combining:
Intro (why carousel diversification matters)
IA diagrams (sports vs balanced)
Side-by-side screenshots of prototypes
Rail-by-rail rationale & opportunities (personalization, ad units, editorial curation).
This becomes the leave-behind deck to sell through vision internally & externally.

Audit & Redline Pack
📄 Audit Documents
Audit (Markdown): UI_Audit_and_Rationale.md
Audit (HTML): UI_Audit_and_Rationale.html
Implementation checklist (CSV): implementation_checklist.csv
What’s inside the audit:
Executive summary of the core problem (“visual sameness”), impact, and the strategic direction.
Findings & evidence across nine areas (intent signals, hierarchy, motion policy, dedupe, LIVE vs upcoming, people/commerce mixing, accessibility, copy).
Root causes mapped to rationale for each proposed rail and behavior.
A clear Home IA recommendation and component tokens (visual + behavioral).
A concrete motion/preview policy, ranking & de-dup governance, copy system (headers, badges, meta, CTAs).
Accessibility & TV/D-pad guidance, metrics & instrumentation, and a 90-day experiment plan.
Risks & mitigations, a step-by-step checklist, and a 30/60/90 roadmap.
Appendices with a heuristic scorecard and a current→proposed mapping.

📷 Screenshot Redline Pack
Each screenshot will have:
Raw capture (untouched, just the current UI).
Annotated redline (overlays pointing to issues like: “visual sameness,” “no header hierarchy,” “rail duplication,” “LIVE item placement”).
Proposed direction note (a short caption linking back to the audit rationale, e.g., “Propose: merge duplicate carousels under episodic grouping with inline CTAs”).
Sections:
Home Top Layer – hero, first two carousels.
Mid-layer Sports & General Rows – where duplication and rail fatigue show most.
Mixed Entities Rows – LIVE events, People, Clips, Commerce.
Deep Catalog / Long-tail Rows – scrolling fatigue and missed personalization.
Micro-interactions – hover, focus, autoplay previews, D-pad navigation states.
File Formats:
PNG for each raw + annotated pair.
PDF bundle for sharing as a redline packet.
All screenshots (ZIP): ui_screenshots_10s.zip
APPENDIX
Appendix A — Canonical files & links
conceptual_carousels_v1.zip — conceptual wireframes, IA diagrams, and breakdown
carousel_prototypes_v3_bundle.zip — final prototype+spec bundle (supersedes any “spec_bundle” naming)
carousel_prototypes_v2.zip — earlier interaction baseline
UI_Audit_and_Rationale.md — audit (Markdown)
UI_Audit_and_Rationale.html — audit (HTML)
implementation_checklist.csv — implementation checklist
ui_screenshots_10s.zip — raw screenshots extracted every 10s from MOVs
Partner_Pack_Master_Index.pdf — one-pager index for partner packs
Filename normalization: use carousel_prototypes_v3_bundle.zip (this replaces any references to “Carousel_prototypes_spec_bundle.zip”).

Appendix B — Prototype coverage map (16 rails)
Hero Spotlight
Continue Watching (Utility)
Live Now (Ticker)
Starting Soon / Countdown
For You Mosaic
Because You Watched (Editorial Cluster)
New & Noteworthy (Recency)
Trending Near You (Social Proof)
Collections & Packs (Stacked)
Highlights & Reels (Vertical short-form)
Channel Surf (Logo/mini-EPG)
Expiring Soon
Editorial Hero (labeled hero)
People Suggestion (follow CTA)
Sponsored Shop (commerce rail)
Reels Grid (3-up vertical grid)

Appendix C — Conceptual images shipped
IA_sports.png, IA_balanced.png
Live_Now.png, Highlights_&_Reels.png, By_League.png, For_You.png, Channel_Surf.png, Expiring_Soon.png
Spotlight.png, Continue_Watching.png, New_&_Noteworthy.png
(All included inside conceptual_carousels_v1.zip.)

Appendix D — Redline packet (status & next steps)
Status: Raw captures exported → ui_screenshots_10s.zip.
Next: Overlay annotations (visual sameness, LIVE vs Starting Soon cues, dedupe, header hierarchy) and export a PDF redline packet.
Sections to annotate:
Home Top Layer
Mid-layer Sports & General
Mixed Entities (Live/People/Clips/Commerce)
Deep Catalog
Micro-interactions (hover/focus/D-pad)

Appendix E — Instrumentation quick reference
Events to implement (as referenced in the main body):
rail_impression, rail_visible_ms, rail_header_click
card_focus, card_click_play, card_click_details
card_preview_start, card_preview_ms
duplicate_suppressed
upsell_impression, upsell_click

Appendix F — Experiment backlog snapshot
Continue Watching: wide vs compact
Trending: motion preview vs static
Collections: stack vs flat
Dedup rule strictness (1 vs 2 appearances)
Clutch Reels above the fold
Row accent color vs monochrome

Appendix G — Accessibility & D-pad focus (concise)
Persistent focus ring (2–3px); clear tab order: header → prev/next → track → first card
Left/right advances ~90% viewport width; parity across TV/keyboard
Caption-first previews; color contrast checks for badges and meta

Appendix H — Governance rules (priority & dedupe)
Priority: Continue Watching > Live/Starting Soon > Personalization > Trending > Collections
Viewport-aware dedupe: suppress lower-priority duplicates until the higher-priority rail scrolls out of view
Caps: limit personalized rails per view; rotate seeds daily; Home max two appearances per title (not within same viewport)
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
Detailed Briefing Document: Carousel Revitalization
Executive Summary
The core problem identified across the provided sources is low differentiation in the current UI's carousels and rails. "Your core issue isn’t just 'too many carousels'—it’s undifferentiated rails and flat information architecture. Everything looks and behaves the same, so users can’t tell whether they’re resuming, discovering, or deciding." (Carousel Revs-2.pdf, Executive Summary). This visual sameness leads to reduced scannability, discovery, content throughput, and engagement, resulting in "decision fatigue" and a perception of a smaller, repetitive content pool.
The proposed solution is a differentiated rail system that "clarifies intent per row, varies card size/shape/behavior, and governs ranking & duplication so rows feel purposeful" (Carousel Revs-2.pdf, Executive Summary). This system aims to provide consistent inputs and semantics, implement viewport-aware deduplication, and utilize rail-specific visual tokens to convey intent at a glance.
The pragmatic blueprint for implementation involves a phased approach: taxonomy → IA → 10 archetype rails → dedupe/ranking rules → metrics & experiments.
Main Themes and Most Important Ideas/Facts
1. The Core Problem: Lack of Differentiation and Flat IA
Visual Sameness: The most frequently cited issue is that "All carousels look the same → users can’t tell what’s different (e.g., 'Trending,' 'New Releases,' 'For You' blur together)." (Carousel Revs.pdf, Step 2). Cards, silhouettes, density, and metadata are uniform, making distinct intents (resume, live, upcoming, pack, channel) "look identical." (Carousel Revs-4.pdf, Findings).
Undifferentiated Rails & Flat IA: The current architecture lacks layered organization, leading to a "flat 'endless carousel' model" where "every entity (show, category, pack, recommendation) collapses into the same UI pattern." (Carousel Revs.pdf, Step 2 & Carousel Revs-2.pdf, Executive Summary).
Underpowered Intent Signals: Crucial information like "LIVE, Expiring, New/Recency, Progress are not clearly distinguishable or consistently placed," leaving users unsure "What should I do now?" at the per-card level. (Carousel Revs-4.pdf, Findings).
Duplication & Redundancy: The same title often appears in multiple rails without suppression, making the "perceived content pool feel smaller and repetitive." (Carousel Revs-4.pdf, Findings).
2. The Solution: A Differentiated Rail System
The proposed system addresses the core problems by introducing:
Layered Information Architecture (IA): Home will be structured into three purposeful bands:
Top (Utility & Intent-Setting): "Hero Spotlight (1–2 items max)," "Continue Watching (utility rail)," and "Live Now / Starting Soon" (Carousel Revs-2.pdf, Layered Information Architecture). This provides immediate utility and sets user intent.
Middle (Discovery Clusters): Includes "Because You Watched…," "Trending Near You," "New & Noteworthy," "Collections & Packs," and "Genre/Mood Hubs." (Carousel Revs-2.pdf, Layered Information Architecture).
Bottom (Deep Catalog & Service): Features "Full Genres," "Channels," and "Upsells/Promos." (Carousel Revs-2.pdf, Layered Information Architecture).
This layering "solves the sameness problem and helps users instantly know what kind of browsing they’re doing." (Carousel Revs.pdf, Step 5).
Content Taxonomy: Defining "building blocks so UI can treat them differently" (Carousel Revs-2.pdf, Content taxonomy). Examples include Title, Episode, Live Event, League/Team, Channel/Network, Collection/Pack, Clip/Highlight, Personalized Set, and System Unit (e.g., Upsell). Each entity has "Key attributes for UI" and a "Primary use." (Carousel Revs-2.pdf, Content taxonomy).
Carousel Archetypes (Differentiated Rails): Ten distinct rails are proposed, each with a unique look, feel, and purpose:
Hero Spotlight: "Full-bleed, auto-preview muted, text-safe overlay." (Carousel Revs-2.pdf, Carousel archetypes).
Continue Watching (Utility Rail): "Wide cards with progress bars and Resume as primary." (Carousel Revs-2.pdf, Carousel archetypes).
Live Now (Ticker Rail): "Slim, horizontally auto-scrolling scoreboard or channel tiles." (Carousel Revs-2.pdf, Carousel archetypes).
Starting Soon / Countdown: "Cards with start time chips (e.g., 'in 12m'), optional notify toggle." (Carousel Revs-2.pdf, Carousel archetypes).
Because You Watched X (Editorial Cluster): "Mixed sizes (1 large + 6 medium) to avoid monotony." (Carousel Revs-2.pdf, Carousel archetypes).
New & Noteworthy (Recency Rail): Features a "Badge NEW or Just added." (Carousel Revs-2.pdf, Carousel archetypes).
Trending Near You (Social Proof Rail): Has a "Badge Trending; optional small sparkline showing velocity." (Carousel Revs-2.pdf, Carousel archetypes).
Collections / Packs (Stacked Cards): "Stacked card with curator avatar/label." (Carousel Revs-2.pdf, Carousel archetypes).
Reels/Highlights (Vertical Short-form): "Reel-style vertical player rail; swipe to advance." (Carousel Revs-2.pdf, Carousel archetypes).
Channel Surf (Logo Chip Rail): "Uniform logo chips with live/next mini-EPG on focus." (Carousel Revs-2.pdf, Carousel archetypes).
Additional "new" units explicitly added include "Editorial Hero with Label," "Profile Suggestion Rail," "Sponsored Shop Rail," and "Reels Grid Rail" (Carousel Revs-2.pdf, Units we should add explicitly).
Visual Differentiation Tokens: A systematic token set to vary rails includes: "Row header style," "Card silhouette," "Motion behavior," "Metadata overlay," "Accent color per rail," and "Action affordances." These cues "let users scan the page and instantly know 'resume vs discover vs explore vs live.'" (Carousel Revs-2.pdf, Visual differentiation tokens).
Ranking, Duplication & Rail Governance:Max Appearances: "Max appearances per title on Home: 2 (never within the same viewport)." (Carousel Revs-2.pdf, Ranking, duplication & rail governance).
Priority Order: "Continue Watching > Live/Starting Soon > Personalization > Trending > Collections." (Carousel Revs-2.pdf, Ranking, duplication & rail governance). This is detailed further as "Continue Watching > Live Now > Starting Soon > For You Mosaic > Because You Watched > New & Noteworthy > Trending > Collections/Packs > Reels/Highlights > Channel Surf > Expiring Soon." (Carousel Revs-4.pdf, Ranking & De-dup Governance).
Dedupe Window/Ownership: "If a title appears in a higher-priority rail, suppress it from lower-priority rails until the user scrolls past the first rail (viewport-aware)." (Carousel Revs-2.pdf, Ranking, duplication & rail governance). An "ownership rule" states the "first rail in priority to present a title claims it; others suppress or show explainer microcopy ('Also in For You')." (Carousel Revs-4.pdf, Ranking & De-dup Governance).
3. Sports-Specific Enhancements
The vision includes specific enhancements for sports content, aligning with the "clutch-update vision":
Clutch Moments Rail: Utilizes the "reel archetype" for "near-real-time highlights with moment tags (Game-winner, 4th & Long, Buzzer Beater)." (Carousel Revs-2.pdf, Sports-specific layer).
Team/League Hubs: Reusable page patterns with "fixtures, standings, VOD, and related packs." (Carousel Revs-2.pdf, Sports-specific layer).
Game Page: Features "live state, multi-angle highlights, timeline scrub of key plays." (Carousel Revs-2.pdf, Sports-specific layer).
4. Implementation & Measurement
Deliverables: A comprehensive "partner-ready package" includes:
Specs: SPEC_sports.md/.html (sports-forward) and SPEC_balanced.md/.html (mixed content).
IA & Taxonomy Images: IA_sports.png and IA_balanced.png diagrams.
Functional Prototypes: Interactive HTML demos (/demo_sports/ and /demo_balanced/) showcasing behaviors like "Scrollable carousels," "Hover states," and "Input handling."
Screenshots: Static PNGs auto-captured from demos.
Partner-Facing PDF Deck: A styled PDF for internal and external communication. (Carousel Revs-3.pdf, Deliverables).
Audit & Redline Pack: Contains a detailed UI_Audit_and_Rationale.md/.html outlining findings, root causes, and rationale for proposals, along with a implementation_checklist.csv and annotated screenshot "Redline Pack" to highlight current issues and proposed solutions. (Carousel Revs-3.pdf, Audit & Redline Pack).
Measurement Plan: Key Performance Indicators (KPIs) are defined at both the "Rail-level" (e.g., "Viewport reach," "Rail CTR") and "Outcome KPIs" (e.g., "Resume rate," "Starts per session," "Live tune-in rate"). "Quality signals" such as "Duplicate exposure rate on Home" and "Time-to-content start" are also crucial. (Carousel Revs-2.pdf, Measurement plan).
Experiment Backlog: A list of "shippable A/Bs" for testing hypotheses, including "Continue Watching: wide vs compact," "Trending: motion preview vs static," and "Dedup rule strictness (1 vs 2 max appearances)." (Carousel Revs-2.pdf, Experiment backlog).
Roadmap: A 30/60/90-day plan outlines immediate implementations (CW, Live Now, Starting Soon, For You, dedupe, metrics) followed by additions (Collections, Expiring, Channel Surf) and finally advanced units (Reels Grid, People/Shop). (Carousel Revs-4.pdf, Roadmap).
Immediate Fixes and Benefits
Implementing these changes will immediately result in:
Clarity for Users: "Users understand what each rail is for (resume vs discover vs live)." (Carousel Revs-2.pdf, What this fixes immediately).
Visual Variety: "Visual sameness is gone via silhouettes, motion policy, headers, and badges." (Carousel Revs-2.pdf, What this fixes immediately).
Managed Duplication: "Dupes feel managed, not random." (Carousel Revs-2.pdf, What this fixes immediately).
Enhanced Sports Experience: "You unlock space for sports-specific experiences (clutch reels, live funnels)." (Carousel Revs-2.pdf, What this fixes immediately).
This comprehensive approach moves beyond simply fixing friction points to creating a "structured, differentiated, and scalable" user experience. (Carousel Revs.pdf, Introduction).


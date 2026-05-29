# Proposal Animation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive romantic proposal website with bright painterly animated scenery, six-question quiz, story flow, two-photo gallery, and proposal climax.

**Architecture:** Create a dependency-free static web app with `index.html`, `styles.css`, and `script.js`. Use CSS for layout and painterly surfaces, and Canvas for continuous seasonal particles and depth effects.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Canvas 2D, browser Web Share API fallback.

---

### Task 1: App Shell And Content

**Files:**
- Create: `index.html`

- [ ] Create five semantic sections: landing, quiz, story, gallery, proposal.
- [ ] Include Thai copy, six quiz questions, six story scenes, two gallery frames, and proposal buttons.
- [ ] Add one full-screen canvas with `id="motion-canvas"` behind all scenes.

### Task 2: Responsive Painterly Styling

**Files:**
- Create: `styles.css`

- [ ] Add design tokens for bright paint art: gold, coral, sky blue, lavender, violet, night ink.
- [ ] Style each page as a full viewport scene with responsive spacing.
- [ ] Add brush reveal, painterly backgrounds, oil-painting frames, glow buttons, and mobile-specific layout.
- [ ] Keep gallery to two angled frames with depth and overlap.

### Task 3: State And Flow Behavior

**Files:**
- Create: `script.js`

- [ ] Implement section navigation with `showScene(sceneName)`.
- [ ] Implement landing scroll mood changes and click-to-quiz.
- [ ] Implement quiz choice selection, next button, completion flash, and story transition.
- [ ] Implement story Next button through six scenes.
- [ ] Implement gallery hover/tap burst particles.
- [ ] Implement proposal evasive button and accept celebration.

### Task 4: README Handoff

**Files:**
- Create: `README.md`

- [ ] Document how to open the site.
- [ ] Document how to replace the two gallery photos.
- [ ] Document the full flow for another AI.
- [ ] Document future upgrade options: Framer, Rive, Lottie, Three.js, Vercel.

### Task 5: Verification

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `README.md`

- [ ] Open the website locally.
- [ ] Check desktop and mobile responsive layouts.
- [ ] Click through landing, quiz, story, gallery, and proposal.
- [ ] Confirm the secondary button has desktop and mobile evasive behavior.
- [ ] Confirm accept celebration, share fallback, and download behavior.

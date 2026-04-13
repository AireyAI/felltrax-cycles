# Felltrax Cycles — Full Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform single-page Felltrax Cycles site into a multi-page mountain bike platform with shop, booking, trail map, 3D viewer, Strava integration, and dark/light mode.

**Architecture:** Multi-page static site with shared nav/footer partials loaded via JS includes. Each page is a standalone HTML file using the same Tailwind config, design tokens, and animation toolkit. Interactive features (3D viewer, trail map, booking calendar) are self-contained JS modules.

**Tech Stack:** HTML/CSS/Tailwind CDN, GSAP animations, Mapbox GL JS (trail map), Three.js (3D bike viewer), Strava API, Veo3 (video generation), Nano Banana (image generation)

---

## Phase 1: Multi-Page + Dark Mode

### Task 1: Create shared components system
**Files:**
- Create: `components/nav.html`
- Create: `components/footer.html`
- Create: `js/includes.js`
- Modify: `index.html`

Extract nav and footer into reusable HTML partials. Create a simple JS include system that loads them into each page.

### Task 2: Create page templates
**Files:**
- Create: `shop.html`
- Create: `trails.html`
- Create: `booking.html`
- Modify: `index.html` (update nav links)

Each page loads shared nav/footer, has its own content, same Tailwind config and animation toolkit.

### Task 3: Dark/Light mode toggle
**Files:**
- Modify: `components/nav.html` (add toggle button)
- Create: `js/theme.js`
- Modify: all pages (add light mode CSS tokens)

CSS custom properties swap via `[data-theme="light"]`. Toggle in nav, persists via localStorage. Respects `prefers-color-scheme` on first visit.

---

## Phase 2: Shop & Product Pages

### Task 4: Shop page — bike category grid
**Files:**
- Modify: `shop.html`
- Create: `js/shop.js`

Filterable grid of all bikes. Categories: Trail, Enduro, Downhill, E-MTB. Each card links to product detail page. Generate additional Nano Banana images for more bike models.

### Task 5: Individual product pages
**Files:**
- Create: `product.html` (template loaded via query param)
- Create: `js/product.js`
- Create: `data/bikes.json` (all bike data)

Product detail page with image gallery, specs table, sizing chart, geometry diagram, "Enquire Now" CTA. Data-driven from JSON.

---

## Phase 3: Interactive Trail Map + Videos

### Task 6: Mapbox trail map
**Files:**
- Modify: `trails.html`
- Create: `js/trail-map.js`
- Create: `data/trails.json`

Full-screen Mapbox map with trail markers. Click marker → trail detail card with difficulty, distance, elevation, photos. Trail data in JSON.

### Task 7: Generate Veo3 trail videos
Generate one Veo3 video per trail (Whinlatter, Grizedale, Skiddaw) and add to trail cards.

---

## Phase 4: Booking System

### Task 8: Booking page with calendar
**Files:**
- Modify: `booking.html`
- Create: `js/booking.js`

Service type selector (fitting, servicing, suspension setup), date picker calendar, time slot grid, contact details form, confirmation screen. Frontend-only for now (form submission).

---

## Phase 5: 3D Bike Viewer + Strava

### Task 9: Three.js bike viewer
**Files:**
- Modify: `product.html`
- Create: `js/bike-viewer.js`
- Add: `models/bike.glb`

Interactive 3D model on product pages. Orbit controls, zoom, auto-rotate. Dark background matching site aesthetic.

### Task 10: Strava integration
**Files:**
- Create: `js/strava.js`
- Modify: `trails.html`

Show recent local rides, popular segments near each trail, leaderboard widget. Uses Strava API embed widgets.

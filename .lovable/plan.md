# NJM OS — Alineación con Estándar UI 2026

## Audit: What's Already Implemented vs. What's Missing

After reviewing the entire codebase against your 4-pillar spec, here's the status:

### Already Implemented (Compliant)

- Workspace architecture with multi-level routing (Hub / CEO / PM / Libro Vivo / Settings)
- Zero chat interfaces -- all dashboard-centric with cards and status indicators
- Persistent sidebar navigation with context awareness
- Slide-over (Sheet) for document viewing without leaving the dashboard
- Contextual Drag & Drop in DataIngestionModal tied to specific vectors
- Asymmetric approval buttons (green "Aprobar y Guardar" vs neutral "Proponer Ajustes")
- Execution Console with step-by-step terminal logs (done/active/pending)
- Status semaphore cards (red = pending, green = validated)
- Inter font for dashboards
- Agent-specific color accents (purple = CEO, emerald = PM)

### Gaps to Close


| Gap                                                                               | Pillar           | Priority |
| --------------------------------------------------------------------------------- | ---------------- | -------- |
| Fira Code font not loaded (fallback to system mono)                               | 4. Design System | High     |
| No dark mode toggle -- spec calls for slate-950 corporate dark mode               | 4. Design System | High     |
| Execution Console uses `font-mono` but actual monospace font isn't loaded via CDN | 4. Design System | Medium   |
| Document Sheet editor area uses `font-mono` without proper font                   | 4. Design System | Medium   |
| Settings page lacks dark mode toggle                                              | 4. Design System | Medium   |


---

## Plan: 2 Targeted Changes

### 1. Load Fira Code via Google Fonts

Add Fira Code to the existing Google Fonts import in `index.css`. Update `tailwind.config.ts` to prioritize it in `fontFamily.mono`.

**Files**: `src/index.css` (add to @import), `tailwind.config.ts` (reorder mono stack)

### 2. Dark Mode Support with Toggle

Add a `.dark` variant of all CSS variables in `index.css` using the slate-950 palette the user specified. Add a "Tema" tab or toggle to the Settings page. Persist preference in localStorage. Apply `class="dark"` to `<html>` element.

**CSS variables for dark mode** (in `index.css`):

- `--background: la misma imagen del fondo pero de noche`
- `--foreground: 210 20% 90%`
- `--card: 222 40% 8%`
- Cards, surfaces, glass tokens all shift to dark variants
- Agent accent colors remain the same (purple CEO, emerald PM)

**Files**:

- `src/index.css` -- add `.dark` root variables
- `src/components/njm/SettingsView.tsx` -- add dark mode toggle in header or new tab
- `src/context/BrandContext.tsx` or new `ThemeContext` -- manage theme state + localStorage persistence
- `src/index.css` -- update glass utilities to work with both themes

### Summary

Only 2 meaningful gaps exist: monospace font loading and dark mode. Everything else in the 4-pillar spec is already implemented. Total files to create/modify: ~4.


# UX Polish — Toasts, Skeletons, Empty States & Tooltips

## Audit of Current State

- **Sonner toasts**: Already installed and used across Settings, CEO, PM, and DataIngestionModal. All key actions already have toast feedback.
- **WorkspaceSkeleton**: Already exists at `src/components/njm/WorkspaceSkeleton.tsx` for generic card loading.
- **Tooltips**: Shadcn Tooltip already used in PM workspace for artifact status/framework info.

## What's Missing

| Gap | Description |
|-----|-------------|
| Hub Empty State | No visual feedback when all brands are filtered out or list is empty |
| Dashboard Skeleton for Hub | WorkspaceSkeleton exists but isn't wired into the Hub view |
| Strategic Term Tooltips | CEO vectors and PM artifacts reference frameworks (Ansoff, Porter, OKR, Jobs-to-be-Done) with no contextual definitions |

## Plan (3 changes)

### 1. Empty State Component + Hub Integration

Create a reusable `EmptyState` component with a Lucide icon, title, description, and optional CTA button. Integrate it into `AgencyHubView.tsx` to show when filtered brands list is empty (both for "no brands at all" and "no matches for current filter").

**Files**: Create `src/components/njm/EmptyState.tsx`, modify `AgencyHubView.tsx`

### 2. Skeleton Loading Simulation in Hub

Add a brief simulated loading state to `AgencyHubView` using the existing `WorkspaceSkeleton` component. This creates the infrastructure for real API loading states later.

**Files**: Modify `AgencyHubView.tsx`

### 3. Strategic Term Tooltips in CEO & PM

Add contextual `<Tooltip>` components next to strategic terms:

- **CEO workspace**: Add info icon with tooltip next to vector category labels (Core, Business, Brand, Growth) explaining what each category covers.
- **PM workspace**: Add tooltip definitions next to artifact framework names (Ansoff Matrix, Lean Canvas, Porter's Five Forces, OKR Framework, NOW-NEXT-LATER, GTM Playbook, Jobs-to-be-Done).

Definitions will be stored in a small lookup map. Tooltips use the existing Shadcn Tooltip with `glass-strong border-none` styling for dark mode consistency.

**Files**: Modify `CEOWorkspaceView.tsx`, `PMWorkspaceView.tsx`

---

Total: 1 new file, 3 modified files. No new dependencies.


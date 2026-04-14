

# NJM OS — Next Phase Recommendations

Based on a full audit of the current codebase, here are the 5 highest-impact improvements to implement next, ordered by priority.

---

## 1. Activity Feed / Notification Center

**Problem**: Users have no visibility into what happened across brands without clicking into each one. There's no cross-brand activity awareness.

**Solution**: Add a notification bell icon in the sidebar and an Activity Feed panel (Sheet/Drawer) that shows recent agent actions across all brands.

**Implementation**:
- Add `ActivityFeedDrawer.tsx` component using Shadcn Sheet
- Add notification state to BrandContext (mock data: "CEO validated 3 vectors for NovaTech", "PM generated Business Case for Agencia-Disrupt")
- Add bell icon with badge counter in AppSidebar
- Feed items grouped by timestamp with agent color coding (purple for CEO actions, emerald for PM)

**Files**: Create `ActivityFeedDrawer.tsx`, modify `AppSidebar.tsx`, `BrandContext.tsx`

---

## 2. Brand Detail / Overview Page

**Problem**: Clicking a brand in the Hub jumps directly to the CEO workspace. There's no intermediate overview showing the brand's overall health, recent activity, and quick access to all workspaces.

**Solution**: Create a Brand Overview page at `/brand/:id` that serves as a landing page before diving into CEO or PM.

**Implementation**:
- Create `BrandOverviewPage.tsx` with: health score ring, vector completion progress, list of recent artifacts, quick-nav cards to CEO/PM/Libro Vivo
- Update Hub card clicks to navigate to `/brand/:id` instead of `/brand/:id/ceo`
- Add route in App.tsx

**Files**: Create `BrandOverviewView.tsx`, `BrandOverviewPage.tsx`, modify `AgencyHubView.tsx`, `App.tsx`

---

## 3. Search & Filter for Hub and Workspaces

**Problem**: With 5+ brands and 8+ vectors per brand, there's no way to search or filter content. As data grows this becomes unusable.

**Solution**: Add a search bar to the Hub header (filter brands by name/sector/status) and a filter toolbar to the CEO workspace (filter vectors by category or validation status).

**Implementation**:
- Add search input with Lucide `Search` icon in `AgencyHubView.tsx` header
- Filter brands client-side by name, sector, and status
- Add category filter chips in `CEOWorkspaceView.tsx` (All, Core, Business, Brand, Growth)
- Add status filter toggle (Validated / Pending / All)

**Files**: Modify `AgencyHubView.tsx`, `CEOWorkspaceView.tsx`

---

## 4. Export / Download Functionality

**Problem**: The PM workspace shows artifacts (Business Case, OKRs, Roadmap) but there's no way to export or download them. For a corporate tool this is essential.

**Solution**: Add export buttons to the DocumentSheet and Libro Vivo viewer that generate downloadable files.

**Implementation**:
- Add "Download as Markdown" button in `DocumentSheet.tsx` using Blob + URL.createObjectURL
- Add "Export Libro Vivo" button in `LibroVivoViewer.tsx` header that generates a structured .md file with all vectors and PM matrix
- Use toast feedback on export success

**Files**: Modify `DocumentSheet.tsx`, `LibroVivoViewer.tsx`

---

## 5. Keyboard Shortcuts & Command Palette

**Problem**: Power users (agency operators) need fast navigation. Currently everything requires mouse clicks.

**Solution**: Add a Command Palette (Cmd+K) using the existing Shadcn `Command` component for quick navigation between brands, workspaces, and actions.

**Implementation**:
- Create `CommandPalette.tsx` using Shadcn `CommandDialog`
- Register global `Cmd+K` / `Ctrl+K` listener
- Commands: navigate to any brand, switch workspace (CEO/PM/Libro Vivo), open settings, trigger audit, logout
- Show keyboard shortcut hint in sidebar footer

**Files**: Create `CommandPalette.tsx`, modify `AppLayout.tsx`, `AppSidebar.tsx`

---

## Execution Order

1. **Search & Filter** (quick win, improves usability immediately)
2. **Brand Overview Page** (better information architecture)
3. **Activity Feed** (cross-brand visibility)
4. **Export/Download** (production requirement for corporate users)
5. **Command Palette** (power-user polish)

## Summary

| Change | Type | Files |
|--------|------|-------|
| Search & Filter | Modify 2 | `AgencyHubView.tsx`, `CEOWorkspaceView.tsx` |
| Brand Overview | Create 2, Modify 2 | New views + `App.tsx`, `AgencyHubView.tsx` |
| Activity Feed | Create 1, Modify 2 | `ActivityFeedDrawer.tsx` + sidebar + context |
| Export/Download | Modify 2 | `DocumentSheet.tsx`, `LibroVivoViewer.tsx` |
| Command Palette | Create 1, Modify 2 | `CommandPalette.tsx` + layout + sidebar |

Total: ~5 new files, ~6 modified. No new dependencies -- everything uses existing Shadcn components and Tailwind utilities.


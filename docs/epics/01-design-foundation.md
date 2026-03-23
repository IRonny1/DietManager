# Epic 01 — Design Foundation

**Must be completed before any other epic.** All UI work depends on having consistent design tokens.

## Goal

Align the app's design tokens (colors, typography, spacing) with the Pencil design system in `diet-manager.pen`. The existing code uses a green palette that is close but not precise — this epic nails it down so every subsequent epic builds on the correct foundation.

## Design Source of Truth

File: `diet-manager.pen`
- Primary green: `#4CAF50` (used for buttons, active states, progress indicators)
- Background page: light neutral (near white)
- Font primary: near black
- Font secondary: medium gray
- Design uses a clean, minimal Material-adjacent style with rounded corners (40px on phone frames, ~12px on cards)

To extract exact values, use the Pencil MCP tool:
```
mcp__pencil__get_variables({ filePath: "diet-manager.pen" })
```

## Tasks

### 1. Extract design tokens from Pencil
- Run `get_variables()` on `diet-manager.pen` to get all CSS custom property values
- Document every color, spacing, and typography variable

### 2. Update `mobile/constants/Colors.ts`
- Replace current color definitions with exact Pencil values
- Use semantic names that match Pencil variables (e.g. `bgPage`, `fontPrimary`, `fontSecondary`, `divider`)
- Keep light/dark mode structure if the design supports it; otherwise default to light only

### 3. Update `mobile/constants/paperTheme.ts`
- Update React Native Paper theme colors to use the new palette
- Set `primary` to the Pencil primary green
- Set `background`, `surface`, `text`, `placeholder` to match Pencil tokens
- Set `roundness` to match card/button corner radius from design

### 4. Create `mobile/constants/typography.constants.ts`
```typescript
export const FONT_SIZE = {
  XS: 11,
  SM: 13,
  MD: 15,
  LG: 17,
  XL: 20,
  XXL: 24,
  DISPLAY: 32,
} as const;

export const FONT_WEIGHT = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

export const LINE_HEIGHT = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.75,
} as const;
```

### 5. Create `mobile/constants/spacing.constants.ts`
```typescript
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
} as const;

export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  FULL: 9999,
} as const;
```

### 6. Audit existing reusable components
Review each component and note which need visual updates in later epics:
- `components/ChipSelector.tsx` — check active/inactive colors match Pencil chips
- `components/NumericInput.tsx` — check border, focus state colors
- `components/UnitToggle.tsx` — check toggle colors
- `components/IllustratedCard.tsx` — check background, border radius

**Do not modify component logic** — just note visual discrepancies as comments or a separate audit note.

## Files to Modify

```
mobile/constants/Colors.ts
mobile/constants/paperTheme.ts
mobile/constants/typography.constants.ts  ← new
mobile/constants/spacing.constants.ts     ← new
```

## Verification

- `npx tsc --noEmit` passes with no errors
- Take a screenshot of an existing screen (e.g. Login) in simulator — colors should feel warmer/more accurate to design
- Cross-reference `get_variables()` output vs `Colors.ts` values — all should match

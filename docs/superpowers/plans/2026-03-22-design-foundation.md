# Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `mobile/constants/` design tokens (colors, typography, spacing) with the exact values from `diet-manager.pen`.

**Architecture:** Extract tokens from the Pencil file, update `Colors.ts` and `paperTheme.ts` with corrected values, then create two new constant files (`typography.constants.ts`, `spacing.constants.ts`) following the project's `camelCase.constants.ts` naming convention. The old `palette.divider` key is kept as a deprecated alias pointing to the new `border` value so that existing components compile without modification. Audit four reusable components for visual discrepancies without modifying their logic.

**Tech Stack:** React Native, React Native Paper (MD3), TypeScript, Pencil MCP (`mcp__pencil__get_variables`)

---

## Task 0: Verify Pencil token table is current

**Files:** none (verification only)

- [ ] **Step 1: Confirm token values match `diet-manager.pen`**

The token table below was extracted at plan-writing time. Before implementing, run:

```
mcp__pencil__get_variables({ filePath: "diet-manager.pen" })
```

Compare the result against the table. If any values differ, update the table and the corresponding code samples in Tasks 1–4 before proceeding.

---

## Pencil Token Reference (already extracted)

| Pencil variable       | Value     | Semantic name       |
|-----------------------|-----------|---------------------|
| `--primary`           | `#4CAF50` | primary             |
| `--primary-dark`      | `#388E3C` | primaryDark         |
| `--primary-light`     | `#E8F5E9` | primaryLight        |
| `--secondary`         | `#FF9800` | secondary           |
| `--secondary-light`   | `#FFF3E0` | secondaryLight      |
| `--accent`            | `#2196F3` | accent              |
| `--error`             | `#F44336` | error               |
| `--bg-page`           | `#FFFFFF` | bgPage              |
| `--bg-card`           | `#F4F4F5` | bgCard              |
| `--bg-dark`           | `#000000` | bgDark              |
| `--bg-muted`          | `#27272A` | bgMuted             |
| `--text-primary`      | `#000000` | textPrimary         |
| `--text-secondary`    | `#71717A` | textSecondary       |
| `--text-tertiary`     | `#A1A1AA` | textTertiary        |
| `--text-disabled`     | `#D4D4D8` | textDisabled        |
| `--text-inverted`     | `#FFFFFF` | textInverted        |
| `--border`            | `#E5E5E5` | border              |
| `--border-strong`     | `#E4E4E7` | borderStrong        |
| `--border-subtle`     | `#F4F4F5` | borderSubtle        |
| `--carbs`             | `#4CAF50` | carbs               |
| `--fat`               | `#FF9800` | fat                 |
| `--protein`           | `#2196F3` | protein             |
| `--white`             | `#FFFFFF` | white               |
| *(not in Pencil)*     | `#000000` | black               |
| `--radius-card`       | `16`      | —                   |
| `--radius-pill`       | `32`      | —                   |
| `--spacing-sm`        | `12`      | —                   |
| `--spacing-md`        | `16`      | —                   |
| `--spacing-section`   | `32`      | —                   |

**Current Colors.ts discrepancies to fix:**
- `primaryLight`: `#81C784` → `#E8F5E9`
- `secondaryLight`: `#FFB74D` → `#FFF3E0`
- `backgroundLight`: `#F5F5F5` → split to `bgPage: #FFFFFF` / `bgCard: #F4F4F5`
- `textPrimary`: `#212121` → `#000000`
- `textSecondary`: `#757575` → `#71717A`
- `divider`: `#BDBDBD` → value updated to `#E5E5E5` (the Pencil `--border` value). Note the spec lists `divider` as an example semantic name — the key is **retained as a deprecated alias** pointing to the same value as `border`. This avoids modifying any components (honoring the spec's "do not modify component logic" directive). Components using `palette.divider` will automatically get the corrected color value.
- `surface`, `backgroundLight` → **removed** from palette; check for other usages before applying (grep step in Task 1)
- `black: '#000000'` → retained in palette (not a Pencil variable) as a utility constant used by dark mode and screens; kept to avoid breaking existing usages.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `mobile/constants/Colors.ts` | Modify | Update palette to exact Pencil values + add new semantic tokens |
| `mobile/constants/paperTheme.ts` | Modify | Align Paper theme with new palette + set roundness |
| `mobile/constants/typography.constants.ts` | Create | FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT constants |
| `mobile/constants/spacing.constants.ts` | Create | SPACING, BORDER_RADIUS constants |

---

## Task 1: Update `Colors.ts`

**Files:**
- Modify: `mobile/constants/Colors.ts`

- [ ] **Step 1: Check for usages of removed palette keys**

Before replacing the file, grep for references to the two fully removed palette keys (`surface`, `backgroundLight`) across the mobile directory:

```bash
grep -rn "palette\.\(surface\|backgroundLight\)\|palette\[.\(surface\|backgroundLight\).\]\|const {[^}]*\b\(surface\|backgroundLight\)\b" mobile/
```

Note: `palette.divider` is NOT being removed — it will be retained as a deprecated alias, so no grep for it is needed.

If any files reference `palette.surface` or `palette.backgroundLight` outside of `Colors.ts` itself, list them and plan manual fixes before proceeding.

- [ ] **Step 2: Replace Colors.ts content**

Replace the entire file with:

```typescript
export const palette = {
  // Brand
  primary: '#4CAF50',
  primaryLight: '#E8F5E9',
  primaryDark: '#388E3C',
  secondary: '#FF9800',
  secondaryLight: '#FFF3E0',
  accent: '#2196F3',
  error: '#F44336',

  // Backgrounds
  bgPage: '#FFFFFF',
  bgCard: '#F4F4F5',
  bgDark: '#000000',
  bgMuted: '#27272A',

  // Text
  textPrimary: '#000000',
  textSecondary: '#71717A',
  textTertiary: '#A1A1AA',
  textDisabled: '#D4D4D8',
  textInverted: '#FFFFFF',

  // Borders
  border: '#E5E5E5',
  borderStrong: '#E4E4E7',
  borderSubtle: '#F4F4F5',
  /** @deprecated use `border` — kept as alias until components are migrated */
  divider: '#E5E5E5',

  // Macros
  carbs: '#4CAF50',
  fat: '#FF9800',
  protein: '#2196F3',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
} as const;

const Colors = {
  light: {
    text: palette.textPrimary,
    background: palette.bgPage,
    surface: palette.bgCard,
    tint: palette.primary,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondary,
    tabIconDefault: palette.textTertiary,
    tabIconSelected: palette.primary,
  },
  dark: {
    text: palette.textInverted,
    background: palette.bgDark,
    surface: palette.bgMuted,
    tint: palette.primaryLight,
    accent: palette.accent,
    error: palette.error,
    secondary: palette.secondaryLight,
    tabIconDefault: palette.textTertiary,
    tabIconSelected: palette.textInverted,
  },
} as const;

export default Colors;
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors. `palette.divider` is still present as a deprecated alias so existing components compile without changes.

- [ ] **Step 4: Commit**

```bash
git add mobile/constants/Colors.ts
git commit -m "feat(design): update Colors.ts with exact Pencil design tokens"
```

---

## Task 2: Update `paperTheme.ts`

**Files:**
- Modify: `mobile/constants/paperTheme.ts`

- [ ] **Step 1: Replace paperTheme.ts content**

Replace the entire file with:

```typescript
import { MD3LightTheme } from 'react-native-paper';

import { palette } from './Colors';

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.textInverted,
    background: palette.bgPage,
    surface: palette.bgCard,
    onSurface: palette.textPrimary,
    onSurfaceVariant: palette.textSecondary,
    outline: palette.border,
    error: palette.error,
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add mobile/constants/paperTheme.ts
git commit -m "feat(design): update paperTheme with Pencil colors and roundness=16"
```

---

## Task 3: Create `typography.constants.ts`

**Files:**
- Create: `mobile/constants/typography.constants.ts`

- [ ] **Step 1: Create the file**

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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add mobile/constants/typography.constants.ts
git commit -m "feat(design): add typography.constants.ts with FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT"
```

---

## Task 4: Create `spacing.constants.ts`

**Files:**
- Create: `mobile/constants/spacing.constants.ts`

- [ ] **Step 1: Create the file**

Note: `SPACING.SM=8` and `SPACING.MD=12` are the standard scale; Pencil's `--spacing-sm=12` and `--spacing-md=16` map to `SPACING.MD` and `SPACING.LG` respectively. The full scale below provides the complete set needed across all epics.

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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add mobile/constants/spacing.constants.ts
git commit -m "feat(design): add spacing.constants.ts with SPACING and BORDER_RADIUS"
```

---

## Task 5: Audit reusable components

> No component logic is modified in this task. `palette.divider` is retained as a deprecated alias in `Colors.ts` so all components compile without changes. This audit notes visual discrepancies for future epics.

**Files (read-only):**
- `mobile/components/ChipSelector.tsx`
- `mobile/components/NumericInput.tsx`
- `mobile/components/UnitToggle.tsx`
- `mobile/components/IllustratedCard.tsx`

- [ ] **Step 1: Audit each component against updated palette**

Read each file and note any values that differ from the updated palette or new constants:

**ChipSelector.tsx** — observations:
- `styles.chip.borderColor: palette.divider` → resolves to `#E5E5E5` via alias ✓ (updated value). Migrate to `palette.border` in a future epic.
- `styles.chipText.fontSize: 14` → could align with `FONT_SIZE.MD = 15` in a later epic.
- Active chip `palette.primary` ✓ matches Pencil `--primary`.

**NumericInput.tsx** — observations:
- `styles.input.backgroundColor: palette.white` ✓.
- `outlineColor={palette.divider}` → resolves to `#E5E5E5` via alias ✓. Migrate to `palette.border` in a future epic.
- `activeOutlineColor: palette.primary` ✓.

**UnitToggle.tsx** — observations:
- `styles.buttons.borderRadius: 12` → aligns with `BORDER_RADIUS.MD = 12` ✓.
- No direct palette references; inherits from Paper theme ✓.

**IllustratedCard.tsx** — observations:
- `styles.card.borderRadius: 16` → aligns with `BORDER_RADIUS.LG = 16` / `--radius-card = 16` ✓.
- `styles.cardSelected.backgroundColor: '#E8F5E9'` → matches `palette.primaryLight` value; hardcoded, migrate in a future epic.
- `styles.card.borderColor: palette.divider` → resolves to `#E5E5E5` via alias ✓. Migrate to `palette.border` in a future epic.
- `styles.labelSelected.color: palette.primaryDark` ✓.

**Deferred to a future epic:**
- Migrate all `palette.divider` usages in `ChipSelector.tsx`, `NumericInput.tsx`, `IllustratedCard.tsx` to `palette.border`.
- Replace hardcoded `'#E8F5E9'` in `IllustratedCard.tsx:95` with `palette.primaryLight`.
- Align `chipText.fontSize: 14` to `FONT_SIZE.MD`.

- [ ] **Step 2: Verify TypeScript still compiles cleanly**

```bash
cd mobile && npx tsc --noEmit
```

Expected: no errors (no component files were modified).

- [ ] **Step 3: No commit needed** — no files changed in this task.

---

## Verification

- [ ] Run `cd mobile && npx tsc --noEmit` — must pass cleanly.
- [ ] Cross-reference every color in `Colors.ts` against the Pencil token table in this plan — all must match.
- [ ] Take a screenshot of the Login screen in the simulator and compare colors against the `diet-manager.pen` Login screen via `mcp__pencil__get_screenshot`. Primary green, backgrounds, and text colors should align.

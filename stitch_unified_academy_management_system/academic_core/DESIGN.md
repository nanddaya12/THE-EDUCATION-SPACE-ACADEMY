---
name: Academic Core
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#56423b'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#897269'
  outline-variant: '#ddc1b7'
  surface-tint: '#9f4216'
  primary: '#9b3f14'
  on-primary: '#ffffff'
  primary-container: '#bb572b'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb598'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5a5c5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#737576'
  on-tertiary-container: '#fcfdfe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb598'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7f2b00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 260px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is anchored in the concept of "Structured Clarity." It is designed for an educational environment that demands high focus, professional authority, and a modern edge. The target audience includes students seeking clear learning paths and administrators requiring efficient data management.

The style is **Modern Corporate** with a heavy emphasis on **Minimalism**. It leverages high-quality typography and generous white space to reduce cognitive load—essential for complex course management systems and student dashboards. The aesthetic is clean and trustworthy, utilizing the bold orange as a precise "action" color against a sophisticated, neutral backdrop.

## Colors

The color palette is built on high-contrast foundations. 
- **Primary Orange (#D66B3D):** Reserved strictly for primary calls to action, active states in the sidebar, and critical progress indicators.
- **Deep Black/Grey (#1A1A1A):** Used for the Sidebar background in the Admin Panel to create a strong vertical anchor and for primary headings to ensure maximum legibility.
- **Neutral Greys:** A range of slate greys is used for secondary text and borders to maintain a professional, calm environment.

For the Student Dashboard, use a lighter approach with more white space; for the Admin Panel, the dark sidebar provides a "command center" feel.

## Typography

The typography system uses **Hanken Grotesk** for headings to provide a sharp, contemporary character, and **Inter** for all body and UI elements to ensure peak readability across data-heavy tables and course content.

- **Scale:** Use `display-lg` for landing pages or dashboard hero sections.
- **Hierarchy:** Admin panels should prioritize `title-md` and `body-md` for information density.
- **Micro-copy:** Use `label-sm` with all-caps for sidebar category headers and table headers to distinguish them from interactive content.

## Layout & Spacing

This design system utilizes a **Fluid Grid** for the main content area with a **Fixed Sidebar** for navigation.

- **Admin & Dashboard:** The layout is divided into a fixed 260px sidebar and a fluid content area. Content should be contained within a maximum width of 1440px to prevent excessive line lengths in course reading views.
- **Rhythm:** An 8px base grid governs all spacing.
- **Breakpoints:**
    - **Desktop (1024px+):** Sidebar is permanently expanded. 3-column layouts for course cards.
    - **Tablet (768px - 1023px):** Sidebar collapses to an icon-only rail or hidden drawer. 2-column layouts.
    - **Mobile (<767px):** Single column. Margins reduce to 16px. Bottom tab bar for student dashboards.

## Elevation & Depth

To maintain a clean, modern aesthetic, this design system avoids heavy shadows. 

1.  **Tonal Layering:** Depth is primarily established through surface color changes. The background is `#F8F9FA`, while active cards and content containers are `#FFFFFF`.
2.  **Low-Contrast Outlines:** Use a 1px border (`#E2E8F0`) for cards and input fields instead of shadows to maintain a flat, professional "SaaS" look.
3.  **Active Elevation:** Only use a subtle, highly diffused shadow (0px 4px 20px rgba(0,0,0,0.05)) on hovered cards or active dropdowns to indicate interactivity.
4.  **Sidebar:** The sidebar uses a solid color block (`#1A1A1A`) to create a clear structural divide without needing depth effects.

## Shapes

The shape language is **Soft**. 

- **Small Components:** Buttons, input fields, and tags use a 0.25rem (4px) radius. This keeps the interface feeling "precise" and professional.
- **Large Components:** Course cards and modal containers use a 0.5rem (8px) radius to provide a slight visual softening for the larger content blocks.
- **Indicators:** Progress bars and status "pills" should use a fully rounded (pill-shaped) radius to distinguish them from interactive containers.

## Components

### Buttons & Inputs
- **Primary Button:** Solid `#D66B3D` with white text. High-contrast, no gradient.
- **Secondary Button:** Outlined with `#1A1A1A` or `#D66B3D`.
- **Input Fields:** 1px border (`#CBD5E1`), 12px horizontal padding. On focus, the border changes to the primary orange with a 2px outer "glow" at 10% opacity.

### Admin Sidebar
- **Background:** `#1A1A1A`.
- **Nav Items:** Medium grey text. Active state uses a vertical orange bar on the left edge and changes text to white.

### Course Management Cards
- White background, 1px grey border. 
- Top-aligned image or solid color block.
- Bottom section contains the `title-md` and a progress bar using the primary orange.

### Status Chips
- **Success:** Soft green background with dark green text.
- **Pending/Warning:** Soft orange (Primary at 10% opacity) with Primary text.
- **Neutral:** Light grey background with dark grey text.

### Data Tables (Admin)
- No vertical borders. 
- Header background: `#F8F9FA`.
- Row hover state: `#F1F5F9`.
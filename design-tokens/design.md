---
name: Kinetic Horizon
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
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#1f1ab3'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b3bc9'
  on-tertiary-container: '#bebfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered to evoke the precision and prestige of high-end automotive engineering combined with the accessibility of a peer-to-peer marketplace. It targets a demographic that values both reliability and premium experiences—users who see vehicle rental not just as utility, but as a lifestyle choice.

The visual style is **Corporate / Modern** with a strong leaning toward **Minimalism** and **Glassmorphism**. It prioritizes high-quality photography and expansive white space to let the vehicles remain the focal point. The interface feels "airy" yet grounded, utilizing sharp execution and high-contrast accents to guide user intent. Every interaction should feel effortless, reflecting the seamless transition from digital booking to physical driving.

## Colors

The palette is anchored by **Indigo-700 (#4338CA)**, representing authority and technological sophistication. This is paired with **Sky Blue (#0EA5E9)** for secondary actions and high-visibility accents, ensuring the interface remains energetic. 

Surface colors are strictly divided between pure white for primary content cards and a subtle slate-gray for background sections to create depth without relying on heavy borders. Neutral tones use a blue-tinted slate palette to maintain a "cool" temperature across the UI, avoiding the muddy feel of true grays.

## Typography

This design system utilizes a dual-font strategy. **Outfit** is used for all display and headline roles; its geometric construction and slightly wider apertures provide a modern, high-tech feel suitable for an automotive marketplace. **Inter** handles all functional and long-form text, providing exceptional legibility at smaller scales.

Tighten letter-spacing on larger headlines to create a more "editorial" look. For labels and metadata (like car specs), use semi-bold weights in Inter to ensure hierarchy is maintained even when font sizes are reduced.

## Layout & Spacing

The layout is built on a strict **8px spacing rhythm**. All padding, margins, and component heights must be multiples of 8 to ensure visual mathematical harmony. 

The design system employs a **12-column fluid grid** for desktop with a maximum container width of 1280px. For mobile, the grid collapses to a single column with 16px side margins. Large-scale photography should often break the container on one side or bleed to the edges to reinforce the "premium" feel. Use "XXL" spacing (48px+) between major sections to emphasize the spacious, luxury aesthetic.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Glassmorphism**. 

1.  **Low Elevation:** Used for cards and input fields. Features a very soft, multi-layered shadow with a large blur radius and low opacity (e.g., `y-4, blur-20, color-slate/10`).
2.  **High Elevation:** Reserved for navigation bars and floating action buttons.
3.  **Glassmorphism:** Overlays, modals, and navigation headers use a backdrop-filter (blur: 12px) with a semi-transparent white fill (opacity: 80%). This allows vehicle imagery to bleed through subtly, maintaining context and depth.
4.  **Borders:** Use thin, 1px borders in a very light slate (#E2E8F0) only when necessary to define boundaries on white backgrounds.

## Shapes

The shape language is defined by **large, friendly radii**. Primary containers like vehicle cards, image carousels, and search bars utilize a 12px (rounded-lg) to 16px (rounded-xl) corner radius. This softens the technical nature of the typography and makes the app feel approachable. 

Small components like tags or status indicators should use pill-shaped (fully rounded) geometry to distinguish them from interactive containers.

## Components

-   **Buttons:** Primary buttons use the Indigo-700 background with white text. They should have a minimum height of 48px for a "chunky," premium feel. Secondary buttons use a light Indigo tint or a subtle ghost style.
-   **Cards:** Vehicle cards are the core component. They feature a white background, 16px corner radius, and a soft shadow. Information is bottom-aligned with a clear price-per-day label in the top-right.
-   **Input Fields:** Use a 12px radius with a light gray border. On focus, the border transitions to Sky Blue with a soft blue outer glow.
-   **Chips/Tags:** Use for car categories (e.g., "Luxury," "Electric"). These are small, pill-shaped, and use high-contrast text on a very light gray or tinted background.
-   **Glass Navigation:** The top navigation bar is fixed, utilizing the glassmorphism effect to stay legible while allowing the car gallery to scroll underneath.
-   **Icons:** Use Lucide icons with a 2px stroke weight. Icons should be sized consistently at 20px or 24px and paired with Inter Medium text for labels.
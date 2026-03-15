# Platform Component Classes Reference

All CSS class names available for targeting in `overrides.css`. These are defined in the platform's `components.css` and rendered by the Spwig storefront engine.

---

## Layout

| Class | Description |
|---|---|
| `.container` | Centered max-width wrapper with padding |
| `.grid` | CSS grid container |
| `.grid--2` | 2-column grid (1 col on mobile) |
| `.grid--3` | 3-column grid (responsive) |
| `.grid--4` | 4-column grid (responsive) |
| `.section` | Vertical padding section |

---

## Buttons

### Base

| Class | Description |
|---|---|
| `.btn` | Base button (shared styles) |
| `.btn--sm` | Small size |
| `.btn--md` | Medium size (default) |
| `.btn--lg` | Large size |
| `.btn--pill` | Fully rounded (pill shape) |
| `.btn--full` | Full-width button |

### Variants (4 colors x 3 styles = 12)

| Solid | Outline | Ghost |
|---|---|---|
| `.btn--primary` | `.btn--primary-outline` | `.btn--primary-ghost` |
| `.btn--secondary` | `.btn--secondary-outline` | `.btn--secondary-ghost` |
| `.btn--neutral` | `.btn--neutral-outline` | `.btn--neutral-ghost` |
| `.btn--danger` | `.btn--danger-outline` | `.btn--danger-ghost` |

### Legacy Aliases

| Class | Maps To |
|---|---|
| `.btn--outline` | `.btn--primary-outline` |
| `.btn--ghost` | `.btn--neutral-ghost` |

### States

- `:hover:not(:disabled)` — Hover effect
- `:focus-visible` — Focus ring with `outline-color`
- `:disabled` — Reduced opacity, no pointer

---

## Cards (Generic)

| Class | Description |
|---|---|
| `.card` | Base card container (overflow hidden, transitions) |
| `.card--default` | Subtle shadow, elevated on hover |
| `.card--elevated` | Prominent shadow from start |
| `.card--bordered` | Visible border, no shadow |
| `.card--minimal` | No background, border, or shadow |
| `.card--sm` | Small padding |
| `.card--lg` | Large padding |

### Card Structure

| Class | Description |
|---|---|
| `.card__image` | Image container (aspect-ratio 1:1, overflow hidden) |
| `.card__image img` | Image (scales on card hover) |
| `.card__body` | Content area with padding and flex column |
| `.card__title` | Title text |
| `.card__text` | Body text (muted) |
| `.card__meta` | Meta text (smaller, muted) |

---

## Product Cards

The most commonly styled component in themes.

| Class | Description |
|---|---|
| `.product-card` | Container (flex column, full height, transitions) |
| `.product-card__link` | Wraps card for click |
| `.product-card__image` | Image container (aspect-ratio, overflow hidden) |
| `.product-card__image img` | Product image (zoom on hover) |
| `.product-card__img` | Alternative image class |
| `.product-card__overlay` | Translucent overlay (opacity 0 → 1 on hover) |
| `.product-card__placeholder` | No-image placeholder |

### Badges

| Class | Description |
|---|---|
| `.product-card__badges` | Badge container (top-left, stacked) |
| `.product-card__badge` | Base badge |
| `.product-card__badge--sale` | Sale badge (error color) |
| `.product-card__badge--new` | New badge (primary color) |
| `.product-card__badge--soldout` | Sold out badge (muted) |
| `.product-card__badge--bundle` | Bundle badge (info color) |

### Quick Actions

| Class | Description |
|---|---|
| `.product-card__actions` | Action buttons container (top-right, hidden until hover) |
| `.product-card__action-btn` | Action button (round, shadow) |
| `.product-card__action-btn--wishlist` | Wishlist button |
| `.product-card__action-btn--wishlist.is-active` | Filled heart |

### Content

| Class | Description |
|---|---|
| `.product-card__content` | Content wrapper (padding, flex column) |
| `.product-card__title` | Product title (line-clamped) |
| `.product-card__title a` | Title link |
| `.product-card__rating` | Star rating container |
| `.product-card__star--filled` | Filled star |
| `.product-card__star--empty` | Empty star |
| `.product-card__review-count` | Review count text |

### Price

| Class | Description |
|---|---|
| `.product-card__price` | Price container (flex, baseline) |
| `.product-card__price-current` | Current price |
| `.product-card__price-current--sale` | Sale price (error color) |
| `.product-card__price-original` | Original price (strikethrough) |

### Button

| Class | Description |
|---|---|
| `.product-card__button` | Button wrapper (margin-top: auto) |
| `.product-card__add-btn` | Add to cart button |
| `.product-card__quickview-btn` | Quick view button |
| `.product-card__options-link` | Options link (outline style) |

### Grid

| Class | Description |
|---|---|
| `.product-grid` | Product grid (responsive columns) |
| `.product-grid__empty` | Empty state message |

---

## Site Header

| Class | Description |
|---|---|
| `.site-header` | Header container (sticky, z-index) |
| `.site-header__inner` | Flex container with actions |
| `.site-header__logo` | Logo wrapper |
| `.site-header__logo img` | Logo image |
| `.site-header__logo-text` | Text-only logo |
| `.site-header__nav` | Navigation links container (hidden on mobile) |
| `.site-header__nav-link` | Individual nav link |
| `.site-header__actions` | Right-side actions (cart, account) |
| `.site-header__icon` | Icon button (round hover bg) |
| `.site-header__cart-count` | Cart count badge |
| `.site-header__menu-toggle` | Mobile menu hamburger |

---

## Site Footer

| Class | Description |
|---|---|
| `.site-footer` | Footer container |
| `.site-footer__grid` | Column grid |
| `.site-footer__brand` | Brand column |
| `.site-footer__logo` | Footer logo |
| `.site-footer__tagline` | Brand tagline |
| `.site-footer__social` | Social links row |
| `.site-footer__social-link` | Social icon button |
| `.site-footer__column-title` | Column heading |
| `.site-footer__links` | Link list |
| `.site-footer__link` | Individual link |
| `.site-footer__bottom` | Bottom bar (copyright, payments) |
| `.site-footer__copyright` | Copyright text |
| `.site-footer__payments` | Payment icons row |
| `.site-footer__payment-icon` | Payment method icon |

---

## Hero

| Class | Description |
|---|---|
| `.hero` | Hero section |
| `.hero--gradient` | Gradient background variant |
| `.hero__content` | Content wrapper |
| `.hero__title` | Title (responsive font) |
| `.hero__subtitle` | Subtitle |
| `.hero__actions` | Button row |
| `.hero__image` | Right-side image (desktop only) |

---

## Search

| Class | Description |
|---|---|
| `.search` | Search wrapper |
| `.search__container` | Centered container |
| `.search__form` | Form wrapper |
| `.search__input-wrapper` | Input container (border, focus ring) |
| `.search__input` | Text input |
| `.search__button` | Search button |
| `.search__dropdown` | Autocomplete dropdown |

### Style Variants
- `.search--full-width` — No max-width
- `.search--sm`, `.search--lg`, `.search--xl` — Size variants
- `.search--filled` — Background instead of border
- `.search--minimal` — Bottom border only
- `.search--pill` — Rounded input

---

## Forms

| Class | Description |
|---|---|
| `.form-group` | Field wrapper |
| `.form-label` | Label |
| `.form-input` | Text input / textarea |
| `.form-input--error` | Error state |
| `.form-select` | Select dropdown |
| `.form-checkbox` | Checkbox wrapper |
| `.form-radio` | Radio wrapper |
| `.form-error` | Error message text |

---

## Other Components

### Badges (Standalone)
- `.badge`, `.badge--sale`, `.badge--new`, `.badge--soldout`

### Price (Standalone)
- `.price`, `.price__current`, `.price__original`, `.price__discount`

### Breadcrumb
- `.breadcrumb`, `.breadcrumb__list`, `.breadcrumb__item`, `.breadcrumb__link`, `.breadcrumb__current`

### Cart Item
- `.cart-item`, `.cart-item__image`, `.cart-item__details`, `.cart-item__title`, `.cart-item__price`, `.cart-item__quantity`, `.cart-item__remove`

### Newsletter
- `.newsletter`, `.newsletter__title`, `.newsletter__subtitle`, `.newsletter__form`, `.newsletter__input`

### Pagination
- `.pagination`, `.pagination__item`, `.pagination__item--active`, `.pagination__item--disabled`

### Section Header
- `.section-header`, `.section-header__title`, `.section-header__subtitle`

### Alert
- `.alert`, `.alert--info`, `.alert--success`, `.alert--warning`, `.alert--error`

### Empty State
- `.empty-state`, `.empty-state__icon`, `.empty-state__title`, `.empty-state__text`

---

## Utility Classes

| Class | Property |
|---|---|
| `.text-center` / `.text-left` / `.text-right` | Text alignment |
| `.hidden` / `.block` / `.flex` / `.inline-flex` | Display |
| `.items-center` / `.justify-center` / `.justify-between` | Flex alignment |
| `.gap-2` / `.gap-4` / `.gap-6` | Gap spacing |
| `.mt-4` / `.mt-8` / `.mb-4` / `.mb-8` | Margin top/bottom |
| `.sr-only` | Screen reader only |

---

## Hover Behavior

Several components have built-in hover transitions controlled by tokens:

| Component | Default Hover |
|---|---|
| `.product-card` | Shadow increase + translateY(-4px) + border color change |
| `.product-card__image img` | scale(1.08) zoom |
| `.product-card__overlay` | Opacity 0 → 1 |
| `.product-card__actions` | Opacity 0 → 1 |
| `.card` | Shadow increase |
| `.card__image img` | scale(1.05) |

Override these by setting your own `transition` and `transform` values in `overrides.css`.

---

## Notes

- All components use `--theme-*` CSS custom properties from your `tokens.json`
- Token fallbacks use the `var(--theme-element-*, var(--theme-fallback))` pattern
- `@media (hover: none)` shows product card actions on touch devices
- Product grid columns: 2 (mobile) → 3 (tablet) → 4 (desktop)
- Footer grid: 1 col (mobile) → 2 (sm) → 4 (lg)

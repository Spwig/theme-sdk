# Starter Theme

A clean, minimal theme to get you started with Spwig theme development.

## Features

- Responsive design
- Accessible markup
- Clean, modern aesthetic
- Well-commented code
- Easy to customize

## Components

### Headers
- **main_header** - Logo, navigation, search, and cart

### Footers
- **main_footer** - Links and copyright

### Sections
- **hero_section** - Full-width hero with CTA
- **product_grid** - Featured products grid
- **newsletter** - Email subscription form

## Getting Started

### Prerequisites

- Node.js 18+
- Spwig Theme CLI (`npm install -g @spwig/theme-cli`)

### Development

1. Navigate to this theme directory
2. Start the dev server:
   ```bash
   spwig dev --shop http://localhost:8000
   ```
3. Make changes and see them live

### Validation

```bash
spwig validate
```

### Packaging

```bash
spwig package
```

## Customization

### Colors

Edit `design_tokens.json` to customize the color palette:

```json
{
  "colors": {
    "primary": "#your-brand-color",
    "primary_dark": "#darker-shade"
  }
}
```

### Typography

Update fonts in `design_tokens.json`:

```json
{
  "typography": {
    "heading_font": "Your Heading Font, sans-serif",
    "body_font": "Your Body Font, sans-serif"
  }
}
```

### Components

Each component can be customized by editing:
- `manifest.json` - Metadata
- `template.html` - HTML structure
- `schema.json` - Merchant settings
- `styles.css` - Component styles

## File Structure

```
starter-theme/
├── manifest.json
├── design_tokens.json
├── README.md
├── components/
│   ├── headers/main_header/
│   ├── footers/main_footer/
│   └── sections/
│       ├── hero_section/
│       ├── product_grid/
│       └── newsletter/
├── templates/
│   ├── layout.html
│   ├── home.html
│   ├── product.html
│   ├── collection.html
│   └── cart.html
├── pages/
│   ├── home.json
│   ├── product.json
│   ├── collection.json
│   └── cart.json
└── assets/
    ├── theme.js
    └── styles/global.css
```

## License

MIT

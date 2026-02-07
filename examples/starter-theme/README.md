# Starter Theme

A clean, minimal starter theme for Spwig eCommerce.

## Structure

```
starter-theme/
  manifest.json    # Theme metadata (v2.0)
  tokens.json      # Design tokens -- colors, typography, spacing, etc.
  overrides.css    # Optional structural CSS beyond tokens
  preview.png      # Theme preview image
  README.md
  presets/         # Header/footer layout presets
    headers/
      classic.json
    footers/
      standard.json
```

## Usage

```bash
# Validate
spwig validate

# Package
spwig package

# Dev server
spwig dev --shop http://localhost:8000
```

## Customization

Edit `tokens.json` to change colors, typography, spacing, and element styling. The platform automatically generates CSS variables from your token values.

## License

MIT

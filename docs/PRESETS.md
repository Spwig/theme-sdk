# Header and Footer Presets

Presets are JSON definitions that configure header and footer layouts. They are part of **Tier 2** themes and allow themes to ship pre-built layouts alongside their design tokens.

---

## Overview

When a theme with presets is activated on a Spwig shop, the platform reads the preset JSON files and creates the corresponding header/footer templates with widget placements. Merchants can then select these presets or customize them further in the Header/Footer builder.

---

## Directory Structure

```
my-theme/
  presets/
    headers/
      classic.json       # A header preset
      centered.json      # Another header preset
    footers/
      standard.json      # A footer preset
      minimal.json       # Another footer preset
```

Place header presets in `presets/headers/` and footer presets in `presets/footers/`. File names become the preset slug (e.g., `classic.json` creates slug `theme-mytheme-classic`).

---

## Preset JSON Format

### Header Preset

```json
{
  "name": "Classic Header",
  "description": "Logo left, menu center, utility icons right",
  "layout_type": "standard",
  "is_sticky": true,
  "enable_notification_zone": false,
  "zone_layouts": {
    "main-header": ["left", "center", "right"]
  },
  "widget_placements": [
    {
      "widget_type": "logo",
      "zone": "main-header_left",
      "order": 0,
      "config": { "height": 40 }
    },
    {
      "widget_type": "menu",
      "zone": "main-header_center",
      "order": 0
    },
    {
      "widget_type": "cart",
      "zone": "main-header_right",
      "order": 0
    }
  ]
}
```

### Footer Preset

```json
{
  "name": "Standard Footer",
  "description": "Multi-column footer with newsletter and social",
  "layout_type": "standard",
  "zone_layouts": {
    "main-footer": ["left", "center", "right"],
    "bottom-bar": ["left", "right"]
  },
  "widget_placements": [
    {
      "widget_type": "text",
      "zone": "main-footer_left",
      "order": 0,
      "config": { "content": "About Us" }
    },
    {
      "widget_type": "links",
      "zone": "main-footer_center",
      "order": 0
    },
    {
      "widget_type": "social",
      "zone": "bottom-bar_right",
      "order": 0
    }
  ]
}
```

---

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable preset name |
| `layout_type` | string | Layout type (`standard`, `centered`, `minimal`) |
| `widget_placements` | array | List of widget placement objects |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Brief description of the preset |
| `is_sticky` | boolean | Whether the header sticks to the top on scroll (headers only) |
| `enable_notification_zone` | boolean | Show the top notification bar (headers only) |
| `zone_layouts` | object | Layout configuration for each zone |

---

## Zones

### Header Zones

| Zone | Description |
|------|-------------|
| `top-bar` | Thin bar above the main header (announcements, contact info) |
| `main-header` | Primary header area (logo, menu, utility icons) |
| `bottom-bar` | Below main header (secondary navigation, breadcrumbs) |

### Footer Zones

| Zone | Description |
|------|-------------|
| `main-footer` | Primary footer area (links, newsletter, about) |
| `bottom-bar` | Bottom bar (copyright, payment icons, legal links) |

### Zone Layout Positions

Each zone can be divided into positions: `left`, `center`, `right`, or `full`.

Widget zone references combine zone name and position with an underscore:
- `main-header_left` -- Left side of main header
- `main-footer_center` -- Center of main footer
- `bottom-bar_right` -- Right side of bottom bar

---

## Widget Placement Object

```json
{
  "widget_type": "menu",
  "zone": "main-header_center",
  "order": 0,
  "config": {}
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `widget_type` | string | Yes | Type of widget to place |
| `zone` | string | Yes | Zone reference (zone_position) |
| `order` | number | No | Sort order within the zone (default: 0) |
| `config` | object | No | Widget-specific configuration |

---

## Available Widget Types

### Header Widgets

| Type | Description |
|------|-------------|
| `logo` | Store logo with configurable height |
| `menu` | Primary navigation menu |
| `search` | Search icon or search bar |
| `cart` | Cart icon with item count |
| `account` | User account icon/link |
| `currency` | Currency switcher dropdown |
| `language` | Language switcher dropdown |

### Footer Widgets

| Type | Description |
|------|-------------|
| `text` | Rich text content |
| `links` | Link list with optional title |
| `newsletter` | Email subscription form |
| `social` | Social media icon links |
| `payment` | Accepted payment method icons |
| `trust_badges` | Trust/security badges |
| `contact` | Contact information |
| `logo` | Store logo |

### Shared Widgets

| Type | Description |
|------|-------------|
| `custom` | Custom HTML/text content |

---

## Widget Configuration Examples

### Logo
```json
{
  "widget_type": "logo",
  "zone": "main-header_left",
  "order": 0,
  "config": {
    "height": 40,
    "link_to_home": true
  }
}
```

### Search
```json
{
  "widget_type": "search",
  "zone": "main-header_right",
  "order": 0,
  "config": {
    "style": "icon",
    "placeholder": "Search products..."
  }
}
```

### Links
```json
{
  "widget_type": "links",
  "zone": "main-footer_center",
  "order": 0,
  "config": {
    "title": "Quick Links",
    "links": [
      { "text": "About Us", "url": "/about" },
      { "text": "Contact", "url": "/contact" },
      { "text": "FAQ", "url": "/faq" }
    ]
  }
}
```

### Newsletter
```json
{
  "widget_type": "newsletter",
  "zone": "main-footer_right",
  "order": 0,
  "config": {
    "title": "Stay Updated",
    "description": "Subscribe for the latest products and deals.",
    "button_text": "Subscribe"
  }
}
```

---

## How Presets are Installed

When a theme is activated:

1. The platform reads all JSON files from `presets/headers/` and `presets/footers/`
2. For each preset, it creates a `HeaderTemplate` or `FooterTemplate` record
3. Widget placements are created with the specified zone, order, and config
4. Presets are tagged with `source: "theme:{slug}"` for tracking
5. Merchants can select the preset or modify it in the builder

When a theme is deactivated or uninstalled, its presets are automatically removed.

---

## Validation

The SDK validates presets during `spwig validate`:

- Each preset must have `name`, `layout_type`, and `widget_placements`
- Each widget placement must have `widget_type` and `zone`
- JSON must be valid and parseable
- Widget types should be from the known list (warnings for unknown types)

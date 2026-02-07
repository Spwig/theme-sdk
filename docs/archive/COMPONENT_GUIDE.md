# Component Development Guide

This guide covers everything you need to know about creating components for Spwig themes.

---

## What are Components?

Components are the building blocks of Spwig themes. Each component is a self-contained unit with its own template, styles, settings, and configuration. Merchants can add, remove, and configure components through the admin interface.

### Component Types

| Type | Purpose | Placement |
|------|---------|-----------|
| **header** | Site navigation, logo, search, cart | Top of every page |
| **footer** | Links, contact info, copyright | Bottom of every page |
| **section** | Content blocks (hero, features, products) | Main content area |
| **utility** | Reusable elements (buttons, cards) | Anywhere in templates |

---

## Component Structure

Every component lives in its own directory with these files:

```
components/
└── sections/
    └── hero_section/
        ├── manifest.json      # Required - Component metadata
        ├── template.html      # Required - HTML template
        ├── schema.json        # Required - Merchant settings
        └── styles.css         # Optional - Component styles
```

### File Purposes

| File | Purpose |
|------|---------|
| `manifest.json` | Component name, version, author, regions, category |
| `template.html` | Django/Jinja2 template with HTML structure |
| `schema.json` | Settings that merchants can configure |
| `styles.css` | Scoped CSS for the component |

---

## Component Manifest

The `manifest.json` defines your component's metadata.

### Required Fields

```json
{
  "name": "hero_section",
  "version": "1.0.0",
  "display_name": "Hero Section",
  "description": "Full-width hero with background image and call-to-action",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
```

### Complete Example

```json
{
  "name": "hero_section",
  "version": "1.0.0",
  "display_name": "Hero Section",
  "description": "Full-width hero with background image and call-to-action",
  "author": {
    "name": "Spwig",
    "email": "themes@spwig.com",
    "url": "https://spwig.com"
  },
  "license": "MIT",
  "tier_compatibility": ["A", "B", "C"],
  "regions": ["main", "sidebar"],
  "category": "hero",
  "tags": ["hero", "banner", "cta", "featured"],
  "preview_image": "preview.png"
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (snake_case) |
| `version` | Yes | Semantic version (1.0.0) |
| `display_name` | Yes | Human-readable name |
| `description` | Yes | Brief description |
| `author` | Yes | Author object with name, email, optional url |
| `license` | No | License identifier (MIT, Apache-2.0, etc.) |
| `tier_compatibility` | No | Store tiers this component supports |
| `regions` | No | Where component can be placed: `main`, `sidebar`, `header`, `footer` |
| `category` | No | Component category for organization |
| `tags` | No | Search tags |
| `preview_image` | No | Preview image filename |

### Categories

Use these standard categories:

- `header` - Header components
- `footer` - Footer components
- `hero` - Hero/banner sections
- `featured` - Featured content
- `content` - General content sections
- `gallery` - Image galleries
- `testimonial` - Reviews/testimonials
- `cta` - Call-to-action sections
- `utility` - Utility components

---

## Component Template

The `template.html` contains your HTML structure using Django/Jinja2 template syntax.

### Basic Template

```django
<section class="hero-section">
  <div class="hero-content">
    <h1>{{ settings.heading }}</h1>
    <p>{{ settings.subheading }}</p>

    {% if settings.button_text and settings.button_url %}
      <a href="{{ settings.button_url }}" class="hero-button">
        {{ settings.button_text }}
      </a>
    {% endif %}
  </div>
</section>
```

### Accessing Settings

Use `settings.setting_id` to access values from your schema:

```django
<h1 style="color: {{ settings.heading_color }}">
  {{ settings.heading }}
</h1>

{% if settings.show_subtitle %}
  <p>{{ settings.subtitle }}</p>
{% endif %}
```

### Using Store Context

Access store data with the `store` object:

```django
<header class="site-header">
  <a href="/" class="logo">
    {% if store.logo %}
      <img src="{{ store.logo }}" alt="{{ store.name }}">
    {% else %}
      {{ store.name }}
    {% endif %}
  </a>
</header>
```

### Common Context Variables

```django
{# Store info #}
{{ store.name }}
{{ store.logo }}
{{ store.email }}
{{ store.phone }}

{# Navigation #}
{% for item in navigation.main_menu %}
  <a href="{{ item.url }}">{{ item.title }}</a>
{% endfor %}

{# Cart #}
{{ cart.item_count }}
{{ cart.total|currency }}

{# Current request #}
{{ request.LANGUAGE_CODE }}
```

### Conditional Rendering

```django
{% if settings.show_badge %}
  <span class="badge">{{ settings.badge_text }}</span>
{% endif %}

{% if product.compare_at_price %}
  <span class="sale-price">{{ product.price|currency }}</span>
  <span class="original-price">{{ product.compare_at_price|currency }}</span>
{% else %}
  <span class="price">{{ product.price|currency }}</span>
{% endif %}
```

### Loops

```django
{# Product grid #}
<div class="product-grid">
  {% for product in products %}
    <div class="product-card">
      <img src="{{ product.image }}" alt="{{ product.title }}">
      <h3>{{ product.title }}</h3>
      <p>{{ product.price|currency }}</p>
    </div>
  {% empty %}
    <p>No products found.</p>
  {% endfor %}
</div>

{# Navigation menu #}
<nav>
  {% for item in navigation.main_menu %}
    <a href="{{ item.url }}"
       {% if item.url == request.path %}class="active"{% endif %}>
      {{ item.title }}
    </a>
  {% endfor %}
</nav>
```

### Including Other Templates

```django
{% for product in featured_products %}
  {% include "components/utilities/product_card/template.html" with product=product %}
{% endfor %}
```

---

## Component Schema

The `schema.json` defines settings that merchants can configure in the admin.

### Basic Schema

```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Welcome to our store"
    },
    {
      "id": "subheading",
      "type": "textarea",
      "label": "Subheading",
      "default": "Discover our latest products"
    }
  ]
}
```

### Setting Types

#### Text Input

```json
{
  "id": "heading",
  "type": "text",
  "label": "Heading",
  "default": "Welcome",
  "info": "Main heading displayed in the hero"
}
```

#### Textarea

```json
{
  "id": "description",
  "type": "textarea",
  "label": "Description",
  "default": "Enter your description here",
  "info": "Supports multiple lines of text"
}
```

#### Checkbox

```json
{
  "id": "show_button",
  "type": "checkbox",
  "label": "Show Button",
  "default": true,
  "info": "Display the call-to-action button"
}
```

#### Select Dropdown

```json
{
  "id": "layout",
  "type": "select",
  "label": "Layout",
  "default": "center",
  "options": [
    { "value": "left", "label": "Left Aligned" },
    { "value": "center", "label": "Centered" },
    { "value": "right", "label": "Right Aligned" }
  ]
}
```

#### Color Picker

```json
{
  "id": "background_color",
  "type": "color",
  "label": "Background Color",
  "default": "#ffffff"
}
```

#### Image Upload

```json
{
  "id": "background_image",
  "type": "image",
  "label": "Background Image",
  "info": "Recommended size: 1920x800px"
}
```

#### Range Slider

```json
{
  "id": "padding",
  "type": "range",
  "label": "Padding",
  "default": 40,
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "px"
}
```

#### URL Input

```json
{
  "id": "button_url",
  "type": "url",
  "label": "Button Link",
  "default": "/shop"
}
```

#### Number Input

```json
{
  "id": "columns",
  "type": "number",
  "label": "Number of Columns",
  "default": 3,
  "min": 1,
  "max": 6
}
```

### Complete Schema Example

```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Welcome to Our Store"
    },
    {
      "id": "subheading",
      "type": "textarea",
      "label": "Subheading",
      "default": "Discover amazing products at great prices"
    },
    {
      "id": "background_image",
      "type": "image",
      "label": "Background Image",
      "info": "Recommended: 1920x800px, JPG or PNG"
    },
    {
      "id": "overlay_color",
      "type": "color",
      "label": "Overlay Color",
      "default": "#000000"
    },
    {
      "id": "overlay_opacity",
      "type": "range",
      "label": "Overlay Opacity",
      "default": 50,
      "min": 0,
      "max": 100,
      "step": 10,
      "unit": "%"
    },
    {
      "id": "text_color",
      "type": "color",
      "label": "Text Color",
      "default": "#ffffff"
    },
    {
      "id": "text_alignment",
      "type": "select",
      "label": "Text Alignment",
      "default": "center",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    },
    {
      "id": "show_button",
      "type": "checkbox",
      "label": "Show Button",
      "default": true
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Button Text",
      "default": "Shop Now"
    },
    {
      "id": "button_url",
      "type": "url",
      "label": "Button Link",
      "default": "/collections/all"
    },
    {
      "id": "min_height",
      "type": "range",
      "label": "Minimum Height",
      "default": 500,
      "min": 300,
      "max": 800,
      "step": 50,
      "unit": "px"
    }
  ]
}
```

---

## Component Styles

The `styles.css` contains CSS scoped to your component.

### Using Design Tokens

Reference design tokens as CSS custom properties:

```css
.hero-section {
  background-color: var(--color-background);
  padding: var(--spacing-xl) var(--spacing-md);
  font-family: var(--font-family-body);
}

.hero-heading {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.hero-button {
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-default) var(--transition-easing);
}

.hero-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Responsive Design

Use breakpoint tokens for responsive styles:

```css
.product-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Wide */
@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Scoping Styles

Scope all styles to your component to avoid conflicts:

```css
/* Good - scoped to component */
.hero-section .heading {
  font-size: 3rem;
}

/* Bad - too generic, may affect other components */
.heading {
  font-size: 3rem;
}
```

### Complete Styles Example

```css
/* Hero Section Styles */

.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero-section .overlay {
  position: absolute;
  inset: 0;
  background-color: var(--color-text);
  opacity: 0.5;
}

.hero-section .content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 800px;
}

.hero-section .heading {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-background);
  margin: 0 0 var(--spacing-md);
  line-height: 1.2;
}

.hero-section .subheading {
  font-size: var(--font-size-lg);
  color: var(--color-background);
  margin: 0 0 var(--spacing-lg);
  opacity: 0.9;
}

.hero-section .button {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: all var(--transition-default) var(--transition-easing);
}

.hero-section .button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: 400px;
  }

  .hero-section .heading {
    font-size: var(--font-size-2xl);
  }

  .hero-section .subheading {
    font-size: var(--font-size-base);
  }
}
```

---

## Menu Widget Styling

Spwig provides a comprehensive set of CSS variables for customizing navigation menus. These variables let you control colors, spacing, typography, animations, and responsive behavior.

### Menu CSS Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--menu-text-color` | Default text color for menu items | `var(--color-text)` |
| `--menu-text-hover-color` | Text color on hover | `var(--color-primary)` |
| `--menu-background` | Menu background | `transparent` |
| `--menu-background-hover` | Item background on hover | `var(--color-primary)` |
| `--menu-dropdown-background` | Dropdown menu background | `var(--color-surface)` |
| `--menu-dropdown-shadow` | Dropdown shadow | `var(--shadow-lg)` |
| `--menu-border-color` | Border color for mobile modes | `var(--color-border)` |
| `--menu-active-indicator-color` | Active page indicator | `var(--color-primary)` |
| `--menu-item-gap` | Space between items | `var(--space-1)` |
| `--menu-link-padding-x` | Horizontal link padding | `var(--space-4)` |
| `--menu-link-padding-y` | Vertical link padding | `var(--space-2)` |
| `--menu-dropdown-padding` | Dropdown menu padding | `var(--space-2)` |
| `--menu-font-size` | Menu item font size | `var(--font-size-base)` |
| `--menu-font-weight` | Default font weight | `var(--font-weight-medium)` |
| `--menu-font-weight-active` | Active item font weight | `var(--font-weight-semibold)` |
| `--menu-border-radius` | Item border radius | `var(--radius-md)` |
| `--menu-dropdown-border-radius` | Dropdown border radius | `var(--radius-lg)` |
| `--menu-animation-duration` | Animation speed | `var(--duration-fast)` |
| `--menu-animation-timing` | Animation easing | `var(--easing-default)` |
| `--menu-slide-duration` | Mobile slide animation | `var(--duration-slow)` |

### Example: Custom Menu Styling

```css
/* tokens.css - override menu defaults */
:root {
  --menu-text-color: #374151;
  --menu-text-hover-color: #ffffff;
  --menu-background-hover: var(--color-primary);
  --menu-dropdown-background: #ffffff;
  --menu-dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  --menu-item-gap: 0.25rem;
  --menu-link-padding-x: 1rem;
  --menu-link-padding-y: 0.5rem;
  --menu-border-radius: 0.375rem;
  --menu-animation-duration: 200ms;
}
```

### Animation Customization

Themes can customize menu animation timing:

```css
:root {
  /* Faster animations for snappier feel */
  --menu-animation-duration: 150ms;
  --menu-animation-timing: ease-out;

  /* Slower slide for mobile menus */
  --menu-slide-duration: 400ms;
}
```

### Mobile Menu Modes

Themes should support these mobile menu mode classes:

| Class | Description |
|-------|-------------|
| `.mobile-mode-hamburger` | Traditional hamburger menu (default) |
| `.mobile-mode-bottom-nav` | Fixed bottom navigation bar |
| `.mobile-mode-slide` | Off-canvas slide menu |
| `.mobile-mode-fullscreen` | Fullscreen overlay menu |

Example CSS for mobile modes:

```css
/* Bottom navigation mode */
.widget-menu.mobile-mode-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Slide menu mode */
.widget-menu.mobile-mode-slide {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  transform: translateX(-100%);
  transition: transform var(--menu-slide-duration) ease;
}

.widget-menu.mobile-mode-slide.menu-open {
  transform: translateX(0);
}
```

---

## Creating Components

### Using the CLI

```bash
# Add a section component
spwig component add section featured_products

# Add with display name
spwig component add section newsletter_signup --display-name "Newsletter Signup"

# Add with CSS file
spwig component add header main_header --with-css
```

### Using VSCode

1. Press `Ctrl+Alt+C` (Windows/Linux) or `Cmd+Alt+C` (macOS)
2. Select component type
3. Enter component name
4. Component is created with all required files

### Manual Creation

1. Create directory: `components/sections/my_component/`
2. Create `manifest.json` with required fields
3. Create `template.html` with your HTML
4. Create `schema.json` with settings
5. Optionally add `styles.css`

---

## Complete Component Examples

### Header Component

**components/headers/main_header/manifest.json**
```json
{
  "name": "main_header",
  "version": "1.0.0",
  "display_name": "Main Header",
  "description": "Primary site header with logo, navigation, and cart",
  "author": {
    "name": "Spwig",
    "email": "themes@spwig.com"
  },
  "regions": ["header"],
  "category": "header"
}
```

**components/headers/main_header/template.html**
```django
<header class="main-header" style="background-color: {{ settings.background_color }}">
  <div class="header-container">
    {# Logo #}
    <a href="/" class="logo">
      {% if store.logo %}
        <img src="{{ store.logo }}" alt="{{ store.name }}">
      {% else %}
        <span class="logo-text">{{ store.name }}</span>
      {% endif %}
    </a>

    {# Navigation #}
    <nav class="main-nav">
      {% for item in navigation.main_menu %}
        <a href="{{ item.url }}"
           class="nav-link {% if item.url == request.path %}active{% endif %}">
          {{ item.title }}
        </a>
      {% endfor %}
    </nav>

    {# Actions #}
    <div class="header-actions">
      {% if settings.show_search %}
        <button class="search-toggle" aria-label="Search">
          <svg><!-- search icon --></svg>
        </button>
      {% endif %}

      <a href="/cart" class="cart-link">
        <svg><!-- cart icon --></svg>
        {% if cart.item_count > 0 %}
          <span class="cart-count">{{ cart.item_count }}</span>
        {% endif %}
      </a>
    </div>
  </div>
</header>
```

**components/headers/main_header/schema.json**
```json
{
  "settings": [
    {
      "id": "background_color",
      "type": "color",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "id": "show_search",
      "type": "checkbox",
      "label": "Show Search Icon",
      "default": true
    },
    {
      "id": "sticky",
      "type": "checkbox",
      "label": "Sticky Header",
      "default": false,
      "info": "Header stays visible when scrolling"
    }
  ]
}
```

### Product Grid Section

**components/sections/product_grid/manifest.json**
```json
{
  "name": "product_grid",
  "version": "1.0.0",
  "display_name": "Product Grid",
  "description": "Display products in a responsive grid layout",
  "author": {
    "name": "Spwig",
    "email": "themes@spwig.com"
  },
  "regions": ["main"],
  "category": "featured",
  "tags": ["products", "grid", "featured"]
}
```

**components/sections/product_grid/template.html**
```django
<section class="product-grid-section">
  <div class="container">
    {% if settings.heading %}
      <h2 class="section-heading" style="text-align: {{ settings.text_alignment }}">
        {{ settings.heading }}
      </h2>
    {% endif %}

    {% if settings.subheading %}
      <p class="section-subheading" style="text-align: {{ settings.text_alignment }}">
        {{ settings.subheading }}
      </p>
    {% endif %}

    <div class="product-grid columns-{{ settings.columns }}">
      {% for product in featured_products|slice:":"|add:settings.product_count %}
        <div class="product-card">
          <a href="{{ product.url }}" class="product-link">
            <div class="product-image">
              {% if product.image %}
                <img src="{{ product.image }}" alt="{{ product.title }}" loading="lazy">
              {% endif %}

              {% if product.compare_at_price %}
                <span class="sale-badge">Sale</span>
              {% endif %}
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>

              <div class="product-price">
                {% if product.compare_at_price %}
                  <span class="sale-price">{{ product.price|currency }}</span>
                  <span class="compare-price">{{ product.compare_at_price|currency }}</span>
                {% else %}
                  <span class="regular-price">{{ product.price|currency }}</span>
                {% endif %}
              </div>
            </div>
          </a>

          {% if settings.show_add_to_cart %}
            <button class="add-to-cart" data-product-id="{{ product.id }}">
              Add to Cart
            </button>
          {% endif %}
        </div>
      {% empty %}
        <p class="no-products">No products available.</p>
      {% endfor %}
    </div>

    {% if settings.show_view_all %}
      <div class="view-all" style="text-align: {{ settings.text_alignment }}">
        <a href="{{ settings.view_all_url }}" class="view-all-link">
          {{ settings.view_all_text }}
        </a>
      </div>
    {% endif %}
  </div>
</section>
```

**components/sections/product_grid/schema.json**
```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Featured Products"
    },
    {
      "id": "subheading",
      "type": "textarea",
      "label": "Subheading",
      "default": ""
    },
    {
      "id": "text_alignment",
      "type": "select",
      "label": "Text Alignment",
      "default": "center",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    },
    {
      "id": "product_count",
      "type": "number",
      "label": "Number of Products",
      "default": 8,
      "min": 2,
      "max": 24
    },
    {
      "id": "columns",
      "type": "select",
      "label": "Columns",
      "default": "4",
      "options": [
        { "value": "2", "label": "2 Columns" },
        { "value": "3", "label": "3 Columns" },
        { "value": "4", "label": "4 Columns" }
      ]
    },
    {
      "id": "show_add_to_cart",
      "type": "checkbox",
      "label": "Show Add to Cart Button",
      "default": true
    },
    {
      "id": "show_view_all",
      "type": "checkbox",
      "label": "Show View All Link",
      "default": true
    },
    {
      "id": "view_all_text",
      "type": "text",
      "label": "View All Text",
      "default": "View All Products"
    },
    {
      "id": "view_all_url",
      "type": "url",
      "label": "View All Link",
      "default": "/collections/all"
    }
  ]
}
```

### Newsletter Section

**components/sections/newsletter/template.html**
```django
<section class="newsletter-section"
         style="background-color: {{ settings.background_color }}">
  <div class="container">
    <div class="newsletter-content" style="text-align: {{ settings.alignment }}">
      {% if settings.heading %}
        <h2 class="newsletter-heading" style="color: {{ settings.text_color }}">
          {{ settings.heading }}
        </h2>
      {% endif %}

      {% if settings.description %}
        <p class="newsletter-description" style="color: {{ settings.text_color }}">
          {{ settings.description }}
        </p>
      {% endif %}

      <form class="newsletter-form" action="/newsletter/subscribe" method="post">
        {% csrf_token %}
        <div class="form-group">
          <input type="email"
                 name="email"
                 placeholder="{{ settings.placeholder }}"
                 required>
          <button type="submit">
            {{ settings.button_text }}
          </button>
        </div>
      </form>

      {% if settings.privacy_text %}
        <p class="privacy-notice" style="color: {{ settings.text_color }}">
          {{ settings.privacy_text }}
        </p>
      {% endif %}
    </div>
  </div>
</section>
```

### Search Section

A customizable search component with multiple style variants and autocomplete support.

**components/sections/search_bar/manifest.json**
```json
{
  "name": "search_bar",
  "version": "1.0.0",
  "display_name": "Search Bar",
  "description": "Customizable search bar with autocomplete and inline results support",
  "author": "Spwig",
  "tier_compatibility": ["A", "B", "C"],
  "regions": ["main", "header"],
  "category": "navigation",
  "tags": ["search", "navigation", "autocomplete"]
}
```

**components/sections/search_bar/template.html**
```django
<div class="search search--{{ settings.input_size }} search--{{ settings.input_style }} {% if settings.full_width %}search--full-width{% endif %}">
  <div class="search__container">
    <form class="search__form" action="/search/" method="get">
      <div class="search__input-wrapper">
        <input type="search"
               name="q"
               class="search__input"
               placeholder="{{ settings.placeholder }}"
               autocomplete="off"
               aria-label="{{ settings.placeholder }}">
      </div>
      {% if settings.show_button %}
        <button type="submit" class="search__button btn btn--primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          {% if settings.button_text %}
            <span>{{ settings.button_text }}</span>
          {% endif %}
        </button>
      {% endif %}
    </form>
    <div class="search__dropdown" hidden></div>
  </div>
</div>
```

**components/sections/search_bar/schema.json**
```json
{
  "settings": [
    {
      "id": "placeholder",
      "type": "text",
      "label": "Placeholder Text",
      "default": "Search products..."
    },
    {
      "id": "show_button",
      "type": "checkbox",
      "label": "Show Search Button",
      "default": true
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Button Text",
      "default": "Search"
    },
    {
      "id": "input_size",
      "type": "select",
      "label": "Input Size",
      "default": "md",
      "options": [
        {"value": "sm", "label": "Small"},
        {"value": "md", "label": "Medium"},
        {"value": "lg", "label": "Large"}
      ]
    },
    {
      "id": "input_style",
      "type": "select",
      "label": "Input Style",
      "default": "default",
      "options": [
        {"value": "default", "label": "Default"},
        {"value": "filled", "label": "Filled"},
        {"value": "minimal", "label": "Minimal"},
        {"value": "pill", "label": "Pill"}
      ]
    },
    {
      "id": "full_width",
      "type": "checkbox",
      "label": "Full Width",
      "default": false
    }
  ]
}
```

**Style variants**: The search component supports multiple visual styles:
- `default` - Standard bordered input
- `filled` - Filled background with no border
- `minimal` - Underline style only
- `pill` - Rounded pill shape

---

## Advanced Patterns

### Dynamic Inline Styles

Use settings to control inline styles:

```django
<section style="
  background-color: {{ settings.background_color }};
  padding-top: {{ settings.padding_top }}px;
  padding-bottom: {{ settings.padding_bottom }}px;
  {% if settings.background_image %}
  background-image: url('{{ settings.background_image }}');
  background-size: cover;
  {% endif %}
">
```

### Conditional Classes

```django
<div class="hero
            hero--{{ settings.layout }}
            {% if settings.full_width %}hero--full-width{% endif %}
            {% if settings.animate %}hero--animate{% endif %}">
```

### JavaScript Integration

Add a `script.js` for interactive components:

```javascript
// components/sections/carousel/script.js
document.addEventListener('DOMContentLoaded', function() {
  const carousels = document.querySelectorAll('.product-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.slide');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    prevBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    nextBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    showSlide(0);
  });
});
```

### AJAX Add to Cart

```django
<button class="add-to-cart"
        data-product-id="{{ product.id }}"
        data-variant-id="{{ product.variants.0.id }}">
  Add to Cart
</button>

<script>
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', async function() {
    const productId = this.dataset.productId;
    const variantId = this.dataset.variantId;

    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({
          product_id: productId,
          variant_id: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        // Update cart count
        const data = await response.json();
        document.querySelector('.cart-count').textContent = data.item_count;
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  });
});
</script>
```

---

## Validation

Validate your component before packaging:

```bash
# Validate entire theme
spwig validate

# Verbose output
spwig validate --verbose
```

Common validation errors:

| Error | Solution |
|-------|----------|
| Missing required field | Add the field to manifest.json |
| Invalid component name | Use snake_case (letters, numbers, underscores) |
| Template syntax error | Check Django/Jinja2 syntax |
| Schema type invalid | Use valid setting types |

---

## Best Practices

### Naming Conventions

- Component names: `snake_case` (e.g., `product_grid`, `hero_section`)
- CSS classes: `kebab-case` (e.g., `product-card`, `hero-content`)
- Setting IDs: `snake_case` (e.g., `button_text`, `show_badge`)

### Performance

- Lazy load images with `loading="lazy"`
- Minimize JavaScript
- Use CSS animations over JS when possible
- Optimize images before upload

### Accessibility

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`)
- Add `alt` text to images
- Include `aria-label` for icon buttons
- Ensure sufficient color contrast
- Support keyboard navigation

### Maintainability

- Comment complex logic
- Keep templates focused and readable
- Extract repeated patterns to utility components
- Use meaningful setting IDs and labels

---

## Next Steps

- [Design Tokens Reference](./DESIGN_TOKENS.md) - Learn about the design token system
- [Template Reference](./TEMPLATE_REFERENCE.md) - Complete template syntax reference
- [Context Variables](./CONTEXT_VARIABLES.md) - All available template variables
- [Settings Schema](./SETTINGS_SCHEMA.md) - Complete settings type reference

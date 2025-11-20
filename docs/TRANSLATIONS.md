# Theme Translations Guide

This guide explains how to create translatable themes that support multiple languages.

## Overview

Spwig uses a **JSONField translation pattern** for theme content. This means:

- No `.po` files or Django i18n for theme content
- Translations stored as JSON with language codes as keys
- Merchants translate content via the AI Translation Service
- Theme developers write defaults in **any language**

## Setting Your Default Language

Specify your theme's default language in `manifest.json`:

```json
{
  "name": "my_theme",
  "version": "1.0.0",
  "display_name": "My Theme",
  "default_language": "en",
  ...
}
```

### Supported Language Codes

Use ISO 639-1 codes:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `nl` | Dutch |
| `pl` | Polish |
| `ru` | Russian |
| `ja` | Japanese |
| `ko` | Korean |
| `zh` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |
| `ar` | Arabic |
| `hi` | Hindi |
| `tr` | Turkish |
| `vi` | Vietnamese |
| `th` | Thai |

## Marking Fields as Translatable

In your component's `schema.json`, add `"translatable": true` to text fields that should be translatable:

```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Welcome to our store",
      "translatable": true
    },
    {
      "id": "subheading",
      "type": "textarea",
      "label": "Subheading",
      "default": "Discover our latest products",
      "translatable": true
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Button Text",
      "default": "Shop Now",
      "translatable": true
    },
    {
      "id": "show_button",
      "type": "checkbox",
      "label": "Show Button",
      "default": true
    }
  ]
}
```

Only text-based fields should be marked translatable:
- `text`
- `textarea`
- `richtext`

Do NOT mark these as translatable:
- `checkbox`
- `select`
- `color`
- `image`
- `range`
- `number`
- `url`

## Non-English Default Language Example

A Spanish developer creating a hero section:

### Schema (schema.json)

```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Título",
      "default": "Bienvenido a nuestra tienda",
      "translatable": true,
      "info": "El título principal del hero"
    },
    {
      "id": "subheading",
      "type": "textarea",
      "label": "Subtítulo",
      "default": "Descubre nuestros últimos productos con envío gratuito",
      "translatable": true
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Texto del botón",
      "default": "Comprar ahora",
      "translatable": true
    }
  ]
}
```

### Template (template.html)

```html
<section class="hero">
  <div class="hero__content">
    <h1 class="hero__heading">{{ settings.heading }}</h1>
    <p class="hero__subheading">{{ settings.subheading }}</p>
    <a href="{{ settings.button_link }}" class="button">
      {{ settings.button_text }}
    </a>
  </div>
</section>
```

Templates always use the simple variable syntax. The platform handles language resolution automatically based on the customer's selected language.

## How Translation Storage Works

When a merchant installs your theme and translates content, the platform stores translations like this:

```json
{
  "heading": {
    "es": "Bienvenido a nuestra tienda",
    "en": "Welcome to our store",
    "fr": "Bienvenue dans notre boutique",
    "de": "Willkommen in unserem Geschäft",
    "_meta": {
      "source": "es",
      "auto_translated": ["en", "fr", "de"],
      "manually_edited": []
    }
  }
}
```

### Metadata Fields

- `source` - The original language (from theme's `default_language`)
- `auto_translated` - Languages translated by AI Translation Service
- `manually_edited` - Languages where merchant made manual edits

## Merchant Translation Workflow

When merchants use your theme:

1. **Theme installation** - Defaults loaded in your source language
2. **Merchant enables languages** - Chooses which languages to support
3. **AI Translation** - Translation Service translates all translatable fields
4. **Manual review** - Merchant can edit any translation
5. **Customer experience** - Platform serves correct language based on customer preference

## Best Practices

### 1. Write Clear, Translatable Content

```json
// Good - clear and translatable
{
  "default": "Add to Cart"
}

// Avoid - contains variables that may not translate well
{
  "default": "Add {{ product.title }} to Cart"
}
```

### 2. Keep Default Text Concise

Short text translates better and fits UI constraints in all languages:

```json
// Good
{
  "default": "Shop Now"
}

// Avoid - too long
{
  "default": "Click here to start shopping in our store"
}
```

### 3. Provide Context in Labels and Info

Help merchants understand the purpose of translatable fields:

```json
{
  "id": "empty_cart_message",
  "type": "text",
  "label": "Empty Cart Message",
  "default": "Your cart is empty",
  "translatable": true,
  "info": "Shown when customer has no items in cart"
}
```

### 4. Consider Text Expansion

Some languages require more space than others. German and French text is typically 20-30% longer than English. Design your components to accommodate text expansion:

```css
/* Allow text to wrap */
.hero__heading {
  max-width: 100%;
  word-wrap: break-word;
}

/* Don't use fixed widths for text containers */
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  /* Width adapts to content */
}
```

### 5. Use Placeholders Carefully

If you need dynamic content in translatable text, use a consistent placeholder format:

```json
{
  "id": "items_count",
  "type": "text",
  "label": "Items Count Text",
  "default": "{{count}} items",
  "translatable": true,
  "info": "{{count}} will be replaced with the number of items"
}
```

The Translation Service preserves `{{placeholders}}` during translation.

### 6. Group Related Translatable Fields

Keep related translatable content together in your schema:

```json
{
  "settings": [
    {
      "type": "header",
      "content": "Content"
    },
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Featured Products",
      "translatable": true
    },
    {
      "id": "subheading",
      "type": "text",
      "label": "Subheading",
      "default": "Check out our latest arrivals",
      "translatable": true
    },
    {
      "type": "header",
      "content": "Layout"
    },
    {
      "id": "columns",
      "type": "range",
      "label": "Columns",
      "default": 4,
      "min": 2,
      "max": 6
    }
  ]
}
```

## Complete Component Example

Here's a complete newsletter component with proper translation support:

### manifest.json

```json
{
  "name": "newsletter",
  "type": "section",
  "version": "1.0.0",
  "display_name": "Newsletter Signup",
  "description": "Email subscription form with customizable text"
}
```

### schema.json

```json
{
  "settings": [
    {
      "type": "header",
      "content": "Content"
    },
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Subscribe to our newsletter",
      "translatable": true
    },
    {
      "id": "description",
      "type": "textarea",
      "label": "Description",
      "default": "Get the latest updates on new products and upcoming sales",
      "translatable": true
    },
    {
      "id": "placeholder",
      "type": "text",
      "label": "Email Placeholder",
      "default": "Enter your email",
      "translatable": true
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Button Text",
      "default": "Subscribe",
      "translatable": true
    },
    {
      "id": "success_message",
      "type": "text",
      "label": "Success Message",
      "default": "Thank you for subscribing!",
      "translatable": true,
      "info": "Shown after successful subscription"
    },
    {
      "id": "error_message",
      "type": "text",
      "label": "Error Message",
      "default": "Please enter a valid email address",
      "translatable": true,
      "info": "Shown when email validation fails"
    },
    {
      "type": "header",
      "content": "Style"
    },
    {
      "id": "background_color",
      "type": "color",
      "label": "Background Color",
      "default": "#f8f9fa"
    }
  ]
}
```

### template.html

```html
<section class="newsletter" style="background-color: {{ settings.background_color }}">
  <div class="newsletter__container">
    <h2 class="newsletter__heading">{{ settings.heading }}</h2>

    {% if settings.description %}
      <p class="newsletter__description">{{ settings.description }}</p>
    {% endif %}

    <form class="newsletter__form" action="{% url 'newsletter:subscribe' %}" method="post">
      {% csrf_token %}
      <div class="newsletter__input-group">
        <input
          type="email"
          name="email"
          placeholder="{{ settings.placeholder }}"
          required
          class="newsletter__input"
          aria-label="{{ settings.placeholder }}"
        >
        <button type="submit" class="newsletter__button button">
          {{ settings.button_text }}
        </button>
      </div>
      <p class="newsletter__message newsletter__message--success" hidden>
        {{ settings.success_message }}
      </p>
      <p class="newsletter__message newsletter__message--error" hidden>
        {{ settings.error_message }}
      </p>
    </form>
  </div>
</section>
```

## RTL Language Support

If your theme supports right-to-left languages (Arabic, Hebrew, Persian), add RTL styles:

```css
/* Base styles */
.hero__content {
  text-align: left;
  padding-left: var(--spacing-lg);
}

/* RTL support */
[dir="rtl"] .hero__content {
  text-align: right;
  padding-left: 0;
  padding-right: var(--spacing-lg);
}
```

Or use logical properties for automatic RTL support:

```css
.hero__content {
  text-align: start;
  padding-inline-start: var(--spacing-lg);
}
```

## Testing Translations

### 1. Validate Translatable Fields

Run the validator to check your translatable field declarations:

```bash
spwig validate
```

The validator checks:
- Only text-based fields are marked translatable
- Translatable fields have default values
- Default language is specified in manifest

### 2. Preview in Different Languages

During development, test how your component looks with different text lengths:

```bash
# Start dev server
spwig dev --shop http://localhost:8000

# Change language in shop settings to test
```

### 3. Test with Actual Translations

Create test translations to verify:
- Text fits in containers
- No truncation issues
- RTL layout works (if supporting RTL languages)

## Summary

- Specify `default_language` in theme manifest
- Mark text fields with `"translatable": true` in schema
- Write clear, concise default text
- Design for text expansion
- Use logical CSS properties for RTL support
- Templates use simple variable syntax - platform handles language resolution

The AI Translation Service handles the translation work for merchants, but well-designed themes with properly marked translatable fields create a better experience for both merchants and their customers.

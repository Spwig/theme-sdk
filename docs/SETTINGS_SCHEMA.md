# Settings Schema Reference

The schema.json file defines settings that merchants can configure for your component in the admin interface. This reference covers all setting types and configuration options.

---

## Schema Structure

```json
{
  "settings": [
    {
      "id": "setting_id",
      "type": "setting_type",
      "label": "Display Label",
      "default": "default_value",
      "info": "Help text for merchants"
    }
  ]
}
```

### Common Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (snake_case) |
| `type` | Yes | Setting type |
| `label` | Yes | Display label in admin |
| `default` | Recommended | Default value |
| `info` | No | Help text shown below input |

---

## Setting Types

### text

Single-line text input.

```json
{
  "id": "heading",
  "type": "text",
  "label": "Heading",
  "default": "Welcome to our store",
  "info": "Main heading displayed in the section"
}
```

**Template usage:**
```django
<h1>{{ settings.heading }}</h1>
```

**Rendered in admin:**
```
Heading
[Welcome to our store          ]
Main heading displayed in the section
```

---

### textarea

Multi-line text input.

```json
{
  "id": "description",
  "type": "textarea",
  "label": "Description",
  "default": "Enter your description here",
  "info": "Supports multiple lines of text"
}
```

**Template usage:**
```django
<p>{{ settings.description }}</p>

{# With line breaks #}
<p>{{ settings.description|linebreaksbr }}</p>
```

**Rendered in admin:**
```
Description
┌─────────────────────────────┐
│ Enter your description here │
│                             │
│                             │
└─────────────────────────────┘
Supports multiple lines of text
```

---

### checkbox

Boolean toggle.

```json
{
  "id": "show_button",
  "type": "checkbox",
  "label": "Show Button",
  "default": true,
  "info": "Display the call-to-action button"
}
```

**Template usage:**
```django
{% if settings.show_button %}
  <a href="{{ settings.button_url }}" class="button">
    {{ settings.button_text }}
  </a>
{% endif %}
```

**Rendered in admin:**
```
[✓] Show Button
    Display the call-to-action button
```

---

### select

Dropdown selection.

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
  ],
  "info": "Content alignment within the section"
}
```

**Template usage:**
```django
<div class="content" style="text-align: {{ settings.layout }}">
  {{ settings.heading }}
</div>

{# Or with conditional classes #}
<div class="content content--{{ settings.layout }}">
  {{ settings.heading }}
</div>
```

**Rendered in admin:**
```
Layout
[Centered               ▼]
Content alignment within the section
```

---

### color

Color picker with hex value.

```json
{
  "id": "background_color",
  "type": "color",
  "label": "Background Color",
  "default": "#ffffff",
  "info": "Section background color"
}
```

**Template usage:**
```django
<section style="background-color: {{ settings.background_color }}">
  {{ settings.content }}
</section>
```

**Rendered in admin:**
```
Background Color
[■ #ffffff] [Color picker button]
Section background color
```

---

### image

Image upload/selection.

```json
{
  "id": "background_image",
  "type": "image",
  "label": "Background Image",
  "info": "Recommended size: 1920x800px, JPG or PNG"
}
```

**Template usage:**
```django
{% if settings.background_image %}
  <section style="background-image: url('{{ settings.background_image }}')">
    {{ settings.content }}
  </section>
{% else %}
  <section>
    {{ settings.content }}
  </section>
{% endif %}
```

**Rendered in admin:**
```
Background Image
┌─────────────────┐
│   [Upload]      │
│                 │
└─────────────────┘
Recommended size: 1920x800px, JPG or PNG
```

---

### range

Slider with numeric value.

```json
{
  "id": "padding",
  "type": "range",
  "label": "Vertical Padding",
  "default": 60,
  "min": 20,
  "max": 120,
  "step": 10,
  "unit": "px",
  "info": "Space above and below content"
}
```

**Template usage:**
```django
<section style="padding: {{ settings.padding }}px 0">
  {{ settings.content }}
</section>
```

**Rendered in admin:**
```
Vertical Padding
[========●=====] 60px
Space above and below content
```

**Range fields:**

| Field | Type | Description |
|-------|------|-------------|
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `step` | number | Increment value |
| `unit` | string | Unit label (px, %, em, etc.) |

---

### url

URL input with validation.

```json
{
  "id": "button_url",
  "type": "url",
  "label": "Button Link",
  "default": "/shop",
  "info": "Where the button links to"
}
```

**Template usage:**
```django
<a href="{{ settings.button_url }}">
  {{ settings.button_text }}
</a>
```

**Rendered in admin:**
```
Button Link
[/shop                         ]
Where the button links to
```

---

### number

Numeric input.

```json
{
  "id": "columns",
  "type": "number",
  "label": "Number of Columns",
  "default": 4,
  "min": 2,
  "max": 6,
  "info": "Products per row on desktop"
}
```

**Template usage:**
```django
<div class="grid grid--{{ settings.columns }}-col">
  {% for product in products %}
    <div class="grid-item">{{ product.title }}</div>
  {% endfor %}
</div>
```

**Rendered in admin:**
```
Number of Columns
[4    ] (2-6)
Products per row on desktop
```

**Number fields:**

| Field | Type | Description |
|-------|------|-------------|
| `min` | number | Minimum value |
| `max` | number | Maximum value |

---

### radio

Radio button group.

```json
{
  "id": "image_ratio",
  "type": "radio",
  "label": "Image Ratio",
  "default": "square",
  "options": [
    { "value": "portrait", "label": "Portrait (3:4)" },
    { "value": "square", "label": "Square (1:1)" },
    { "value": "landscape", "label": "Landscape (4:3)" }
  ]
}
```

**Template usage:**
```django
<div class="product-image product-image--{{ settings.image_ratio }}">
  <img src="{{ product.image }}" alt="{{ product.title }}">
</div>
```

**Rendered in admin:**
```
Image Ratio
○ Portrait (3:4)
● Square (1:1)
○ Landscape (4:3)
```

---

## Complete Schema Examples

### Hero Section

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
      "info": "Recommended: 1920x800px"
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
      "id": "min_height",
      "type": "range",
      "label": "Minimum Height",
      "default": 500,
      "min": 300,
      "max": 800,
      "step": 50,
      "unit": "px"
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
    }
  ]
}
```

### Product Grid Section

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
      "type": "text",
      "label": "Subheading",
      "default": ""
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
      "label": "Desktop Columns",
      "default": "4",
      "options": [
        { "value": "2", "label": "2 Columns" },
        { "value": "3", "label": "3 Columns" },
        { "value": "4", "label": "4 Columns" }
      ]
    },
    {
      "id": "show_vendor",
      "type": "checkbox",
      "label": "Show Vendor",
      "default": false
    },
    {
      "id": "show_sale_badge",
      "type": "checkbox",
      "label": "Show Sale Badge",
      "default": true
    },
    {
      "id": "image_ratio",
      "type": "radio",
      "label": "Image Ratio",
      "default": "square",
      "options": [
        { "value": "portrait", "label": "Portrait" },
        { "value": "square", "label": "Square" },
        { "value": "landscape", "label": "Landscape" }
      ]
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
      "label": "View All URL",
      "default": "/collections/all"
    }
  ]
}
```

### Newsletter Section

```json
{
  "settings": [
    {
      "id": "heading",
      "type": "text",
      "label": "Heading",
      "default": "Subscribe to Our Newsletter"
    },
    {
      "id": "description",
      "type": "textarea",
      "label": "Description",
      "default": "Get the latest updates on new products and upcoming sales."
    },
    {
      "id": "placeholder",
      "type": "text",
      "label": "Email Placeholder",
      "default": "Enter your email"
    },
    {
      "id": "button_text",
      "type": "text",
      "label": "Button Text",
      "default": "Subscribe"
    },
    {
      "id": "background_color",
      "type": "color",
      "label": "Background Color",
      "default": "#f3f4f6"
    },
    {
      "id": "text_color",
      "type": "color",
      "label": "Text Color",
      "default": "#111827"
    },
    {
      "id": "privacy_text",
      "type": "text",
      "label": "Privacy Notice",
      "default": "We respect your privacy. Unsubscribe at any time.",
      "info": "Short text below the form"
    }
  ]
}
```

### Header Component

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
      "id": "text_color",
      "type": "color",
      "label": "Text Color",
      "default": "#111827"
    },
    {
      "id": "sticky",
      "type": "checkbox",
      "label": "Sticky Header",
      "default": true,
      "info": "Header stays visible when scrolling"
    },
    {
      "id": "show_search",
      "type": "checkbox",
      "label": "Show Search",
      "default": true
    },
    {
      "id": "show_account",
      "type": "checkbox",
      "label": "Show Account Link",
      "default": true
    },
    {
      "id": "announcement",
      "type": "text",
      "label": "Announcement Text",
      "default": "",
      "info": "Optional banner above header"
    },
    {
      "id": "announcement_color",
      "type": "color",
      "label": "Announcement Background",
      "default": "#3b82f6"
    }
  ]
}
```

---

## Best Practices

### Naming

- Use descriptive `id` values in snake_case
- Labels should be clear and concise
- Use `info` for additional context

```json
{
  "id": "cta_button_text",
  "label": "Button Text",
  "info": "Text displayed on the call-to-action button"
}
```

### Defaults

- Always provide sensible defaults
- Defaults should result in a working component
- Use common values merchants expect

```json
{
  "id": "columns",
  "type": "number",
  "default": 4,
  "min": 2,
  "max": 6
}
```

### Grouping

Order settings logically:
1. Content (headings, text)
2. Appearance (colors, images)
3. Layout (alignment, spacing)
4. Behavior (toggles, options)

### Help Text

Use `info` to clarify:
- Expected formats
- Recommended sizes
- Behavior changes

```json
{
  "id": "background_image",
  "type": "image",
  "label": "Background Image",
  "info": "Recommended: 1920x800px, JPG or PNG. Image will be centered and cropped to fit."
}
```

### Conditional Settings

Group related settings together so merchants understand dependencies:

```json
{
  "settings": [
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
      "default": "Learn More",
      "info": "Only shown if Show Button is enabled"
    },
    {
      "id": "button_url",
      "type": "url",
      "label": "Button Link",
      "default": "/about",
      "info": "Only shown if Show Button is enabled"
    }
  ]
}
```

---

## Template Integration

### Basic Usage

```django
{# Text #}
<h1>{{ settings.heading }}</h1>

{# With default fallback #}
<p>{{ settings.subtitle|default:"" }}</p>

{# Color #}
<div style="background-color: {{ settings.background_color }}">

{# Checkbox #}
{% if settings.show_button %}
  <a href="{{ settings.button_url }}">{{ settings.button_text }}</a>
{% endif %}

{# Select #}
<div class="layout-{{ settings.layout }}">

{# Number #}
<div class="grid-{{ settings.columns }}">

{# Range with unit #}
<section style="padding: {{ settings.padding }}px">
```

### Combining Settings

```django
<section
  style="
    background-color: {{ settings.background_color }};
    color: {{ settings.text_color }};
    padding: {{ settings.padding_y }}px {{ settings.padding_x }}px;
    text-align: {{ settings.alignment }};
    {% if settings.background_image %}
    background-image: url('{{ settings.background_image }}');
    background-size: cover;
    background-position: center;
    {% endif %}
  "
  class="
    section
    section--{{ settings.layout }}
    {% if settings.full_width %}section--full{% endif %}
  "
>
```

### Optional Elements

```django
{# Only render if value exists #}
{% if settings.heading %}
  <h2>{{ settings.heading }}</h2>
{% endif %}

{% if settings.description %}
  <p>{{ settings.description }}</p>
{% endif %}

{# With default #}
<h2>{{ settings.heading|default:"Welcome" }}</h2>
```

---

## Validation

The validator checks your schema for:

- Valid JSON syntax
- Required fields (id, type, label)
- Valid setting types
- Valid option values for select/radio
- Numeric constraints (min < max)

Run validation:

```bash
spwig validate --verbose
```

---

## Next Steps

- [Component Guide](./COMPONENT_GUIDE.md) - Building components
- [Template Reference](./TEMPLATE_REFERENCE.md) - Template syntax
- [Context Variables](./CONTEXT_VARIABLES.md) - Available data
- [Design Tokens](./DESIGN_TOKENS.md) - Styling system

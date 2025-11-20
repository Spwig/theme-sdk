# Template Reference

Spwig themes use Django/Jinja2 template syntax. This reference covers all the template features you'll need to build pages.

---

## Template Basics

### Syntax Overview

| Syntax | Purpose | Example |
|--------|---------|---------|
| `{{ }}` | Output variables | `{{ product.title }}` |
| `{% %}` | Template tags | `{% if user.is_authenticated %}` |
| `{# #}` | Comments | `{# This is a comment #}` |

### Variable Output

```django
{# Simple variable #}
{{ product.title }}

{# Nested property #}
{{ product.variants.0.price }}

{# With filter #}
{{ product.price|currency }}

{# With default #}
{{ product.description|default:"No description" }}
```

---

## Template Inheritance

### Base Layout

Create a base layout that all pages extend:

**templates/layout.html**
```django
{% load static %}
<!DOCTYPE html>
<html lang="{{ request.LANGUAGE_CODE|default:'en' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}{{ store.name }}{% endblock %}</title>

  {# Favicon #}
  {% if store.favicon %}
    <link rel="icon" href="{{ store.favicon }}">
  {% endif %}

  {# Theme CSS #}
  {% if theme_css_url %}
    <link rel="stylesheet" href="{{ theme_css_url }}">
  {% endif %}

  {# Additional head content #}
  {% block head %}{% endblock %}
</head>
<body class="{% block body_class %}{% endblock %}">
  {# Header #}
  {% block header %}
    {% include "components/headers/default_header/template.html" %}
  {% endblock %}

  {# Main content #}
  <main id="main-content">
    {% block content %}{% endblock %}
  </main>

  {# Footer #}
  {% block footer %}
    {% include "components/footers/default_footer/template.html" %}
  {% endblock %}

  {# Theme JavaScript #}
  {% if theme_js_url %}
    <script src="{{ theme_js_url }}"></script>
  {% endif %}

  {# Additional scripts #}
  {% block scripts %}{% endblock %}
</body>
</html>
```

### Extending Layout

**templates/home.html**
```django
{% extends "layout.html" %}

{% block title %}Home - {{ store.name }}{% endblock %}

{% block body_class %}page-home{% endblock %}

{% block content %}
  {# Hero Section #}
  {% include "components/sections/hero_section/template.html" %}

  {# Featured Products #}
  <section class="featured-products">
    <h2>Featured Products</h2>
    {% include "components/sections/product_grid/template.html" %}
  </section>

  {# Newsletter #}
  {% include "components/sections/newsletter/template.html" %}
{% endblock %}

{% block scripts %}
  <script>
    // Page-specific JavaScript
  </script>
{% endblock %}
```

---

## Page Templates

### Home Page

**templates/home.html**
```django
{% extends "layout.html" %}

{% block title %}{{ store.name }} - {{ store.tagline|default:"Welcome" }}{% endblock %}

{% block content %}
  {% for section in page.sections %}
    {% include section.template with settings=section.settings %}
  {% endfor %}
{% endblock %}
```

### Product Page

**templates/product.html**
```django
{% extends "layout.html" %}

{% block title %}{{ product.title }} - {{ store.name }}{% endblock %}

{% block head %}
  {# Product structured data #}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{{ product.title }}",
    "description": "{{ product.description|striptags|truncatewords:50 }}",
    "image": "{{ product.image }}",
    "offers": {
      "@type": "Offer",
      "price": "{{ product.price }}",
      "priceCurrency": "{{ store.currency }}"
    }
  }
  </script>
{% endblock %}

{% block content %}
  <div class="product-page">
    <div class="product-gallery">
      {# Main image #}
      <div class="main-image">
        <img src="{{ product.image }}" alt="{{ product.title }}" id="main-product-image">
      </div>

      {# Thumbnails #}
      {% if product.images|length > 1 %}
        <div class="thumbnails">
          {% for image in product.images %}
            <button class="thumbnail" data-image="{{ image.url }}">
              <img src="{{ image.thumbnail }}" alt="{{ product.title }} - Image {{ forloop.counter }}">
            </button>
          {% endfor %}
        </div>
      {% endif %}
    </div>

    <div class="product-info">
      <h1 class="product-title">{{ product.title }}</h1>

      {# Price #}
      <div class="product-price">
        {% if product.compare_at_price %}
          <span class="sale-price">{{ product.price|currency }}</span>
          <span class="compare-price">{{ product.compare_at_price|currency }}</span>
          <span class="sale-badge">
            {% widthratio product.price product.compare_at_price 100 as discount %}
            Save {{ 100|add:"-"|add:discount }}%
          </span>
        {% else %}
          <span class="regular-price">{{ product.price|currency }}</span>
        {% endif %}
      </div>

      {# Variants #}
      {% if product.variants|length > 1 %}
        <div class="product-variants">
          <label for="variant-select">Options:</label>
          <select id="variant-select" name="variant_id">
            {% for variant in product.variants %}
              <option value="{{ variant.id }}"
                      data-price="{{ variant.price }}"
                      {% if not variant.available %}disabled{% endif %}>
                {{ variant.title }}
                {% if not variant.available %} - Sold Out{% endif %}
              </option>
            {% endfor %}
          </select>
        </div>
      {% endif %}

      {# Add to cart #}
      <form action="/cart/add" method="post" class="add-to-cart-form">
        {% csrf_token %}
        <input type="hidden" name="product_id" value="{{ product.id }}">
        <input type="hidden" name="variant_id" value="{{ product.variants.0.id }}">

        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" value="1" min="1">
        </div>

        <button type="submit" class="add-to-cart-button"
                {% if not product.available %}disabled{% endif %}>
          {% if product.available %}
            Add to Cart
          {% else %}
            Sold Out
          {% endif %}
        </button>
      </form>

      {# Description #}
      <div class="product-description">
        {{ product.description|safe }}
      </div>
    </div>
  </div>
{% endblock %}
```

### Collection Page

**templates/collection.html**
```django
{% extends "layout.html" %}

{% block title %}{{ collection.title }} - {{ store.name }}{% endblock %}

{% block content %}
  <div class="collection-page">
    {# Collection header #}
    <header class="collection-header">
      <h1>{{ collection.title }}</h1>
      {% if collection.description %}
        <p>{{ collection.description }}</p>
      {% endif %}
    </header>

    {# Filters and sorting #}
    <div class="collection-controls">
      <div class="sort-by">
        <label for="sort">Sort by:</label>
        <select id="sort" name="sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Alphabetically: A-Z</option>
          <option value="created-desc">Newest First</option>
        </select>
      </div>

      <p class="product-count">
        {{ products|length }} product{{ products|length|pluralize }}
      </p>
    </div>

    {# Product grid #}
    <div class="product-grid">
      {% for product in products %}
        <div class="product-card">
          <a href="{{ product.url }}">
            <div class="product-image">
              {% if product.image %}
                <img src="{{ product.image }}" alt="{{ product.title }}" loading="lazy">
              {% endif %}

              {% if product.compare_at_price %}
                <span class="sale-badge">Sale</span>
              {% endif %}
            </div>

            <div class="product-info">
              <h3>{{ product.title }}</h3>
              <div class="price">
                {% if product.compare_at_price %}
                  <span class="sale-price">{{ product.price|currency }}</span>
                  <span class="compare-price">{{ product.compare_at_price|currency }}</span>
                {% else %}
                  {{ product.price|currency }}
                {% endif %}
              </div>
            </div>
          </a>
        </div>
      {% empty %}
        <p class="no-products">No products found in this collection.</p>
      {% endfor %}
    </div>

    {# Pagination #}
    {% if products.has_other_pages %}
      <nav class="pagination">
        {% if products.has_previous %}
          <a href="?page={{ products.previous_page_number }}" class="prev">Previous</a>
        {% endif %}

        <span class="page-info">
          Page {{ products.number }} of {{ products.paginator.num_pages }}
        </span>

        {% if products.has_next %}
          <a href="?page={{ products.next_page_number }}" class="next">Next</a>
        {% endif %}
      </nav>
    {% endif %}
  </div>
{% endblock %}
```

### Cart Page

**templates/cart.html**
```django
{% extends "layout.html" %}

{% block title %}Cart - {{ store.name }}{% endblock %}

{% block content %}
  <div class="cart-page">
    <h1>Your Cart</h1>

    {% if cart.items %}
      <table class="cart-items">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {% for item in cart.items %}
            <tr class="cart-item" data-item-id="{{ item.id }}">
              <td class="item-product">
                <a href="{{ item.product.url }}">
                  {% if item.product.image %}
                    <img src="{{ item.product.image }}" alt="{{ item.product.title }}">
                  {% endif %}
                  <div>
                    <strong>{{ item.product.title }}</strong>
                    {% if item.variant.title != "Default" %}
                      <small>{{ item.variant.title }}</small>
                    {% endif %}
                  </div>
                </a>
              </td>
              <td class="item-price">
                {{ item.price|currency }}
              </td>
              <td class="item-quantity">
                <form action="/cart/update" method="post" class="quantity-form">
                  {% csrf_token %}
                  <input type="hidden" name="item_id" value="{{ item.id }}">
                  <input type="number" name="quantity" value="{{ item.quantity }}" min="0">
                  <button type="submit">Update</button>
                </form>
              </td>
              <td class="item-total">
                {{ item.line_total|currency }}
              </td>
              <td class="item-remove">
                <form action="/cart/remove" method="post">
                  {% csrf_token %}
                  <input type="hidden" name="item_id" value="{{ item.id }}">
                  <button type="submit" aria-label="Remove {{ item.product.title }}">
                    &times;
                  </button>
                </form>
              </td>
            </tr>
          {% endfor %}
        </tbody>
      </table>

      <div class="cart-summary">
        <div class="subtotal">
          <span>Subtotal:</span>
          <span>{{ cart.subtotal|currency }}</span>
        </div>

        {% if cart.discount %}
          <div class="discount">
            <span>Discount:</span>
            <span>-{{ cart.discount|currency }}</span>
          </div>
        {% endif %}

        <div class="total">
          <span>Total:</span>
          <span>{{ cart.total|currency }}</span>
        </div>

        <a href="/checkout" class="checkout-button">
          Proceed to Checkout
        </a>

        <a href="/collections/all" class="continue-shopping">
          Continue Shopping
        </a>
      </div>
    {% else %}
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <a href="/collections/all" class="button">Start Shopping</a>
      </div>
    {% endif %}
  </div>
{% endblock %}
```

---

## Template Tags

### Control Flow

#### if / elif / else

```django
{% if product.available %}
  <button>Add to Cart</button>
{% elif product.coming_soon %}
  <button disabled>Coming Soon</button>
{% else %}
  <button disabled>Sold Out</button>
{% endif %}
```

#### for loop

```django
{% for product in products %}
  <div class="product">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price|currency }}</p>
  </div>
{% empty %}
  <p>No products found.</p>
{% endfor %}
```

**Loop variables:**

| Variable | Description |
|----------|-------------|
| `forloop.counter` | Current iteration (1-indexed) |
| `forloop.counter0` | Current iteration (0-indexed) |
| `forloop.first` | True if first iteration |
| `forloop.last` | True if last iteration |
| `forloop.revcounter` | Iterations remaining |

```django
{% for item in items %}
  <div class="item {% if forloop.first %}first{% endif %} {% if forloop.last %}last{% endif %}">
    {{ forloop.counter }}. {{ item.name }}
  </div>
{% endfor %}
```

### Template Composition

#### extends

```django
{% extends "layout.html" %}
```

#### block

```django
{# In layout.html #}
{% block content %}Default content{% endblock %}

{# In child template #}
{% block content %}
  <h1>Custom content</h1>
{% endblock %}
```

#### include

```django
{# Simple include #}
{% include "components/sections/hero_section/template.html" %}

{# With context variables #}
{% include "partials/product_card.html" with product=item show_price=True %}

{# Only pass specified variables #}
{% include "partials/product_card.html" with product=item only %}
```

### Variable Assignment

#### with

```django
{% with total=cart.items|length %}
  You have {{ total }} item{{ total|pluralize }} in your cart.
{% endwith %}

{# Multiple assignments #}
{% with first_name=user.first_name last_name=user.last_name %}
  Hello, {{ first_name }} {{ last_name }}!
{% endwith %}
```

### Static Files

#### load static

```django
{% load static %}

<link rel="stylesheet" href="{% static 'css/styles.css' %}">
<script src="{% static 'js/main.js' %}"></script>
<img src="{% static 'images/logo.svg' %}" alt="Logo">
```

### URLs

#### url

```django
<a href="{% url 'product_detail' product.slug %}">{{ product.title }}</a>
<a href="{% url 'collection' collection.handle %}">{{ collection.title }}</a>
<form action="{% url 'cart_add' %}" method="post">
```

### Security

#### csrf_token

```django
<form method="post">
  {% csrf_token %}
  <input type="text" name="email">
  <button type="submit">Subscribe</button>
</form>
```

### Comments

```django
{# Single line comment #}

{% comment %}
  Multi-line comment.
  This won't be rendered.
{% endcomment %}
```

---

## Filters

### Text Filters

| Filter | Example | Result |
|--------|---------|--------|
| `lower` | `{{ "HELLO"|lower }}` | hello |
| `upper` | `{{ "hello"|upper }}` | HELLO |
| `title` | `{{ "hello world"|title }}` | Hello World |
| `capfirst` | `{{ "hello"|capfirst }}` | Hello |
| `truncatewords:n` | `{{ text|truncatewords:20 }}` | First 20 words... |
| `truncatechars:n` | `{{ text|truncatechars:100 }}` | First 100 chars... |
| `striptags` | `{{ html|striptags }}` | Remove HTML tags |
| `linebreaks` | `{{ text|linebreaks }}` | Convert \n to `<br>` |
| `slugify` | `{{ "Hello World"|slugify }}` | hello-world |

### Number Filters

| Filter | Example | Result |
|--------|---------|--------|
| `add:n` | `{{ 5|add:3 }}` | 8 |
| `floatformat:n` | `{{ 3.14159|floatformat:2 }}` | 3.14 |
| `divisibleby:n` | `{{ 10|divisibleby:5 }}` | True |

### List Filters

| Filter | Example | Result |
|--------|---------|--------|
| `length` | `{{ items|length }}` | Number of items |
| `first` | `{{ items|first }}` | First item |
| `last` | `{{ items|last }}` | Last item |
| `slice:":3"` | `{{ items|slice:":3" }}` | First 3 items |
| `join:", "` | `{{ items|join:", " }}` | Comma-separated |
| `random` | `{{ items|random }}` | Random item |

### Date Filters

| Filter | Example | Result |
|--------|---------|--------|
| `date:"F j, Y"` | `{{ created|date:"F j, Y" }}` | January 15, 2025 |
| `date:"M d"` | `{{ created|date:"M d" }}` | Jan 15 |
| `time:"H:i"` | `{{ time|time:"H:i" }}` | 14:30 |
| `timesince` | `{{ created|timesince }}` | 2 days ago |

### HTML/Safety Filters

| Filter | Example | Description |
|--------|---------|-------------|
| `safe` | `{{ html|safe }}` | Mark as safe HTML |
| `escape` | `{{ text|escape }}` | Escape HTML entities |
| `linebreaksbr` | `{{ text|linebreaksbr }}` | Convert newlines to `<br>` |
| `urlize` | `{{ text|urlize }}` | Convert URLs to links |

### Spwig Custom Filters

| Filter | Example | Description |
|--------|---------|-------------|
| `currency` | `{{ price|currency }}` | Format as currency |
| `img_url:"size"` | `{{ image|img_url:"medium" }}` | Get sized image URL |
| `pluralize` | `{{ count|pluralize }}` | Add 's' if plural |

```django
{# Currency formatting #}
{{ product.price|currency }}  {# $19.99 #}

{# Pluralize #}
{{ cart.item_count }} item{{ cart.item_count|pluralize }}  {# "1 item" or "5 items" #}
{{ count }} categor{{ count|pluralize:"y,ies" }}  {# "1 category" or "5 categories" #}
```

### Chaining Filters

```django
{{ product.description|striptags|truncatewords:30|default:"No description" }}
```

### Default Values

```django
{{ product.subtitle|default:"" }}
{{ user.name|default:"Guest" }}
{{ settings.button_text|default:"Learn More" }}
```

---

## Common Patterns

### Product Card

```django
<div class="product-card">
  <a href="{{ product.url }}">
    {% if product.image %}
      <img src="{{ product.image }}" alt="{{ product.title }}" loading="lazy">
    {% endif %}

    {% if product.compare_at_price %}
      <span class="sale-badge">Sale</span>
    {% endif %}

    <h3>{{ product.title }}</h3>

    <div class="price">
      {% if product.compare_at_price %}
        <span class="sale-price">{{ product.price|currency }}</span>
        <span class="compare-price">{{ product.compare_at_price|currency }}</span>
      {% else %}
        {{ product.price|currency }}
      {% endif %}
    </div>
  </a>
</div>
```

### Navigation Menu

```django
<nav class="main-nav">
  {% for item in navigation.main_menu %}
    <div class="nav-item {% if item.children %}has-dropdown{% endif %}">
      <a href="{{ item.url }}"
         {% if item.url == request.path %}class="active"{% endif %}>
        {{ item.title }}
      </a>

      {% if item.children %}
        <div class="dropdown">
          {% for child in item.children %}
            <a href="{{ child.url }}">{{ child.title }}</a>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  {% endfor %}
</nav>
```

### Pagination

```django
{% if page_obj.has_other_pages %}
  <nav class="pagination" aria-label="Pagination">
    {% if page_obj.has_previous %}
      <a href="?page=1" aria-label="First page">&laquo;</a>
      <a href="?page={{ page_obj.previous_page_number }}" aria-label="Previous page">&lsaquo;</a>
    {% else %}
      <span class="disabled">&laquo;</span>
      <span class="disabled">&lsaquo;</span>
    {% endif %}

    <span class="current">
      Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}
    </span>

    {% if page_obj.has_next %}
      <a href="?page={{ page_obj.next_page_number }}" aria-label="Next page">&rsaquo;</a>
      <a href="?page={{ page_obj.paginator.num_pages }}" aria-label="Last page">&raquo;</a>
    {% else %}
      <span class="disabled">&rsaquo;</span>
      <span class="disabled">&raquo;</span>
    {% endif %}
  </nav>
{% endif %}
```

### Form with Errors

```django
<form method="post" class="contact-form">
  {% csrf_token %}

  <div class="form-group {% if form.email.errors %}has-error{% endif %}">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" value="{{ form.email.value|default:'' }}">
    {% if form.email.errors %}
      <span class="error">{{ form.email.errors.0 }}</span>
    {% endif %}
  </div>

  <div class="form-group {% if form.message.errors %}has-error{% endif %}">
    <label for="message">Message</label>
    <textarea id="message" name="message">{{ form.message.value|default:'' }}</textarea>
    {% if form.message.errors %}
      <span class="error">{{ form.message.errors.0 }}</span>
    {% endif %}
  </div>

  <button type="submit">Send Message</button>
</form>
```

### Conditional Classes

```django
<div class="hero
            hero--{{ settings.layout }}
            {% if settings.full_width %}hero--full-width{% endif %}
            {% if settings.dark_mode %}hero--dark{% endif %}">
```

### Grid with Dynamic Columns

```django
<div class="grid grid--{{ settings.columns }}-col">
  {% for item in items %}
    <div class="grid-item">
      {{ item.content }}
    </div>
  {% endfor %}
</div>
```

---

## Accessibility

### Semantic HTML

```django
<header role="banner">
  {% include "components/headers/main_header/template.html" %}
</header>

<main id="main-content" role="main">
  {% block content %}{% endblock %}
</main>

<footer role="contentinfo">
  {% include "components/footers/main_footer/template.html" %}
</footer>
```

### ARIA Labels

```django
<button aria-label="Close menu" class="menu-close">
  <svg><!-- icon --></svg>
</button>

<nav aria-label="Main navigation">
  {% for item in navigation.main_menu %}
    <a href="{{ item.url }}">{{ item.title }}</a>
  {% endfor %}
</nav>

<a href="/cart" aria-label="View cart with {{ cart.item_count }} items">
  Cart ({{ cart.item_count }})
</a>
```

### Skip Links

```django
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### Alt Text

```django
{# Product image with meaningful alt #}
<img src="{{ product.image }}" alt="{{ product.title }}">

{# Decorative image #}
<img src="{{ decorative_image }}" alt="" role="presentation">

{# Image with context #}
<img src="{{ product.image }}"
     alt="{{ product.title }} - {{ product.color }} {{ product.size }}">
```

---

## Best Practices

### Performance

- Use `loading="lazy"` for below-fold images
- Minimize template logic complexity
- Cache expensive operations
- Use appropriate image sizes

### Security

- Always use `{% csrf_token %}` in forms
- Escape user input by default
- Only use `|safe` for trusted HTML
- Validate all form inputs server-side

### Maintainability

- Keep templates focused and readable
- Extract reusable patterns to partials
- Use meaningful variable names
- Comment complex logic

### Debugging

```django
{# Debug output #}
{% if debug %}
  <pre>{{ product|pprint }}</pre>
{% endif %}

{# Check if variable exists #}
{% if product %}
  {{ product.title }}
{% else %}
  Product not found
{% endif %}
```

---

## Next Steps

- [Component Guide](./COMPONENT_GUIDE.md) - Building components
- [Context Variables](./CONTEXT_VARIABLES.md) - All available data
- [Design Tokens](./DESIGN_TOKENS.md) - Styling system
- [Settings Schema](./SETTINGS_SCHEMA.md) - Component settings

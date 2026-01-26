# Context Variables Reference

This reference documents all variables available in your Spwig theme templates. These variables provide access to store data, products, cart, navigation, and more.

---

## Global Variables

These variables are available on every page.

### store

Store information and settings.

| Property | Type | Description |
|----------|------|-------------|
| `store.name` | string | Store name |
| `store.tagline` | string | Store tagline/slogan |
| `store.description` | string | Store description |
| `store.logo` | string | Logo URL |
| `store.favicon` | string | Favicon URL |
| `store.email` | string | Contact email |
| `store.phone` | string | Contact phone |
| `store.address` | object | Store address |
| `store.currency` | string | Currency code (USD, EUR, etc.) |
| `store.currency_symbol` | string | Currency symbol ($, €, etc.) |
| `store.locale` | string | Store locale |

**Example:**
```django
<header>
  <a href="/" class="logo">
    {% if store.logo %}
      <img src="{{ store.logo }}" alt="{{ store.name }}">
    {% else %}
      <span>{{ store.name }}</span>
    {% endif %}
  </a>
</header>

<footer>
  <p>&copy; {{ "now"|date:"Y" }} {{ store.name }}</p>
  <p>Contact: {{ store.email }}</p>
</footer>
```

### store.address

| Property | Type | Description |
|----------|------|-------------|
| `store.address.line1` | string | Street address |
| `store.address.line2` | string | Suite, apt, etc. |
| `store.address.city` | string | City |
| `store.address.state` | string | State/province |
| `store.address.postal_code` | string | ZIP/postal code |
| `store.address.country` | string | Country |

**Example:**
```django
<address>
  {{ store.name }}<br>
  {{ store.address.line1 }}<br>
  {% if store.address.line2 %}{{ store.address.line2 }}<br>{% endif %}
  {{ store.address.city }}, {{ store.address.state }} {{ store.address.postal_code }}<br>
  {{ store.address.country }}
</address>
```

---

### navigation

Navigation menus configured in the admin.

| Property | Type | Description |
|----------|------|-------------|
| `navigation.main_menu` | array | Main navigation items |
| `navigation.footer_menu` | array | Footer navigation items |

**Menu Item Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `item.title` | string | Link text |
| `item.url` | string | Link URL |
| `item.children` | array | Nested menu items |
| `item.target` | string | Link target (_blank, etc.) |

**Example:**
```django
<nav class="main-nav">
  {% for item in navigation.main_menu %}
    <div class="nav-item">
      <a href="{{ item.url }}"
         {% if item.target %}target="{{ item.target }}"{% endif %}
         {% if item.url == request.path %}class="active"{% endif %}>
        {{ item.title }}
      </a>

      {% if item.children %}
        <ul class="submenu">
          {% for child in item.children %}
            <li>
              <a href="{{ child.url }}">{{ child.title }}</a>
            </li>
          {% endfor %}
        </ul>
      {% endif %}
    </div>
  {% endfor %}
</nav>
```

---

### cart

Current shopping cart data.

| Property | Type | Description |
|----------|------|-------------|
| `cart.items` | array | Line items in cart |
| `cart.item_count` | int | Total number of items |
| `cart.subtotal` | decimal | Subtotal before discounts |
| `cart.discount` | decimal | Total discounts applied |
| `cart.total` | decimal | Final total |
| `cart.note` | string | Customer note |

**Cart Item Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `item.id` | int | Line item ID |
| `item.product` | object | Product object |
| `item.variant` | object | Variant object |
| `item.quantity` | int | Quantity |
| `item.price` | decimal | Unit price |
| `item.line_total` | decimal | Quantity × price |

**Example:**
```django
{# Cart icon with count #}
<a href="/cart" class="cart-link">
  <svg><!-- cart icon --></svg>
  {% if cart.item_count > 0 %}
    <span class="cart-count">{{ cart.item_count }}</span>
  {% endif %}
</a>

{# Cart items #}
<ul class="cart-items">
  {% for item in cart.items %}
    <li>
      <img src="{{ item.product.image }}" alt="{{ item.product.title }}">
      <div>
        <strong>{{ item.product.title }}</strong>
        {% if item.variant.title != "Default" %}
          <small>{{ item.variant.title }}</small>
        {% endif %}
        <p>{{ item.quantity }} × {{ item.price|currency }}</p>
      </div>
      <span>{{ item.line_total|currency }}</span>
    </li>
  {% endfor %}
</ul>

{# Cart totals #}
<div class="cart-totals">
  <p>Subtotal: {{ cart.subtotal|currency }}</p>
  {% if cart.discount %}
    <p>Discount: -{{ cart.discount|currency }}</p>
  {% endif %}
  <p><strong>Total: {{ cart.total|currency }}</strong></p>
</div>
```

---

### request

Information about the current HTTP request.

| Property | Type | Description |
|----------|------|-------------|
| `request.path` | string | Current URL path |
| `request.GET` | dict | Query parameters |
| `request.LANGUAGE_CODE` | string | Current language |
| `request.user` | object | Current user |

**Example:**
```django
{# Active navigation state #}
<a href="/shop"
   {% if request.path == "/shop" %}class="active"{% endif %}>
  Shop
</a>

{# Query parameters #}
{% if request.GET.search %}
  <p>Search results for: {{ request.GET.search }}</p>
{% endif %}

{# Language #}
<html lang="{{ request.LANGUAGE_CODE|default:'en' }}">
```

---

### user

Current user/customer data (when authenticated).

| Property | Type | Description |
|----------|------|-------------|
| `user.is_authenticated` | bool | User logged in |
| `user.first_name` | string | First name |
| `user.last_name` | string | Last name |
| `user.email` | string | Email address |
| `user.orders` | array | Order history |

**Example:**
```django
{% if user.is_authenticated %}
  <div class="account-menu">
    <span>Hello, {{ user.first_name }}</span>
    <a href="/account">My Account</a>
    <a href="/account/orders">Order History</a>
    <a href="/logout">Sign Out</a>
  </div>
{% else %}
  <div class="auth-links">
    <a href="/login">Sign In</a>
    <a href="/register">Create Account</a>
  </div>
{% endif %}
```

---

### settings

Component settings from schema.json. Available within component templates.

**Example:**
```django
{# In component template #}
<section class="hero"
         style="background-color: {{ settings.background_color }};
                padding: {{ settings.padding }}px 0;">
  <h1 style="color: {{ settings.text_color }}">
    {{ settings.heading }}
  </h1>

  {% if settings.show_button %}
    <a href="{{ settings.button_url }}" class="button">
      {{ settings.button_text }}
    </a>
  {% endif %}
</section>
```

---

## Page-Specific Variables

### Product Page

Available on `/products/{handle}`:

#### product

| Property | Type | Description |
|----------|------|-------------|
| `product.id` | int | Product ID |
| `product.title` | string | Product title |
| `product.handle` | string | URL handle/slug |
| `product.url` | string | Full product URL |
| `product.description` | string | HTML description |
| `product.price` | decimal | Current price |
| `product.compare_at_price` | decimal | Original price (if on sale) |
| `product.image` | string | Featured image URL |
| `product.images` | array | All product images |
| `product.variants` | array | Product variants |
| `product.available` | bool | In stock |
| `product.type` | string | Product type |
| `product.vendor` | string | Vendor/brand |
| `product.tags` | array | Product tags |
| `product.created_at` | datetime | Creation date |
| `product.updated_at` | datetime | Last update |

**Variant Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `variant.id` | int | Variant ID |
| `variant.title` | string | Variant title |
| `variant.price` | decimal | Variant price |
| `variant.sku` | string | SKU |
| `variant.available` | bool | In stock |
| `variant.image` | string | Variant image URL |

**Image Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `image.url` | string | Full size URL |
| `image.thumbnail` | string | Thumbnail URL |
| `image.alt` | string | Alt text |

**Example:**
```django
<div class="product-page">
  {# Gallery #}
  <div class="gallery">
    <img src="{{ product.image }}" alt="{{ product.title }}" id="main-image">

    <div class="thumbnails">
      {% for image in product.images %}
        <button onclick="changeImage('{{ image.url }}')">
          <img src="{{ image.thumbnail }}" alt="">
        </button>
      {% endfor %}
    </div>
  </div>

  {# Info #}
  <div class="info">
    <h1>{{ product.title }}</h1>

    {% if product.vendor %}
      <p class="vendor">by {{ product.vendor }}</p>
    {% endif %}

    {# Price #}
    <div class="price">
      {% if product.compare_at_price %}
        <span class="sale">{{ product.price|currency }}</span>
        <span class="was">{{ product.compare_at_price|currency }}</span>
      {% else %}
        <span>{{ product.price|currency }}</span>
      {% endif %}
    </div>

    {# Variants #}
    {% if product.variants|length > 1 %}
      <select name="variant_id" id="variant-select">
        {% for variant in product.variants %}
          <option value="{{ variant.id }}"
                  data-price="{{ variant.price }}"
                  {% if not variant.available %}disabled{% endif %}>
            {{ variant.title }}
            {% if not variant.available %}- Sold Out{% endif %}
          </option>
        {% endfor %}
      </select>
    {% endif %}

    {# Add to cart #}
    <form action="/cart/add" method="post">
      {% csrf_token %}
      <input type="hidden" name="product_id" value="{{ product.id }}">
      <button {% if not product.available %}disabled{% endif %}>
        {% if product.available %}Add to Cart{% else %}Sold Out{% endif %}
      </button>
    </form>

    {# Description #}
    <div class="description">
      {{ product.description|safe }}
    </div>

    {# Tags #}
    {% if product.tags %}
      <div class="tags">
        {% for tag in product.tags %}
          <a href="/collections/all?tag={{ tag }}">{{ tag }}</a>
        {% endfor %}
      </div>
    {% endif %}
  </div>
</div>
```

---

### Collection Page

Available on `/collections/{handle}`:

#### collection

| Property | Type | Description |
|----------|------|-------------|
| `collection.id` | int | Collection ID |
| `collection.title` | string | Collection title |
| `collection.handle` | string | URL handle |
| `collection.url` | string | Full URL |
| `collection.description` | string | HTML description |
| `collection.image` | string | Collection image URL |

#### products

Paginated list of products in the collection.

| Property | Type | Description |
|----------|------|-------------|
| `products` | array | Product objects |
| `products.has_previous` | bool | Has previous page |
| `products.has_next` | bool | Has next page |
| `products.number` | int | Current page number |
| `products.paginator.num_pages` | int | Total pages |

**Example:**
```django
<div class="collection-page">
  <header>
    <h1>{{ collection.title }}</h1>
    {% if collection.description %}
      <div class="description">{{ collection.description|safe }}</div>
    {% endif %}
  </header>

  {# Product grid #}
  <div class="product-grid">
    {% for product in products %}
      <a href="{{ product.url }}" class="product-card">
        <img src="{{ product.image }}" alt="{{ product.title }}">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price|currency }}</p>
      </a>
    {% empty %}
      <p>No products in this collection.</p>
    {% endfor %}
  </div>

  {# Pagination #}
  {% if products.has_other_pages %}
    <nav class="pagination">
      {% if products.has_previous %}
        <a href="?page={{ products.previous_page_number }}">Previous</a>
      {% endif %}

      <span>Page {{ products.number }} of {{ products.paginator.num_pages }}</span>

      {% if products.has_next %}
        <a href="?page={{ products.next_page_number }}">Next</a>
      {% endif %}
    </nav>
  {% endif %}
</div>
```

---

### Blog Page

Available on `/blog` and `/blog/{handle}`:

#### articles

List of blog articles.

| Property | Type | Description |
|----------|------|-------------|
| `article.id` | int | Article ID |
| `article.title` | string | Article title |
| `article.handle` | string | URL handle |
| `article.url` | string | Full URL |
| `article.content` | string | HTML content |
| `article.excerpt` | string | Short excerpt |
| `article.image` | string | Featured image |
| `article.author` | object | Author info |
| `article.published_at` | datetime | Publish date |
| `article.tags` | array | Article tags |

**Example:**
```django
{# Blog listing #}
<div class="blog-posts">
  {% for article in articles %}
    <article class="post-card">
      {% if article.image %}
        <img src="{{ article.image }}" alt="{{ article.title }}">
      {% endif %}

      <h2><a href="{{ article.url }}">{{ article.title }}</a></h2>

      <p class="meta">
        By {{ article.author.name }} •
        {{ article.published_at|date:"F j, Y" }}
      </p>

      <p>{{ article.excerpt }}</p>

      <a href="{{ article.url }}">Read more</a>
    </article>
  {% endfor %}
</div>

{# Single article #}
<article class="blog-post">
  <h1>{{ article.title }}</h1>

  <p class="meta">
    {{ article.published_at|date:"F j, Y" }} •
    {{ article.author.name }}
  </p>

  {% if article.image %}
    <img src="{{ article.image }}" alt="{{ article.title }}">
  {% endif %}

  <div class="content">
    {{ article.content|safe }}
  </div>

  {% if article.tags %}
    <div class="tags">
      {% for tag in article.tags %}
        <a href="/blog?tag={{ tag }}">{{ tag }}</a>
      {% endfor %}
    </div>
  {% endif %}
</article>
```

---

### Search Results Page

Available on `/search`:

#### search_results

| Property | Type | Description |
|----------|------|-------------|
| `search_results.products` | array | Matching products |
| `search_results.articles` | array | Matching articles |
| `search_results.pages` | array | Matching pages |
| `search_query` | string | Search query |

**Example:**
```django
<div class="search-results">
  <h1>Search Results for "{{ search_query }}"</h1>

  {% if search_results.products %}
    <section>
      <h2>Products</h2>
      <div class="product-grid">
        {% for product in search_results.products %}
          <a href="{{ product.url }}" class="product-card">
            <img src="{{ product.image }}" alt="{{ product.title }}">
            <h3>{{ product.title }}</h3>
            <p>{{ product.price|currency }}</p>
          </a>
        {% endfor %}
      </div>
    </section>
  {% endif %}

  {% if search_results.articles %}
    <section>
      <h2>Blog Posts</h2>
      <ul>
        {% for article in search_results.articles %}
          <li><a href="{{ article.url }}">{{ article.title }}</a></li>
        {% endfor %}
      </ul>
    </section>
  {% endif %}

  {% if not search_results.products and not search_results.articles %}
    <p>No results found for "{{ search_query }}".</p>
  {% endif %}
</div>
```

---

### Account Pages

Available on `/account/*`:

#### orders

Customer order history.

| Property | Type | Description |
|----------|------|-------------|
| `order.id` | int | Order ID |
| `order.order_number` | string | Order number |
| `order.created_at` | datetime | Order date |
| `order.status` | string | Order status |
| `order.total` | decimal | Order total |
| `order.items` | array | Line items |
| `order.shipping_address` | object | Shipping address |

**Example:**
```django
<div class="order-history">
  <h1>Order History</h1>

  {% for order in orders %}
    <div class="order-card">
      <div class="order-header">
        <span>Order {{ order.order_number }}</span>
        <span>{{ order.created_at|date:"F j, Y" }}</span>
        <span class="status status--{{ order.status }}">{{ order.status }}</span>
      </div>

      <div class="order-items">
        {% for item in order.items %}
          <div class="item">
            <img src="{{ item.product.image }}" alt="{{ item.product.title }}">
            <div>
              <p>{{ item.product.title }}</p>
              <p>Qty: {{ item.quantity }}</p>
            </div>
          </div>
        {% endfor %}
      </div>

      <div class="order-footer">
        <span>Total: {{ order.total|currency }}</span>
        <a href="/account/orders/{{ order.id }}">View Details</a>
      </div>
    </div>
  {% empty %}
    <p>No orders yet.</p>
  {% endfor %}
</div>
```

---

## Section/Component Context

When including sections with page schemas, each section receives:

| Variable | Type | Description |
|----------|------|-------------|
| `settings` | object | Section settings from page schema |
| `section.type` | string | Section component type |
| `section.id` | string | Section instance ID |

**Page Schema Example (pages/home.json):**
```json
{
  "page_type": "home",
  "sections": [
    {
      "type": "hero_section",
      "settings": {
        "heading": "Welcome",
        "button_text": "Shop Now"
      }
    },
    {
      "type": "product_grid",
      "settings": {
        "heading": "Featured Products",
        "columns": 4
      }
    }
  ]
}
```

**Rendering sections:**
```django
{% for section in page.sections %}
  <div id="section-{{ forloop.counter }}" class="section section--{{ section.type }}">
    {% include section.template with settings=section.settings %}
  </div>
{% endfor %}
```

---

## Useful Patterns

### Check if Variable Exists

```django
{% if product %}
  {{ product.title }}
{% else %}
  Product not found
{% endif %}

{% if product.image %}
  <img src="{{ product.image }}" alt="{{ product.title }}">
{% endif %}
```

### Empty State Handling

```django
{% for product in products %}
  {{ product.title }}
{% empty %}
  <p>No products found.</p>
{% endfor %}
```

### Conditional Display

```django
{# Show element if value exists and is truthy #}
{% if settings.subtitle %}
  <p>{{ settings.subtitle }}</p>
{% endif %}

{# Show different content based on count #}
{% if cart.item_count == 0 %}
  Your cart is empty
{% elif cart.item_count == 1 %}
  1 item in cart
{% else %}
  {{ cart.item_count }} items in cart
{% endif %}
```

### Debug Output

```django
{# Show all available variables (development only) #}
{% if debug %}
  <pre>{{ product|pprint }}</pre>
{% endif %}
```

---

## Next Steps

- [Template Reference](./TEMPLATE_REFERENCE.md) - Template syntax and patterns
- [Component Guide](./COMPONENT_GUIDE.md) - Building components
- [Settings Schema](./SETTINGS_SCHEMA.md) - Component settings
- [Design Tokens](./DESIGN_TOKENS.md) - Styling system

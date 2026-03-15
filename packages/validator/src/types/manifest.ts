/**
 * Type definitions for theme manifests
 */

/**
 * Changelog entry
 */
export interface ChangelogEntry {
  /** Version number */
  version: string;
  /** Release date (YYYY-MM-DD) */
  date: string;
  /** List of changes */
  changes: string[];
}

/**
 * Color scheme definition
 */
export interface ColorScheme {
  /** Scheme name (e.g., "Light", "Dark") */
  name: string;
  /** Color definitions */
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Theme feature flags
 */
export interface ThemeFeatures {
  /** Whether the theme supports responsive design */
  responsive?: boolean;
  /** Whether the theme uses mobile-first design approach */
  mobile_first?: boolean;
  /** Whether this theme provides dark mode tokens */
  dark_mode?: boolean;
  /** Whether the theme supports right-to-left languages */
  rtl_support?: boolean;
  /** Accessibility standard compliance (e.g., 'WCAG 2.1 AA') */
  accessibility?: string;
  /** Allow additional feature flags */
  [key: string]: boolean | string | undefined;
}

/**
 * Theme manifest structure
 */
export interface ThemeManifest {
  /** Theme identifier (kebab-case) */
  name: string;
  /** URL-safe slug identifier */
  slug?: string;
  /** Component type (always "theme" for themes) */
  component_type?: string;
  /** Semantic version */
  version: string;
  /** Human-readable name */
  display_name: string;
  /** Theme description */
  description: string;
  /** Author/vendor name */
  author: string;
  /** SDK version (e.g., "2.0") */
  sdk_version?: string;
  /** License type */
  license?: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'Proprietary';
  /** Preview image filename */
  preview_image?: string;
  /** Screenshot entries (string path or object with file + optional title) */
  screenshots?: Array<string | { file: string; title?: string }>;
  /** Demo URL */
  demo_url?: string;
  /** Documentation URL */
  documentation_url?: string;
  /** Support URL */
  support_url?: string;
  /** Searchable tags */
  tags?: string[];
  /** Categories */
  categories?: string[];
  /** Color schemes */
  color_schemes?: ColorScheme[];
  /** Feature flags */
  features?: ThemeFeatures;
  /** Minimum platform version */
  min_platform_version?: string;
  /** Maximum platform version */
  max_platform_version?: string;
  /** Changelog */
  changelog?: ChangelogEntry[];
  /** Total package size (added during packaging) */
  total_size_bytes?: number;
  /** File count (added during packaging) */
  file_count?: number;
  /** Package checksum (added during packaging) */
  checksum?: string;
  /** Author website URL (displayed in marketplace) */
  author_url?: string;
  /** Path to design tokens file (e.g., 'tokens.json') */
  design_tokens?: string;
  /** Theme asset file references */
  assets?: {
    css?: string[];
    js?: string[];
    critical_css?: Record<string, string>;
    [key: string]: any;
  };
  /** Components bundled with the theme */
  bundled_components?: Array<{
    type: 'header' | 'footer' | 'section' | 'widget';
    name: string;
    path: string;
  }>;
  /** Page layout schema definitions (legacy) */
  page_schemas?: Record<string, string> | string[];
  /** External dependencies (icon libraries, fonts, etc.) */
  external_dependencies?: Record<string, {
    version?: string;
    cdn?: string;
    integrity?: string;
  }>;
  /** Whether this theme version is deprecated */
  deprecated?: boolean;
  /** Deprecation message explaining upgrade path */
  deprecation_message?: string;
}

/**
 * Element-specific token categories
 * These provide default styling for page builder elements
 */
export interface ElementTokens {
  /** Hero section defaults */
  hero?: Record<string, string>;
  /** Button element defaults */
  button?: Record<string, string>;
  /** Card styling (shared by product cards, testimonials, etc.) */
  card?: Record<string, string>;
  /** Divider element defaults */
  divider?: Record<string, string>;
  /** Form input styling */
  form?: Record<string, string>;
  /** Accordion/FAQ styling */
  accordion?: Record<string, string>;
  /** Modal/popup styling */
  modal?: Record<string, string>;
  /** Countdown timer styling */
  countdown?: Record<string, string>;
  /** Testimonial element styling */
  testimonial?: Record<string, string>;
  /** Blog element styling */
  blog?: Record<string, string>;
  /** Product display styling */
  product?: Record<string, string>;
  /** Category page styling */
  category?: Record<string, string>;
  /** Voucher/coupon code styling */
  voucher?: Record<string, string>;
  /** Heading element defaults */
  heading?: Record<string, string>;
  /** Image element defaults */
  image?: Record<string, string>;
  /** Gallery element defaults */
  gallery?: Record<string, string>;
  /** Other element categories */
  [key: string]: Record<string, string> | undefined;
}

/**
 * Design tokens structure
 */
export interface DesignTokens {
  /** Color palette */
  colors?: Record<string, string>;
  /** Dark mode overrides (requires features.dark_mode: true) */
  dark?: Record<string, string>;
  /** Typography scale (font families, sizes, weights, line heights, letter spacing) */
  typography?: Record<string, string>;
  /** Spacing scale */
  spacing?: Record<string, string>;
  /** Border width and radius values */
  borders?: Record<string, string>;
  /** Shadows */
  shadows?: Record<string, string>;
  /** Transitions (duration and easing) */
  transitions?: Record<string, string>;
  /** Breakpoints */
  breakpoints?: Record<string, string>;
  /** Responsive scaling tokens */
  responsive?: Record<string, string>;
  /** Z-index values */
  'z-index'?: Record<string, string>;
  /** Container settings */
  container?: Record<string, string>;
  /** Menu tokens for navigation styling */
  menu?: Record<string, string>;
  /** Header tokens (includes nested zones) */
  header?: Record<string, any>;
  /** Footer tokens (includes nested zones) */
  footer?: Record<string, any>;
  /** Search component tokens */
  search?: Record<string, string>;
  /** Button primary variant tokens */
  'button-primary'?: Record<string, string>;
  /** Button secondary variant tokens */
  'button-secondary'?: Record<string, string>;
  /** Button neutral variant tokens */
  'button-neutral'?: Record<string, string>;
  /** Button danger variant tokens */
  'button-danger'?: Record<string, string>;
  /** Card default style tokens */
  'card-default'?: Record<string, string>;
  /** Card elevated style tokens */
  'card-elevated'?: Record<string, string>;
  /** Card bordered style tokens */
  'card-bordered'?: Record<string, string>;
  /** Card minimal style tokens */
  'card-minimal'?: Record<string, string>;
  /** Element-specific tokens for page builder elements */
  elements?: ElementTokens;
  /** Widget tokens for header/footer widgets */
  widgets?: Record<string, Record<string, string>>;
  /** Other design tokens */
  [key: string]: any;
}

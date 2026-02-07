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
 * Theme manifest structure
 */
export interface ThemeManifest {
  /** Theme identifier (kebab-case) */
  name: string;
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
  /** Screenshot filenames */
  screenshots?: string[];
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
  /** Feature list */
  features?: string[];
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
  /** Typography scale */
  typography?: Record<string, any>;
  /** Spacing scale */
  spacing?: Record<string, string>;
  /** Breakpoints */
  breakpoints?: Record<string, string>;
  /** Shadows */
  shadows?: Record<string, string>;
  /** Border radius values */
  borderRadius?: Record<string, string>;
  /** Border width values */
  borders?: Record<string, string>;
  /** Transitions */
  transitions?: Record<string, string>;
  /** Z-index values */
  'z-index'?: Record<string, string>;
  /** Container settings */
  container?: Record<string, string>;
  /** Menu tokens for navigation styling */
  menu?: Record<string, string>;
  /** Search component tokens */
  search?: Record<string, string>;
  /** Element-specific tokens for page builder elements */
  elements?: ElementTokens;
  /** Other design tokens */
  [key: string]: any;
}

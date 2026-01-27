/**
 * Type definitions for theme and component manifests
 */

/**
 * Reference to a bundled component in theme manifest
 */
export interface BundledComponentRef {
  /** Component type */
  type: 'header' | 'footer' | 'section' | 'utility';
  /** Component name */
  name: string;
  /** Relative path to component directory */
  path: string;
}

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
 * Component dependency
 */
export interface ComponentDependency {
  /** Component name */
  name: string;
  /** Minimum version (optional) */
  min_version?: string;
  /** Maximum version (optional) */
  max_version?: string;
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
  /** License type */
  license?: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'Proprietary';
  /** Bundled components */
  bundled_components?: BundledComponentRef[];
  /** Page schema paths */
  page_schemas?: {
    home?: string;
    product?: string;
    collection?: string;
    cart?: string;
    checkout?: string;
    landing?: string;
    [key: string]: string | undefined;
  };
  /** Design tokens file path */
  design_tokens?: string;
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
 * Component manifest structure
 */
export interface ComponentManifest {
  /** Component identifier */
  name: string;
  /** Semantic version */
  version: string;
  /** Human-readable name */
  display_name: string;
  /** Component description */
  description: string;
  /** Author name */
  author: string;
  /** Tier compatibility */
  tier_compatibility: ('A' | 'B' | 'C')[];
  /** Allowed regions */
  regions: string[];
  /** Component category */
  category: string;
  /** Searchable tags */
  tags?: string[];
  /** Asset declarations */
  assets?: {
    css?: string[];
    js?: string[];
    images?: string[];
  };
  /** Supported locales */
  locales?: string[];
  /** Preview image filename */
  preview?: string;
  /** Dependencies */
  dependencies?: ComponentDependency[];
  /** Props schema (optional, can be in separate file) */
  props_schema?: Record<string, any>;
}

/**
 * Page schema structure (simplified - actual structure is flexible)
 */
export interface PageSchema {
  /** Page type */
  page_type: string;
  /** Layout sections */
  sections: any[];
  /** Other page-specific config */
  [key: string]: any;
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
  /** Transitions */
  transitions?: Record<string, string>;
  /** Z-index values */
  'z-index'?: Record<string, string>;
  /** Container settings */
  container?: Record<string, string>;
  /** Menu tokens for navigation styling */
  menu?: Record<string, string>;
  /** Other design tokens */
  [key: string]: any;
}

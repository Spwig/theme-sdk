# Theme Distribution & Developer Agreement Notes

## Current Status

The Spwig Theme SDK is licensed under **Apache License 2.0**, which covers:
- ✅ The SDK tools (@spwig/theme-cli, @spwig/theme-validator)
- ✅ Free use by developers
- ✅ Patent protection
- ✅ Commercial-friendly for the SDK itself

## Important: SDK License ≠ Theme Distribution Rights

The Apache 2.0 license covers the **SDK tools**, but does NOT automatically restrict what developers do with themes they create.

To enforce your business model:
1. SDK can be used freely (Apache 2.0) ✅
2. Anyone can create themes ✅
3. Themes must be distributed ONLY through Spwig (with revenue share) ⚠️ **Needs separate agreement**

## What You Need: Spwig Developer Agreement

You need a separate **Developer Agreement** or **Terms of Service** that developers must accept when:
- Registering as a theme developer
- Submitting themes to your marketplace
- Uploading themes through the upgrade server

### Example Developer Agreement Structure

```
SPWIG THEME DEVELOPER AGREEMENT

1. THEME DISTRIBUTION RIGHTS
   - All themes created for the Spwig platform must be distributed exclusively
     through the Spwig Theme Marketplace.
   - Developers may not sell, distribute, or license themes created for Spwig
     through any third-party channels without written permission from Spwig.

2. REVENUE SHARING
   - Themes sold through the Spwig Marketplace are subject to revenue sharing:
     [X]% to developer, [Y]% to Spwig.

3. VALIDATION REQUIREMENTS
   - All themes must pass Spwig's automated validation before submission.
   - Spwig reserves the right to reject themes that don't meet quality standards.

4. INTELLECTUAL PROPERTY
   - Developers retain ownership of their theme code and designs.
   - By submitting to Spwig, developers grant Spwig a license to distribute
     and display themes on the Spwig platform.

5. SDK USAGE
   - The Spwig Theme SDK is provided under Apache License 2.0.
   - This agreement governs distribution of THEMES, not the SDK tools.
```

## Implementation Points

1. **Developer Portal**: Create registration flow where developers accept Terms
2. **SDK Messaging**: Add notices in CLI that themes must be submitted to Spwig
3. **Validation Integration**: Add terms acceptance check in packaging
4. **Theme Manifest**: Include `"marketplace": "spwig"` field

## Example: How Other Platforms Handle This

- **Unity**: Free SDK, but Asset Store has separate distribution terms
- **Shopify**: Free Theme Kit, but Theme Store has distribution agreement
- **Apple**: Free Xcode, but App Store has separate developer agreement

## Recommended Next Steps

1. Draft Spwig Developer Agreement with legal counsel
2. Create developer registration/acceptance flow
3. Add terms reference to SDK documentation
4. Include notice in CLI when packaging themes

## Files Created/Modified

- ✅ LICENSE - Apache 2.0
- ✅ NOTICE - Apache attribution
- ✅ README.md files (all packages)
- ✅ package.json (license: Apache-2.0)

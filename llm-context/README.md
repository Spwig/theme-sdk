# LLM Context Files

Self-contained context files for AI-assisted Spwig theme development. Paste these into your AI assistant (ChatGPT, Claude, Cursor, etc.) so it understands the Spwig theme system.

## Files

| File | Format | Use Case |
|---|---|---|
| `theme-development.md` | Markdown | Paste into chat conversations or Cursor context |
| `theme-development.json` | JSON | System prompts, tool-use APIs, or programmatic injection |

## How to Use

### Chat-based (ChatGPT, Claude)
1. Copy the contents of `theme-development.md`
2. Paste it as the first message or in a "system prompt" / "custom instructions" field
3. Ask your questions about Spwig theme development

### IDE-based (Cursor, Windsurf, Claude Code)
1. Add `theme-development.md` to your project's context files (e.g., `.cursorrules`, `CLAUDE.md`)
2. The AI will automatically reference it when working on theme files

### API / Programmatic
1. Load `theme-development.json`
2. Include it in the system prompt of your API calls
3. The structured format is optimized for token-efficient LLM consumption

## What's Included

Both files contain identical information in different formats:

- Architecture overview (token-based, no templates/JS)
- Complete token category reference with CSS variable mapping
- Manifest schema (required and optional fields)
- `overrides.css` patterns and techniques
- Platform component classes reference
- CSS cascade/load order
- Progressive enhancement (corner-shape, backdrop-filter)
- Dark theme implementation guide
- Header/footer preset structure
- CLI commands and workflow
- Common gotchas and validation rules

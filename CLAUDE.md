# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js wedding website application for Emmanuel & Diane's wedding on September 14, 2025. The project uses TypeScript, Tailwind CSS, shadcn/ui components, and PostgreSQL (via Neon) for data persistence.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture

### Frontend Structure
- **Next.js App Router**: Located in `/app` directory with page-based routing
- **Component Organization**:
  - `/components/ui/`: shadcn/ui components (button, card, dialog, etc.)
  - `/components/`: Custom components (hero, timeline, wedding-game-v2, etc.)
- **Styling**: Tailwind CSS with custom theme configuration
- **Path Aliases**: `@/*` maps to the root directory

### Database Layer
- **PostgreSQL via Neon**: Connection pool configured in `/lib/db.ts`
- **Tables**:
  - `events_state`: Tracks wedding timeline event statuses
  - `game_registrations`: Stores wedding game participants
  - `game_progress`: Tracks game progression by table
  - `game_config`: Stores game configuration
- **API Routes**: Located in `/app/api/` for backend functionality

### Key Features
1. **Wedding Timeline**: Real-time event tracking system with status updates
2. **Interactive Wedding Game**: Multi-phase game for guests with progress tracking
3. **Demo Mode**: `/demo` page for testing timeline progression
4. **Notification System**: Flash notifications for event updates

### Important Configuration
- **Database Connection**: Uses `DATABASE_URL` environment variable
- **TypeScript**: Strict mode enabled with path aliases
- **Build Settings**: ESLint and TypeScript errors are ignored during builds (see next.config.mjs)

## Testing Approach

The project includes utility scripts in `/scripts/` for testing:
- `init-tables.js`: Initialize database tables
- `test-game.js`: Test game functionality
- `demo-game.js`: Run game demo scenarios

Note: No formal test framework is configured. Testing is done via these utility scripts and the `/demo` page.

## Important Procedures

### Verification with MCP Playwright
**CRITICAL**: MCP Playwright is ALREADY configured in Claude. DO NOT install npm packages.
- Use `mcp__playwright__browser_navigate` to open pages
- Use `mcp__playwright__browser_take_screenshot` for visual verification
- Use `mcp__playwright__browser_click` to interact with elements
- Use `mcp__playwright__browser_evaluate` to scroll or execute JavaScript
- Check the snapshot for text content verification

**IMPORTANT USER PREFERENCE**: Quand l'utilisateur demande de vérifier avec MCP Playwright:
- NE JAMAIS créer de scripts verify-site.js
- NE JAMAIS installer playwright via npm install
- UTILISER directement les outils mcp__playwright__* qui sont déjà disponibles
- Si je ne comprends pas, aller sur internet pour chercher "MCP Playwright Model Context Protocol"

### Modification Workflow
1. ALWAYS use TodoWrite to track all tasks
2. NEVER mark tasks complete without visual verification via MCP Playwright
3. Use MultiEdit for bulk file changes
4. Verify EVERY change with screenshots before proceeding
5. Use Task with subagents for parallel modifications when possible
6. NEVER say "c'est terminé" without MCP Playwright verification

### User Communication Style
- L'utilisateur préfère une communication directe et veut des résultats concrets
- Quand l'utilisateur dit "lance ce putain de MCP", c'est qu'il faut utiliser les outils mcp__playwright__*
- Toujours montrer les captures d'écran comme preuve du travail effectué
- Ne pas improviser, suivre les procédures établies
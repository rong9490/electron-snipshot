# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron desktop application with a tray icon, built with Electron + Vite (electron-vite), featuring a NestJS backend service integrated into the main process and a separate Next.js frontend panel.

**Architecture:**
- **Main Process**: Electron main process with integrated NestJS HTTP server (port 3000)
- **Renderer Process**: React UI (internal Electron window)
- **Panel**: Separate Next.js application (external frontend, managed in `/panel` directory)
- **Build Tool**: electron-vite for development and building
- **Package Manager**: Bun (enforced via preinstall hook)

## Common Development Commands

### Development
```bash
bun run dev          # Start Electron in development mode
bun run start        # Start Electron in preview mode
```

### Building
```bash
bun run build        # Type check + build for production
bun run build:win    # Build Windows installer
bun run build:mac    # Build macOS app
bun run build:linux  # Build Linux packages (AppImage, snap, deb)
bun run build:unpack # Build without packaging (for testing)
```

### Panel (Next.js Frontend)
```bash
bun run panel:install  # Install panel dependencies
bun run panel:dev      # Start Next.js dev server
bun run panel:build    # Build Next.js for production
```

### Testing
```bash
bun run test            # Run all tests (Vitest)
bun run test:watch      # Run tests in watch mode
bun run test:ui         # Run tests with UI
bun run test:coverage   # Generate coverage report
bun run test:api        # Test NestJS API endpoints
```

### Code Quality
```bash
bun run format    # Format code with Biome
bun run lint      # Lint code with Biome
bun run check     # Run Biome check and auto-fix
bun run typecheck # Type check all TypeScript files
```

## Code Architecture

### Main Process Structure

Located in `src/main/`:

**Core Modules** (`src/main/modules/`):
- `EventBus`: Event-driven communication bus
- `ConfigManager`: Configuration persistence (electron-store)
- `StateManager`: Application state management
- `NotificationManager`: System notifications
- `TrayManager`: System tray icon and menu
- `IPCHandlers`: IPC communication with renderer process
- `SystemInfo`: System information collection

**NestJS Integration** (`src/main/nestjs/`):
- `main.ts`: NestJS bootstrap and shutdown functions
- `app.module.ts`: Root module
- `config/`: Server configuration (port 3000, localhost only)
- `modules/`: Feature modules
  - `health/`: Health check endpoints (`/api/health`, `/api/health/info`)
  - `logger/`: Logging service
- `common/`: Filters, interceptors, decorators

**Entry Point** (`src/main/index.ts`):
- Initializes all modules (EventBus, ConfigManager, StateManager, etc.)
- Bootstraps NestJS service on startup
- Handles window creation and tray management
- Single instance lock enforcement

### Renderer Process Structure

Located in `src/renderer/`:
- React 19 with TypeScript
- Vite + HMR via electron-vite
- Alias: `@renderer` → `src/renderer/src`

### Panel Structure (Next.js)

Located in `/panel`:
- Next.js 15 with React 18
- Separate package.json with own dependencies
- Tailwind CSS for styling
- Built independently, served as external UI

### Key Configuration Files

- `electron.vite.config.ts`: electron-vite build configuration
- `vitest.config.ts`: Test setup with aliases and coverage
- `biome.json`: Linting and formatting (tabs, single quotes, no semicolons)
- `electron-builder.yml`: Packaging configuration for Win/Mac/Linux

## TypeScript Configuration

**Main/Preload Process** (`tsconfig.node.json`):
- Experimental decorators enabled (for NestJS)
- Emit decorator metadata enabled (for NestJS)

**Renderer Process** (`tsconfig.web.json`):
- Standard React + TypeScript configuration

**Aliases** (used in both vitest and electron-vite):
- `@renderer` → `src/renderer/src`
- `@main` → `src/main`
- `@preload` → `src/preload`

## NestJS Integration

The NestJS server runs **inside** the Electron main process:
- **Host**: `127.0.0.1` (localhost only)
- **Port**: `3000`
- **Global prefix**: `/api`
- **CORS**: Enabled for development origins

**Lifecycle**:
1. Bootstrap in `src/main/index.ts` after app ready
2. Graceful shutdown on app quit
3. Logs to console with `[NestJSBootstrap]` prefix

**Testing NestJS**:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/info
```

## Testing Guidelines

**Test Files**:
- Unit tests: `*.spec.ts`
- E2E tests: `*.e2e-spec.ts`
- Location: `src/main/__tests__/` and alongside source files

**Setup Files**:
- `test/reflect-metadata.ts`: Reflect-metadata polyfill for NestJS
- `test/setup.vitest.ts`: Test environment setup

**Important**: NestJS tests require `reflect-metadata` to be loaded (configured in vitest.config.ts)

## Code Style (Biome)

- **Indent**: Tabs (2 spaces width)
- **Quotes**: Single quotes
- **Semicolons**: As needed (omit where possible)
- **Trailing commas**: None
- **Line width**: 100 characters

## Package Manager Enforcement

This project **enforces Bun** as the package manager via `preinstall` hook:
```json
"preinstall": "npx only-allow@1.2.2 bun"
```

**Do NOT use npm or pnpm** - the preinstall hook will block them.

## Development Workflow

1. **Making changes**:
   - Edit source files in `src/main/`, `src/renderer/`, or `panel/`
   - Run `bun run dev` for hot reload
   - Changes to NestJS modules require main process restart

2. **Testing changes**:
   - Write tests in `*.spec.ts` files
   - Run `bun run test:watch` during development
   - Ensure `bun run typecheck` passes before committing

3. **Building for production**:
   - Run `bun run build` to compile TypeScript
   - Run `bun run build:win/mac/linux` to create installers
   - Use `bun run verify:build` to validate builds

## Important Notes

- **Single instance**: App uses `app.requestSingleInstanceLock()` to prevent multiple instances
- **Tray mode**: App can run without windows (system tray only)
- **Panel independence**: The `/panel` directory is a separate Next.js app with its own build process
- **NestJS access**: Only accessible while Electron app is running (localhost:3000)

## Documentation

- `NESTJS_GUIDE.md`: Comprehensive NestJS integration guide
- `NESTJS_INTEGRATION_DESIGN.md`: Detailed design documentation
- `scripts/test-api.sh`: API testing script

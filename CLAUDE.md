# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Install dependencies (always use pnpm)
pnpm install

# Build the project (includes automatic version bump)
pnpm build

# Build and publish to npm
pnpm buildAndPublish

# Development mode with watch
pnpm dev

# Linting
pnpm lint
pnpm lintfix

# Format code
pnpm format
```

## Project Architecture

This is an n8n community node package that integrates with the Warmr API. The codebase follows n8n's node development standards with a clear separation of concerns:

### Core Components

1. **Nodes** (`/nodes/Contacts.node.ts`): The main n8n node implementation that defines the UI and operations available in n8n workflows. Currently supports:
   - Get contacts with filters
   - Create contacts (LinkedIn URL required)
   - Update contacts (by LinkedIn URL, email, or UUID)
   - Delete contacts (by LinkedIn URL, email, or UUID)

2. **Services** (`/services/ContactsService.ts`): Business logic layer that handles API communication with the Warmr API at `https://api.warmr.app`. All HTTP requests go through this service layer.

3. **Credentials** (`/credentials/WarmrApi.credentials.ts`): Defines the credential schema for Warmr API authentication using Bearer token.

4. **Types** (`/types/contact.types.ts`): TypeScript type definitions for contacts and API queries.

5. **Utils** (`/utils/request.ts`): HTTP request utilities for API communication.

### Build Configuration

- TypeScript compiles to CommonJS format in the `/dist` directory
- Strict TypeScript checking is enabled
- The package uses n8n-workflow and n8n-core as dependencies
- Build automatically bumps the patch version

### n8n Integration Points

- Node registration happens through `package.json` under the `n8n` field
- Credentials are registered at `dist/credentials/WarmrApi.credentials.js`
- The main node is registered at `dist/nodes/Contacts.node.js`

### Key Development Notes

- Always use absolute paths when building or referencing files
- The node follows n8n's INodeType interface pattern
- API requests should always go through the ContactsService layer
- All new features should maintain the existing service/node separation
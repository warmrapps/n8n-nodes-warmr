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

This is an n8n community node package that integrates with the Warmr v1 API (`https://api.warmr.app/v1`). The codebase follows n8n's node development standards with a clear separation of concerns:

### Core Components

1. **Nodes** (`/nodes/`): n8n node implementations that define the UI and operations available in n8n workflows.
   - `Contacts.node.ts`: List, get, create, update, delete contacts
   - `Lists.node.ts`: CRUD lists + add/remove contacts from lists
   - `Companies.node.ts`: List and get companies

2. **Services** (`/services/`): Business logic layer that handles API communication with the Warmr v1 API. All HTTP requests go through this service layer.
   - `ContactsService.ts`: Contact CRUD operations
   - `ListsService.ts`: List CRUD + membership operations
   - `CompaniesService.ts`: Company read operations

3. **Credentials** (`/credentials/WarmrApi.credentials.ts`): Defines the credential schema for Warmr API authentication using Bearer token (prefix: `wpa_`).

4. **Types** (`/types/`): TypeScript type definitions matching the v1 API schema.
   - `contact.types.ts`: Contact, ContactInput, ContactSearchQuery, PaginatedResponse
   - `list.types.ts`: List, ListInput, ListSearchQuery
   - `company.types.ts`: Company, CompanySearchQuery

5. **Utils** (`/utils/request.ts`): Generic HTTP request utility for API communication.

### Build Configuration

- TypeScript compiles to CommonJS format in the `/dist` directory
- Strict TypeScript checking is enabled
- ESLint with `@typescript-eslint` for linting
- The package uses n8n-workflow and n8n-core as dependencies
- Build automatically bumps the patch version

### n8n Integration Points

- Node registration happens through `package.json` under the `n8n` field
- Credentials: `dist/credentials/WarmrApi.credentials.js`
- Nodes: `dist/nodes/Contacts.node.js`, `dist/nodes/Lists.node.js`, `dist/nodes/Companies.node.js`

### Key Development Notes

- The nodes follow n8n's INodeType interface pattern
- API requests should always go through the service layer
- All new features should maintain the existing service/node separation
- All API calls target the `/v1` prefix

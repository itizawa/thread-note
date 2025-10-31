# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conversation Guidelines

- 常に日本語で会話する

## Test-Driven Development (TDD)

- 原則としてAPIの開発はテスト駆動開発（TDD）で進める
- 期待される入出力に基づき、まずテストを作成する
- 実装コードは書かず、テストのみを用意する
- テストを実行し、失敗を確認する
- テストが正しいことを確認できた段階でコミットする
- その後、テストをパスさせる実装を進める
- 実装中はテストを変更せず、コードを修正し続ける
- すべてのテストが通過するまで繰り返す

## Common Development Commands

### Development
```bash
yarn dev                    # Start development server with Turbopack
yarn build                  # Build for production
yarn start                  # Start production server
yarn lint                   # Run ESLint
yarn fix                    # Run ESLint with auto-fix
yarn test                   # Run tests with Jest
yarn test:watch             # Run tests in watch mode
```

### Database Management
```bash
yarn schema:gen             # Generate Prisma client types after schema changes
yarn migrate:gen <name>     # Create a new migration
yarn migrate                # Apply migrations (production)
yarn migrate:dev            # Apply migrations (development with seeding)
yarn migrate:dev:reset      # Reset database and reseed (development only)
yarn seed                   # Run database seeding
```

### Docker Database
```bash
docker-compose up -d       # Start PostgreSQL database
docker-compose down        # Stop database
```

## High-Level Architecture

### Tech Stack
- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict type checking
- **Prisma** ORM with PostgreSQL
- **tRPC v11** for type-safe API layer
- **NextAuth v5** (beta) for authentication
- **TanStack Query v5** for data fetching and caching
- **Material-UI (MUI) v7** for UI components and styling (primary framework)
- **TailwindCSS v4** (legacy - migrating to MUI)
- **Vercel Blob** for file storage
- **OpenAI SDK** for AI features

### Project Structure
```
/src
├── /app                          # Next.js App Router pages and API routes
│   ├── /api                      # API endpoints
│   │   ├── /auth/[...nextauth]   # NextAuth authentication
│   │   ├── /trpc/[trpc]          # tRPC endpoint
│   │   └── /upload               # File upload (Vercel Blob)
│   ├── /(main)                   # Main authenticated layout group
│   │   └── /dashboard            # Dashboard pages
│   └── /users                    # Public user pages
├── /trpc                         # tRPC layer
│   ├── /routers                  # Domain-specific routers
│   ├── /usecases                 # Business logic layer
│   ├── init.ts                   # tRPC initialization
│   ├── server.tsx                # Server-side tRPC client
│   └── client.tsx                # Client-side tRPC provider
├── /entities                     # Domain entities (Post, Thread, User)
├── /features                     # Feature modules (dashboard, threadDetail, settings)
├── /shared                       # Shared utilities and UI components
│   ├── /components               # MUI-based shared components
│   ├── /ui                       # Legacy UI components (Radix UI)
│   ├── /lib                      # Utility functions
│   └── /consts                   # Constants
├── /contexts                     # React Context providers
└── /types                        # Type definitions
```

### Key Architectural Patterns

#### 1. tRPC API Layer
The application uses three types of procedures:
- `publicProcedure` - No authentication required
- `protectedProcedure` - Requires authenticated user
- `premiumPlanProcedure` - Requires premium subscription

Routers are organized by domain in `/src/trpc/routers/`:
- `threadRouter` - Thread CRUD operations
- `postRouter` - Post management
- `userRouter` - User profile operations
- `fileRouter` - File upload handling
- `tokenRouter` - LLM token usage tracking
- `ogpRouter` - OGP metadata fetching
- `workSpaceRouter` - Workspace management

#### 2. Use Case Layer
Complex business logic is separated into use cases in `/src/trpc/usecases/`:
- `dashboard/` - Dashboard-related operations
- `threadDetail/` - Thread detail operations
- `newThread/` - Thread creation operations

Use cases follow this pattern:
```typescript
export class ListThreadsUseCase {
  async execute(args: Args) {
    // Business logic here
    const threads = await prisma.thread.findMany({ ... })
    return { threads, nextCursor, totalCount }
  }
}
```

#### 3. Database Schema
Key models and relationships:
- `User` has many `Thread`, `Post`, `File`, `LLMTokenUsage`
- `Thread` has many `Post` (cascade delete)
- `Post` can have parent/child relationships (nested replies via `parentId`)
- Soft deletes via `isArchived` flag on posts
- Public/private threads via `isPublic` flag
- Thread status: `WIP` or `CLOSED`

#### 4. Authentication Flow
- NextAuth v5 with Google OAuth provider
- Session stored in database via Prisma adapter
- Protected routes check session in server components
- API protection via tRPC middleware (`protectedProcedure`)

#### 5. File Upload System
- Uses Vercel Blob for storage (100MB limit per user)
- Files tracked in database with metadata
- Upload endpoint at `/api/upload`
- File management in user settings

#### 6. AI Integration
- OpenAI SDK integrated for AI features
- Token usage tracked in `LLMTokenUsage` table
- Model selection available in post creation

#### 7. Component Architecture
Components are organized by feature with this pattern:
```
Feature/
├── index.tsx                    # Exports
├── Feature.tsx                  # Main server component
├── Feature.client.tsx           # Client component ("use client")
├── Feature.layout.tsx           # Layout-only component
└── Feature.skeleton.tsx         # Loading skeleton
```

### Data Fetching Patterns

#### Server-Side (Server Components)
```typescript
import { trpc } from "@/trpc/server"
import { HydrateClient } from "@/trpc/server"

export default async function Page() {
  // Prefetch data on server
  await trpc.thread.listThreadsByCurrentUser.prefetch({ ... })

  return (
    <HydrateClient>
      {/* Client components will use hydrated data */}
    </HydrateClient>
  )
}
```

#### Client-Side
```typescript
"use client"
import { trpc } from "@/trpc/client"

export function ThreadList() {
  const { data } = trpc.thread.listThreadsByCurrentUser.useQuery({ ... })
  // TanStack Query + tRPC integration
}
```

#### Infinite Queries
For lists with pagination:
```typescript
const { data, hasNextPage, fetchNextPage } =
  trpc.thread.listThreadsByCurrentUser.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )
```

### Development Workflow

#### Adding a New Feature

1. **Define the Use Case** (if complex logic needed)
   - Create file in `/src/trpc/usecases/<domain>/`
   - Write tests first (TDD)
   - Implement business logic

2. **Add tRPC Procedures**
   - Add to appropriate router in `/src/trpc/routers/`
   - Use `publicProcedure`, `protectedProcedure`, or `premiumPlanProcedure`
   - Define input schema with Zod
   - Call use case or Prisma directly

3. **Create UI Components**
   - Add to `/src/features/<featureName>/`
   - Use MUI components from `/src/shared/components/`
   - Create skeleton for loading states
   - Separate server and client components

4. **Add Page/Route**
   - Create page in `/src/app/` following App Router conventions
   - Use server components for data fetching
   - Wrap with `HydrateClient` for client-side hydration

#### Modifying Database Schema

1. Edit `/prisma/schema.prisma`
2. Run `yarn migrate:gen <migration-name>` to create migration
3. Run `yarn migrate:dev` to apply locally
4. Run `yarn schema:gen` to update TypeScript types
5. Update affected use cases and routers

#### Working with UI Components

- **Primary Framework**: Use Material-UI (MUI) for all new components
- Shared components in `/src/shared/components/`
- Theme configuration in `/src/contexts/MuiThemeProvider.tsx`
- Legacy components may use Radix UI or TailwindCSS, but migrate to MUI when updating
- Use MUI's `sx` prop for styling instead of TailwindCSS classes
- Import from `@mui/material` (e.g., `Button`, `TextField`, `Box`, `Stack`)
- Use MUI icons from `@mui/icons-material`

Example MUI component:
```typescript
import { Box } from "@/shared/components/Box"
import { Button } from "@/shared/components/Button"

<Box display="flex" gap="16px" p="16px">
  <Button variant="contained" size="large">
    Click me
  </Button>
</Box>
```

### Performance Optimization

- **Server Components**: Use for data fetching when possible
- **Suspense Boundaries**: Wrap async components for streaming
- **Infinite Queries**: Use cursor-based pagination for large lists
- **Virtual Scrolling**: Use `react-virtualized` for long lists
- **Image Optimization**: Use `next/image` with proper sizing

### Testing Strategy

- Use Jest for unit and integration tests
- Test files use `.spec.ts` extension
- Focus on testing use cases (business logic)
- Mock Prisma and external services
- Run `yarn test:watch` during development

### Common Patterns

#### Protected Pages
```typescript
// Server Component
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  if (!session) redirect("/")

  // Page content
}
```

#### Form Handling
```typescript
"use client"
import { trpc } from "@/trpc/client"
import { useForm } from "@tanstack/react-form"

const mutation = trpc.thread.createThread.useMutation()
const form = useForm({ ... })
```

#### Error Handling
- Use `react-error-boundary` for error boundaries
- Show toast notifications with `sonner`
- tRPC errors include typed error codes

### Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for Neon)
- `AUTH_SECRET` - NextAuth secret
- `AUTH_URL` - Application URL
- `GOOGLE_ID` / `GOOGLE_SECRET` - OAuth credentials
- `VERCEL_BLOB_TOKEN` - Vercel Blob storage token
- `OPENAI_API_KEY` - OpenAI API key (optional)

### Important Conventions

- **File Naming**: Use PascalCase for components, camelCase for utilities
- **Imports**: Use absolute imports with `@/` prefix (via tsconfig paths)
- **TypeScript**: Enable strict mode, avoid `any` types
- **Commits**: Follow conventional commits format
- **Code Style**: Use Prettier via ESLint, run `yarn fix` before committing

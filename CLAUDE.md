# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conversation Guidelines

- 常に日本語で会話する

### Test-Driven Development (TDD)

- 原則としてapiの開発はテスト駆動開発（TDD）で進める
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
yarn test                   # Run tests with Jest
yarn test:watch             # Run tests in watch mode
```

### Database Management
```bash
yarn schema:gen             # Generate Prisma client types after schema changes
yarn migrate:gen           # Create a new migration
yarn migrate               # Apply migrations (production)
yarn migrate:dev           # Apply migrations (development with seeding)
yarn seed                  # Run database seeding
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
- **TanStack Query** for data fetching
- **Material-UI (MUI) v7** for UI components and styling (primary framework)
- **TailwindCSS v4** (legacy - migrating to MUI)

### Project Structure
- `/src/app/` - Next.js pages and API routes
- `/src/trpc/` - tRPC routers and configuration
- `/src/entities/` - Domain-specific components (Post, Thread, User)
- `/src/features/` - Feature modules (dashboard, threadDetail, settings)
- `/src/shared/` - Shared utilities and UI components
- `/prisma/` - Database schema and migrations

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

#### 2. Database Schema
Key models and relationships:
- `Thread` has many `Post` (cascade delete)
- `Post` can have parent/child relationships (nested replies)
- `User` owns `Thread` and `Post`
- Soft deletes via `isArchived` flag on posts
- Public/private threads via `isPublic` flag

#### 3. Authentication Flow
- NextAuth v5 with Google OAuth provider
- Session stored in database via Prisma adapter
- Protected routes check session in server components
- API protection via tRPC middleware

#### 4. File Upload System
- Uses Vercel Blob for storage
- Files tracked in database with metadata
- Upload endpoint at `/api/upload`
- File management in user settings

#### 5. AI Integration
- OpenAI SDK integrated for AI features
- Token usage tracked in `LLMTokenUsage` table
- Model selection available in post creation

### Development Notes

When modifying database schema:
1. Edit `/prisma/schema.prisma`
2. Run `yarn migrate:gen` to create migration
3. Run `yarn migrate:dev` to apply locally
4. Run `yarn schema:gen` to update TypeScript types

When working with tRPC:
- Add new procedures to appropriate router in `/src/trpc/routers/`
- Use cases go in `/src/trpc/usecases/` for complex operations
- Client-side usage via hooks from `@/trpc/client`

UI Components:
- **Primary Framework**: Use Material-UI (MUI) for all new components and features
- Shared components in `/src/shared/ui/`
- Theme configuration in `/src/contexts/MuiThemeProvider.tsx`
- Legacy components may use Radix UI or TailwindCSS, but migrate to MUI when updating
- Follow MUI design patterns and component composition
- Use MUI's `sx` prop for styling instead of TailwindCSS classes
- Import components from `@mui/material` (e.g., `Button`, `TextField`, `Box`, `Stack`)
- Use MUI icons from `@mui/icons-material` when needed

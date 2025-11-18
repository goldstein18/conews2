# Project Overview

## Project Purpose
Events Platform Frontend - A modern event management platform with role-based dashboards, company management system, and real-time data via GraphQL. The system is designed around a **company-only model** where all users are companies (no individual members exist).

## Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **API**: BFF + Apollo Client (secure GraphQL proxy)
- **Authentication**: JWT with httpOnly cookies
- **Theme**: Dark/Light theme support via next-themes

## Key System Architecture
- **Security-First**: All GraphQL requests MUST use BFF pattern via `/api/graphql`
- **Company Management**: Dashboard system with status tracking (PENDING → ACTIVE → SUSPENDED → CANCELLED)
- **Multi-Role System**: SUPER_ADMIN, ADMIN, CALENDAR_MEMBER, DINNING_MEMBER, SALES, AGENCY, EDITORIAL_WRITER
- **Dynamic RBAC**: API-driven role and permission management
- **Cursor-based Pagination**: Always use `first`, `after` parameters (no numeric pagination)

## Security Requirements
🚨 **CRITICAL RULES**:
- ALL GraphQL operations via `/api/graphql` endpoint
- JWT tokens in httpOnly cookies ONLY (never localStorage)
- All inputs validated with Zod schemas
- Use `ID!` type for entity IDs in GraphQL mutations
- Dynamic permissions loaded from API (never hardcoded)
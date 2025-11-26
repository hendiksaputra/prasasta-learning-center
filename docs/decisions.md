# Architecture Decisions

## Decision Log

### 2025-01-XX: Tech Stack Selection

**Context**: Need to build a training center website with CMS functionality

**Decision**: Use Laravel (Backend) + Next.js (Frontend) combination

**Alternatives Considered**:
1. **Full Laravel** (Blade templates) - Rejected: Less modern UX, harder to scale frontend
2. **Full Next.js** (Next.js API routes) - Rejected: PHP expertise available, Laravel better for CMS
3. **Laravel + Vue.js** - Rejected: Next.js provides better SEO and performance out of the box

**Rationale**:
- Leverages existing PHP/Laravel expertise
- Next.js provides excellent SEO for course listings
- Separation of concerns: Laravel handles business logic, Next.js handles presentation
- Modern, maintainable architecture
- Easy to scale independently

**Implications**:
- Need to setup CORS for API communication
- Two separate codebases to maintain
- API-first architecture required

---

### 2025-01-XX: Database Selection

**Context**: Need reliable database for training center data

**Decision**: Use MySQL

**Rationale**:
- Matches existing expertise
- Reliable and proven for CMS applications
- Good Laravel integration
- Easy to backup and maintain

---

### 2025-01-XX: Authentication Strategy

**Context**: Need secure authentication for students and admin

**Decision**: Use Laravel Sanctum for API authentication

**Rationale**:
- Native Laravel solution
- Token-based authentication suitable for SPA
- Lightweight and secure
- Easy to implement role-based access

---

### 2025-01-XX: Frontend Styling Approach

**Context**: Need modern, maintainable UI

**Decision**: Use Tailwind CSS + Shadcn/ui components

**Rationale**:
- Tailwind provides utility-first styling
- Shadcn/ui provides accessible, customizable components
- Modern design system
- Easy to customize for brand identity


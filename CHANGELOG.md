# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Admin Route Protection**: Fixed middleware matcher to properly protect `/admin` route. Previously, direct access to `/admin` bypassed authentication. Now all unauthenticated requests to `/admin` are correctly redirected to `/admin/login`. Updated matcher pattern to explicitly match both `/admin` and `/admin/*` paths.

### Security
- **OWASP Top 10 Hardening**: Implemented comprehensive security improvements:
  - **Access Control**: Server-side JWT-based authentication for admin routes with middleware protection
  - **Security Misconfiguration**: Disabled debug mode, configured secure headers, safe error handling
  - **Cryptographic Failures**: Implemented bcrypt for password hashing, secure JWT tokens with HttpOnly cookies
  - **Injection Prevention**: Input validation, XSS prevention with DOMPurify
  - **Authentication**: Secure sessions with JWT, brute-force protection with rate limiting on login endpoint
  - **Rate Limiting**: IP-based rate limiting for admin login (5 attempts per 10 minutes)
  - **Supply Chain Security**: Dependency locking, vulnerability scanning with `npm audit`
  - **CI/CD Security**: Added GitHub Actions workflow for automated lint, build, and security scanning

### Added
- **CI Automation**: GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push/PR to main:
  - Lint checks (`npm run lint`)
  - Build verification (`npm run build`)
  - Security scanning (`npm run security:scan`)
- **Admin Authentication**: 
  - JWT-based session management with HttpOnly cookies
  - Server-side middleware protection for all `/admin` routes
  - Rate limiting on login endpoint (5 attempts per 10 minutes per IP)
- **Homepage Improvements (Slice 1)**:
  - Enhanced hero section with primary CTA "Find a Store Near You" and secondary CTA "See Current Deals"
  - Added trust chips (24/7 availability, rewards program)
  - Added dedicated trust/proof strip (locations, hours, rewards value)
  - Current Promos section with "Browse All Deals" and "Join Rewards" action buttons
- **Stores Experience (Slice 2)**:
  - City filter chips combined with search query
  - Mobile-only "Store List / Map View" toggle
  - Prominent "Call" and "Directions" buttons on store cards and map header
  - Added "Call Store" button on store detail pages
- **Deals Page (Slice 3)**:
  - Scroll-direction behavior for sticky category filter bar
  - Filter bar hides on downward scroll (mobile) and reappears on upward scroll or near top

### Changed
- **ESLint Configuration**: Migrated to Next.js 16 compatible flat config format (`eslint.config.mjs`)
- **Dependencies**: Updated to Next.js 16.1.6, React 19.2.3, and aligned TipTap packages to 2.27.2
- **Build Process**: Stabilized lint/build process for Next.js 16

### Fixed
- **React Hydration Errors**: 
  - Fixed hydration error in `SocialShare` component by conditionally rendering native share button after mount
  - Fixed hook-order issues in `TextWidget` and blog slug page
- **Port Conflicts**: Resolved port 3001 conflicts during development
- **TypeScript Build Errors**: Resolved all TypeScript compilation errors including:
  - RichTextEditor imageNode type issues
  - HeadingWidget JSX namespace
  - ImageNode ReactNodeViewProps compatibility
  - ProseMirror Node type imports
- **Vercel Build Failures**: 
  - Removed unused Leaflet CSS imports
  - Added missing dependencies (TipTap, date-fns, @dnd-kit packages)
- **UI/UX Issues**:
  - Fixed navbar dropdown gap
  - Standardized corner rounding across components
  - Fixed timeline line container positioning issues
  - Updated hero banners and promo cards
  - Standardized Rewards hero section to match Deals, Services, and Drinks pages

## [Previous Work]

### Added
- Blog functionality with placeholder images and unified data source
- Drinks page with admin management
- Pagination to deals page
- Stores page redesign and pre-launch optimizations
- Security updates: Upgraded Next.js to 16.0.10 and 16.0.7 to address CVEs

---

## Notes

- All security improvements follow OWASP Top 10 guidelines
- CI/CD pipeline enforces code quality and security standards
- Admin authentication uses server-side JWT verification for maximum security
- Client-side `sessionStorage` checks are redundant but kept as fallback (middleware is the primary protection)

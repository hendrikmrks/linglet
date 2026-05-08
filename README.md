# Linglet - Language Learning App with Gamification

A modern, full-stack language learning web application built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Features gamification mechanics (XP, streaks), authentication, and Free/Premium plan tiers.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Edge Runtime Compatible)
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: Prisma
- **Authentication**: Manual session management with bcryptjs
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Package Manager**: npm

## Prerequisites

- Node.js 18+ (LTS recommended)
- Docker & Docker Compose
- npm

## Quick Start

### 1. Clone & Setup Environment

```bash
# Copy environment file
cp .env.example .env

# Verify .env contains:
# DATABASE_URL="postgresql://postgres@localhost:5432/linglet?schema=public"
# AUTH_SECRET="dev_only_replace_me"
# NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d
```

Verify the database is running:
```bash
docker compose logs db
# Look for: database system is ready to accept connections
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

Create tables:
```bash
npm run prisma:migrate
```

Seed test data:
```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Access the app at **http://localhost:3000**

## Scripts

```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create/apply database migrations
npm run db:seed          # Seed database with test data
```

## Test Logins

After seeding, use these credentials:

**Free Account**
- Email: `test@example.com`
- Password: `Passw0rd!`
- Plan: FREE
- XP: 123
- Streak: 3

**Premium Account**
- Email: `premium@example.com`
- Password: `Passw0rd!`
- Plan: PREMIUM
- XP: 987
- Streak: 12

## Project Structure

```
Linglet-app/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx              # Root layout with Navbar
│  │  ├─ globals.css             # Tailwind reset & base styles
│  │  ├─ page.tsx                # Landing page
│  │  ├─ login/page.tsx          # Login page
│  │  ├─ register/page.tsx       # Registration page
│  │  ├─ dashboard/page.tsx      # Protected dashboard (XP, streaks)
│  │  ├─ profile/page.tsx        # Edit name & avatar
│  │  ├─ settings/password/page.tsx  # Change password
│  │  └─ api/
│  │     ├─ auth/register/route.ts   # Register endpoint
│  │     ├─ auth/login/route.ts      # Login endpoint
│  │     ├─ auth/logout/route.ts     # Logout endpoint
│  │     ├─ auth/me/route.ts         # Get current user
│  │     └─ user/
│  │        ├─ profile/route.ts      # GET/PUT user profile
│  │        └─ password/route.ts     # PUT change password
│  ├─ components/
│  │  ├─ navbar.tsx              # Navigation bar with user menu
│  │  ├─ auth-form.tsx           # Reusable auth form (login/register)
│  │  ├─ protected.tsx           # Client wrapper for protected pages
│  │  └─ ui/
│  │     ├─ button.tsx           # Button component
│  │     ├─ input.tsx            # Input component
│  │     └─ form.tsx             # Form wrapper
│  ├─ lib/
│  │  ├─ db.ts                   # Prisma client singleton
│  │  ├─ auth.ts                 # Session & auth helpers
│  │  ├─ validators.ts           # Zod schemas
│  │  └─ premium.ts              # Premium logic helpers
│  └─ middleware.ts              # Route protection middleware
├─ prisma/
│  ├─ schema.prisma              # Database schema
│  └─ seed.ts                    # Seed script for test data
├─ docker-compose.yml            # PostgreSQL container config
├─ .env.example                  # Environment template
├─ package.json                  # Dependencies & scripts
├─ tsconfig.json                 # TypeScript config
├─ next.config.js                # Next.js config
├─ tailwind.config.ts            # Tailwind CSS config
├─ postcss.config.js             # PostCSS config
└─ README.md                      # This file
```

## Features Implemented

### Authentication
- ✅ Email/password registration with Zod validation
- ✅ Email/password login with session cookies (httpOnly)
- ✅ Logout with session cleanup
- ✅ Protected routes via middleware
- ✅ Auto-login after registration

### User Profiles
- ✅ Edit name and avatar URL
- ✅ View plan status (FREE/PREMIUM)
- ✅ Change password with current password verification
- ✅ Session-based authentication

### Gamification
- ✅ XP tracking (placeholder values in seed data)
- ✅ Streak system with `streakCount` and `streakUpdatedAt`
- ✅ Dashboard display of XP and streaks
- ✅ Progress bar toward next level

### Plans & Gating
- ✅ FREE and PREMIUM plan tiers
- ✅ Plan display in navbar dropdown
- ✅ Premium indicator on dashboard
- ✅ `isPremium()` helper for business logic
- ✅ Plan fields on User model

### UI/UX
- ✅ Responsive Tailwind CSS design
- ✅ Form validation with error messages
- ✅ Loading states and success feedback
- ✅ Navbar with authenticated user menu
- ✅ Landing page with feature highlights

## Security Considerations

### Current Implementation
- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ Sessions stored in database with expiration
- ✅ httpOnly cookies (not accessible to JavaScript)
- ✅ Server-side password verification
- ✅ Zod input schema validation
- ✅ Middleware-based route protection

### Production Recommendations
- ⚠️ Set strong `AUTH_SECRET` environment variable
- ⚠️ Use `secure: true` for cookies in HTTPS environments
- ⚠️ Configure PostgreSQL with password authentication (not Trust Mode)
- ⚠️ Implement rate limiting on authentication endpoints
- ⚠️ Add CSRF protection
- ⚠️ Implement email verification for new accounts
- ⚠️ Add password reset flow with time-limited tokens
- ⚠️ Enable HTTPS in production
- ⚠️ Use environment-specific secrets management (e.g., AWS Secrets Manager)
- ⚠️ Implement logging and monitoring

## Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset flow with email link
- [ ] Social login (Google, GitHub)
- [ ] Lesson system with XP rewards
- [ ] Leaderboard functionality
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Admin dashboard
- [ ] Payment processing for Premium tier
- [ ] User statistics and analytics
- [ ] Comment & community features

## Database Schema

### User
- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `name`: User display name
- `avatarUrl`: Optional avatar image URL
- `plan`: FREE or PREMIUM
- `xp`: Experience points (gamification)
- `streakCount`: Current learning streak
- `streakUpdatedAt`: Last streak update
- `createdAt`: Account creation timestamp
- `updatedAt`: Last profile update timestamp
- **Relation**: `sessions` (one-to-many)

### Session
- `id`: Unique identifier (CUID)
- `userId`: Foreign key to User
- `sessionToken`: Unique session token
- `expiresAt`: Session expiration timestamp
- **Relation**: `user` (many-to-one)

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if container is running
docker compose ps

# View logs
docker compose logs db

# Restart database
docker compose restart db
```

### Migration Failures
```bash
# Reset database (warning: deletes all data)
npx prisma migrate reset

# Or create fresh migration
npm run prisma:migrate -- --name init
```

### Seed Script Issues
```bash
# Ensure TypeScript is configured
npx ts-node --project tsconfig.json prisma/seed.ts

# Or manually create users via database client
```

### Port Conflicts
If port 5432 (PostgreSQL) or 3000 (Next.js) are in use:
```bash
# Change PostgreSQL port in docker-compose.yml
# Change Next.js port with: PORT=3001 npm run dev
```

## Environment Variables

```env
# Database connection (PostgreSQL)
DATABASE_URL="postgresql://postgres@localhost:5432/linglet?schema=public"

# Session encryption secret (change in production)
AUTH_SECRET="dev_only_replace_me"

# Application URL (for cookies and redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node environment (development|production)
NODE_ENV="development"
```

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m 'feat: add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Prisma, and Tailwind CSS

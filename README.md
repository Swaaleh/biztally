# Biztally


**Biztally** is a comprehensive sales management application built with modern web technologies to help small businesses streamline their operations. This full-stack application features product inventory management, customer relationship tracking, sales recording, and real-time analytics.

## ✨ Key Features

- **User Authentication**: Secure login with email/password
- **Dashboard Analytics**: Revenue, sales, and customer metrics
- **Product Management**: Track inventory with CRUD operations
- **Customer CRM**: Maintain customer profiles and history
- **Sales Processing**: Create transactions with automatic calculations
- **Reporting**: Visualize sales trends with interactive charts
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🚀 Tech Stack

**Frontend**: Next.js 15 (App Directory), React 19, Tailwind CSS v4
**Backend**: Next.js API Routes & Server Actions
**Database**: Supabase (PostgreSQL)
**Authentication**: Supabase Auth (middleware-protected routes)
**Deployment**: Vercel

## 🛠️ Best Practices & Architecture

- **App Directory**: Uses Next.js 15 app directory for clear separation of server/client components. Async server components only import client components for rendering, never for logic.
- **Styling**: All UI uses Tailwind CSS v4 utility classes. No custom CSS; theming uses Tailwind color tokens and dark mode support.
- **Authentication**: Route protection is handled by Next.js middleware and Supabase session checks. No duplicate auth logic in layouts/components.
- **Supabase Usage**: All data access and auth logic is handled via server actions and Supabase client/server separation. Environment variables are securely loaded from `.env.local`.
- **Responsive Design**: Layouts use responsive grid/flex utilities, breakpoints (`sm:`, `md:`, `lg:`), and max-widths for mobile/tablet/desktop support.
- **Accessibility**: Sidebar, overlays, and buttons are keyboard accessible. Color contrast and focus states are improved.
- **Error Handling**: All server actions and Supabase calls include error handling and logging. User-facing errors are displayed in the UI where appropriate.

## 📁 Project Structure

- `app/` — Next.js app directory (layouts, pages, components)
- `app/_components/` — Shared client components (Sidebar, ThemeProvider, ThemeToggle)
- `app/_utils/` — Helpers, Supabase client/server, middleware
- `app/(main)/` — Main authenticated app routes (dashboard, products, etc.)
- `app/(auth)/` — Auth routes (login, actions)
- `middleware.ts` — Next.js middleware for session management and route protection

## 📝 Environment Setup

1. Copy `.env.local.example` to `.env.local` and add your Supabase keys
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## 📚 Further Reading

- [Next.js App Directory](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/docs/upgrade-guide)
- [Supabase Auth](https://supabase.com/docs/guides/auth)


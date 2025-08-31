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

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 🏗️ Project Structure
biztally-app/
├── app/                  # Main directory for all your application's routes and components
│   ├── (auth)/             # Route group for authentication pages (login, signup, etc.)
│   │   └── login/
│   │       └── page.tsx
│   ├── (main)/             # Route group for the main application pages
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── customers/
│   │   │   └── page.tsx
│   │   └── sales/
│   │       └── page.tsx
│   ├── _components/        # Reusable UI components (Sidebar, Card, Table, etc.)
│   │   └── Sidebar.tsx
│   ├── _utils/             # Utility functions and our Supabase client
│   │   └── supabase.ts
│   ├── layout.tsx          # Our root layout (with the sidebar and main content area)
│   ├── globals.css         # Tailwind CSS base styles
│   └── page.tsx            # Our main homepage, currently the dashboard
├── public/               # Static assets (images, fonts, etc.)
├── .env.local            # Environment variables (our Supabase keys)
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
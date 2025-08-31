# ModBrew Website

A complete coffee shop management system with a beautiful landing page and comprehensive admin dashboard in a single React application.

## Project Structure

```
modbrew-website/
├── modbrew-landing/     # Main React app with landing page and admin dashboard
├── modbrew-admin/       # Legacy admin dashboard (kept for reference)
└── package.json         # Root package.json for easy development
```

## Features

### Landing Page
- Beautiful, responsive landing page at `/`
- Coffee-themed design with amber/orange color scheme
- Feature showcase
- Call-to-action sections
- Navigation to admin dashboard

### Admin Dashboard
- Complete coffee shop management system at `/admin`
- Sales tracking and analytics
- Customer management
- Product/inventory management
- Expense tracking
- Modern dashboard UI with sidebar navigation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

1. Install dependencies:
```bash
npm run install:all
```

2. Start the development server:
```bash
npm run dev
```

This will start the single application on http://localhost:5173

### Building for Production

Build the application:
```bash
npm run build
```

## Navigation

- **Landing Page**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin

## Technology Stack

### Landing Page
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- React Router

### Admin Dashboard
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- React Router
- Recharts (for analytics)
- Framer Motion (for animations)

## Development Notes

- Both projects use the same UI component library (Radix UI + Tailwind)
- Shared design system and color scheme
- Landing page redirects `/admin/*` routes to the admin dashboard
- Admin dashboard runs on port 3001 to avoid conflicts
- Workspace setup allows for easy dependency management

## Scripts

- `npm run dev` - Start both development servers
- `npm run dev:landing` - Start only landing page
- `npm run dev:admin` - Start only admin dashboard
- `npm run build` - Build both projects
- `npm run install:all` - Install dependencies for all projects
- `npm run clean` - Clean node_modules and dist folders
# modbrew

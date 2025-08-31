# Mod Brew Coffee Shop Dashboard

A modern, responsive dashboard for managing a coffee shop business built with React, TypeScript, and Tailwind CSS.

## Features

- **Home Dashboard**: Overview of daily operations, recent orders, and quick actions
- **Customer Management**: Track customer information, loyalty status, and order history
- **Sales Tracking**: Monitor sales performance, hourly trends, and order management
- **Expense Management**: Track business expenses, categorize spending, and budget monitoring
- **Product Catalog**: Manage menu items, inventory, and pricing
- **Analytics**: Comprehensive insights with charts and performance metrics

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
modbrew/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components (sidebar, navbar)
│   ├── pages/            # Main application pages
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── package.json
```

## Pages

- **Home**: Dashboard overview with key metrics and recent activity
- **Customers**: Customer directory with contact info and order history
- **Sales**: Sales tracking with charts and order management
- **Expenses**: Expense tracking and budget monitoring
- **Products**: Product catalog and inventory management
- **Analytics**: Comprehensive analytics with charts and insights

## Design Features

- Modern, clean interface with coffee shop branding
- Responsive design that works on all devices
- Smooth animations and transitions
- Intuitive navigation with sidebar menu
- Real-time data visualization with charts
- Consistent color scheme with amber/orange coffee theme

## Customization

The dashboard is designed to be easily customizable:

- Update colors in `tailwind.config.js`
- Modify sidebar navigation in `AppSidebar.tsx`
- Add new pages by creating components in the `pages/` directory
- Customize charts and data visualization in individual page components

## License

This project is for demonstration purposes.


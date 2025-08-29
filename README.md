# Rewards Admin Dashboard

A React + Vite admin dashboard for managing a rewards system with users, activities, goals, and redemptions.

## Quick Start

1. **Install dependencies:**
npm install


2. **Environment setup:**
- Rename `file.env` to `.env`
- Update API base URL if needed: `VITE_API_BASE_URL=http://localhost:8081/api`

3. **Start development server:**
npm run dev


4. **Build for production:**
npm run build


## Features

- **Users**: Manage user accounts, admin status, and points
- **Activities**: Track user activities with types and dates
- **Goals**: Set and monitor goal achievements
- **Rewards**: Manage earned rewards linked to goals or activities
- **Partners**: Handle partner integrations and API keys
- **Catalog**: Maintain reward catalog items with points and validity
- **Redemptions**: Process reward redemptions and track status

## API Requirements

The backend should provide REST endpoints for:
- `/users` - User CRUD operations
- `/activities` - Activity tracking
- `/goals` - Goal management
- `/rewards` - Reward distribution
- `/partners` - Partner management
- `/reward-catalog` - Catalog items
- `/redemptions` - Redemption processing

## Development

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Type checking**: Enable TypeScript for better DX

## Architecture

- Generic `CrudPage` component handles all entity operations
- Centralized API client with error handling and dev logging
- React Router for navigation with sidebar layout
- Responsive design with CSS custom properties

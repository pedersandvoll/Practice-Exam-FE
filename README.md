# Kundeklager-360

A customer complaint management system built with React, TypeScript, and Vite.

## Features

- User authentication (login/register)
- Create, view, and edit customer complaints
- Filter and search complaints
- Add comments to complaints
- Categorize complaints
- Set priority and status for complaints

## Technologies

- React 19
- TypeScript
- Vite
- TanStack Router for routing
- TanStack Query for data fetching
- TanStack Form for form handling
- Material UI for UI components
- Zod for schema validation

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Start the [backend](https://github.com/pedersandvoll/Practice-Exam-BE) server (required for the application to work):

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm lint` - Run ESLint to check for code quality issues
- `pnpm preview` - Preview the production build locally

## API Configuration

The application communicates with a backend API running on `http://localhost:3000`. Ensure the backend server is running before using the application.

## Authentication

The application uses JWT-based authentication. After login, the token is stored in localStorage and included in subsequent API requests.

## Project Structure

- `/src/apis` - API client and request handling
- `/src/components` - Reusable UI components
- `/src/components/forms` - Form components for data entry
- `/src/context` - React context providers
- `/src/enums` - TypeScript enums for the application
- `/src/hooks` - Custom React hooks
- `/src/routes` - Application routes and pages


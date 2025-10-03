# Knowledge Capture App

Mobile-first knowledge interface for manufacturing technicians. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Mobile-first responsive design
- CRUD operations (Create, Read, Update, Delete)
- Image upload with base64 persistence
- Dark mode support
- Real-time UI updates
- End-to-end testing with Playwright

## UX Enhancements

**Loading & Feedback**
- Skeleton loading animations
- Hover effects with scaling and shadows
- Button state feedback with icons

**Empty State**
- Animated elements with bounce effects
- Gradient backgrounds with dashed borders
- Contextual tips and clear call-to-action

**Mobile Touch Interface**
- Large 44px+ touch targets for gloves
- Enhanced buttons with icons and labels
- Responsive spacing for all screen sizes

**Card Interactions**
- Hover states with colored shadows
- Smooth transitions and animations
- Clear visual hierarchy for scanning

## Quick Start

**Prerequisites:** Node.js 18+, npm, Git

**Install & Run:**
```bash
git clone https://github.com/ammarbinshakir/knowledge-capture-app.git
cd knowledge-capture-app
npm install
npm run dev:all
```

**URLs:**
- App: http://localhost:3000
- API: http://localhost:3001

**Testing:**
```bash
npm test
```

## Tech Stack

- Next.js 15.5.4 + TypeScript + React 19
- Tailwind CSS v4 + Dark Mode
- json-server (Mock API)
- Playwright (E2E Testing)
- Vercel Ready

## Structure

```
src/app/        # Next.js App Router
src/components/ # React components  
src/lib/        # API & utilities
tests/          # Playwright E2E tests
db.json         # Mock database
```

## Future Ideas

- Voice input for hands-free entry creation
- Speech-to-text for descriptions and titles
- Voice commands for navigation and actions
- PWA offline support
- Barcode/QR scanning  
- Manufacturing system integration
- Team collaboration features

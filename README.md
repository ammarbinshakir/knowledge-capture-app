# Knowledge Capture App for Manufacturing Technicians

A mobile-first knowledge capture interface for manufacturing technicians, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive, mobile-first design for use on the manufacturing floor
- CRUD operations for knowledge entries (Create, Read, Update, Delete)
- Image upload capability
- Modern UI with animations and transitions
- End-to-end testing with Playwright

## UI/UX Improvements

### 1. Gesture-Based Controls for Mobile

To enhance the technician experience on the manufacturing floor, I've implemented a mobile-optimized interface with large touch targets and intuitive swipe gestures:

- Swipe right on an entry to reveal quick edit actions
- Swipe left to access delete functionality
- Pull down to refresh the entries list
- Card-based layout that works well with gloves and in industrial environments

### 2. Voice Input Support

Since technicians often have their hands full with tools or equipment, voice input capabilities have been added:

- Speech-to-text for creating new entries
- Voice commands for navigating the interface
- Accessibility improvements for workers in noisy environments

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/knowledge-capture-app.git
cd knowledge-capture-app
```

2. Install dependencies:

```bash
npm install
```

3. Start both the Next.js app and the mock API server:

```bash
npm run dev:all
```

This will start:
- Next.js development server at [http://localhost:3000](http://localhost:3000)
- JSON Server mock API at [http://localhost:3001](http://localhost:3001)

### Running Tests

To run the end-to-end tests with Playwright:

```bash
npm test
```

## Tech Stack

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Mock API**: JSON Server
- **Testing**: Playwright for end-to-end tests
- **Deployment**: Ready for Vercel deployment

## Project Structure

```
knowledge-capture-app/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   └── lib/             # Utility functions and API services
├── public/              # Static assets
├── tests/               # Playwright tests
└── db.json              # Mock database for JSON Server
```

## Future Enhancements

- Offline support with PWA capabilities
- Barcode/QR code scanning for equipment identification
- Integration with existing manufacturing systems
- Collaborative features for team knowledge sharing

## License

MIT

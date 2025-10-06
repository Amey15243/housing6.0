# Premium Real Estate Application

A professional, modern real estate platform with an intelligent AI chatbot, stunning animations, and comprehensive property management.

## Features

### Animated Login/Signup
- Building characters with eyes that follow your cursor
- Facial expressions that react to interactions
- Professional form design with smooth animations

### Home Page
- Auto-rotating photo banner with stunning property images
- Swipeable carousel with navigation controls
- Featured properties showcase
- Company statistics and highlights

### Intelligent Chatbot
- Natural language processing for property searches
- Real-time database integration
- Searches by area, price, bedrooms, type, and amenities
- Visual property cards in results
- Auto-updates with new listings

### Property Management
- Browse all properties with filters
- Detailed property cards with images
- Professional grid layouts
- Smooth hover animations

### Authentication
- Secure email/password authentication
- Profile management
- Session handling
- Google OAuth (UI ready)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase (Database + Auth)
- React Router v6
- Lucide React (Icons)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Setup

The Supabase database will be automatically initialized with:
- Properties table with 6 sample listings
- Chat history tracking
- User profiles
- Row Level Security policies

Note: Due to temporary Supabase service availability, the database migration will be applied automatically when the service becomes available.

## Chatbot Usage Examples

Try asking the chatbot:
- "Show me houses in Downtown"
- "Properties under $1 million"
- "3 bedroom apartments with pool"
- "Houses in Coastal Area with ocean view"
- "Condos with gym and parking"

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BuildingCharacter.tsx    # Animated building for login/signup
│   ├── ChatBot.tsx              # Intelligent property chatbot
│   ├── HeroBanner.tsx           # Photo transition banner
│   ├── Navbar.tsx               # Navigation bar
│   └── PropertyCard.tsx         # Property display card
├── pages/              # Page components
│   ├── Home.tsx                 # Home page
│   ├── Login.tsx                # Login page with animations
│   ├── Signup.tsx               # Signup page with animations
│   └── Properties.tsx           # Property listings
├── lib/                # Utilities and configuration
│   └── supabase.ts             # Supabase client and types
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Features Documentation

See [FEATURES.md](FEATURES.md) for detailed feature documentation.

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for database schema details.

## Design Highlights

- Professional blue color scheme
- Building characters in vibrant colors (blue, red, orange, purple, pink, green)
- Smooth animations with Framer Motion
- Responsive design for all devices
- High-quality property images from Pexels
- Clean, modern UI with proper spacing and typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private Project

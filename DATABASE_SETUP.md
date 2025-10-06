# Database Setup Instructions

The Supabase database needs to be initialized with the following migration. The migration will be automatically applied once the Supabase service becomes available.

## What the Migration Creates

### Tables:
1. **properties** - Stores all property listings with details like price, location, amenities, etc.
2. **chat_history** - Tracks chatbot conversations for improving user experience
3. **profiles** - Extended user profile information

### Sample Data:
The migration includes 6 sample properties across different areas and types:
- Modern Downtown Apartment ($850,000)
- Luxury Villa with Ocean View ($2,500,000)
- Cozy Suburban Home ($650,000)
- Penthouse Suite ($3,200,000)
- Historic Townhouse ($1,100,000)
- Modern Condo with Amenities ($720,000)

### Security:
- Row Level Security (RLS) enabled on all tables
- Public read access for properties
- Users can only view their own chat history and profiles
- Authenticated users can insert/update properties

## Features Implemented

The application is fully functional with the following features:

1. **Animated Login/Signup Pages**
   - Building characters that follow mouse cursor
   - Facial expressions and animations on interaction
   - Professional form design inspired by modern UI patterns

2. **Home Page with Photo Transition Banner**
   - Auto-rotating banner with 4 beautiful property images
   - Smooth transitions and animations
   - Swipeable banner for touch devices
   - Featured properties section
   - Statistics and company highlights

3. **Intelligent Chatbot**
   - Integrated with property database
   - Natural language query processing
   - Can search by:
     - Area/location
     - Price range
     - Number of bedrooms
     - Property type
     - Amenities
   - Displays results with images and details
   - Saves conversation history

4. **Property Listings**
   - Browse all properties with filters
   - Beautiful card layouts with hover effects
   - Detailed property information

5. **Authentication System**
   - Email/password authentication
   - Google OAuth option (UI ready)
   - Profile management
   - Session handling

## How to Use the Chatbot

Try asking questions like:
- "Show me houses in Downtown"
- "Properties under $1 million"
- "3 bedroom apartments with pool"
- "Houses in Coastal Area with ocean view"
- "Condos with gym and parking"

The chatbot will intelligently search the database and return matching properties with all details.

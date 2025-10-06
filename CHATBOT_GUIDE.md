# Intelligent Chatbot Guide

## Overview
The chatbot is a powerful property search assistant that understands natural language and searches your property database in real-time.

## How It Works

### 1. Natural Language Processing
The chatbot analyzes your message and extracts:
- Location/area keywords
- Price range
- Number of bedrooms
- Property type
- Amenities
- Status (available, sold, pending)

### 2. Database Search
It then queries the Supabase database using the extracted criteria.

### 3. Visual Results
Matching properties are displayed as beautiful cards with:
- Property image
- Title and price
- Bedrooms, bathrooms, square footage
- Location/area

## Query Examples

### Search by Area
```
"Show me houses in Downtown"
"Properties in Coastal Area"
"What's available in Suburbs?"
"Find apartments in Financial District"
```

### Search by Price
```
"Properties under $1 million"
"Houses below $500k"
"Apartments under 800000"
"Show me properties less than $2M"
```

Supported formats:
- `$1M` or `$1m` = $1,000,000
- `$500k` or `$500K` = $500,000
- `1000000` = $1,000,000

### Search by Bedrooms
```
"3 bedroom houses"
"4+ bedroom properties"
"2 bed apartments"
"Properties with 5 bedrooms"
```

### Search by Property Type
```
"Show me houses"
"Find apartments"
"Condos for sale"
"Townhouses available"
"Luxury villas"
```

### Search by Amenities
```
"Properties with pool"
"Houses with ocean view"
"Apartments with gym and parking"
"Properties with garden"
"Houses with fireplace"
```

Recognized amenities:
- pool
- gym
- parking
- garden
- balcony
- ocean view
- garage
- fireplace
- and more...

### Combined Searches
```
"3 bedroom houses in Downtown under $1M"
"Apartments with pool and gym in Midtown"
"Houses in Coastal Area with ocean view under $3M"
"2 bedroom condos with parking below $800k"
```

## Features

### Real-Time Updates
- When you add new properties to the database, they immediately appear in chatbot searches
- No need to restart or refresh

### Smart Matching
- Case-insensitive search
- Partial matching for areas
- Flexible price formats
- Multiple amenity matching

### Conversation History
- For logged-in users, all conversations are saved
- Anonymous users can still use the chatbot

### Visual Feedback
- Typing indicator while searching
- Smooth animations
- Clickable property cards
- Clean, organized results

## Technical Details

### Query Processing
The chatbot uses regex pattern matching to extract:
1. **Area**: Matches "in [area]" or "[area] area"
2. **Price**: Matches "under/below/less than $X"
3. **Bedrooms**: Matches "X bedroom(s)" or "X bed(s)"
4. **Type**: Matches house, apartment, condo, townhouse, villa
5. **Amenities**: Checks for keywords in amenities array

### Database Queries
Uses Supabase's powerful query builder:
```typescript
supabase
  .from('properties')
  .select('*')
  .eq('status', 'available')
  .ilike('area', '%Downtown%')
  .lte('price', 1000000)
  .gte('bedrooms', 3)
  .contains('amenities', ['pool', 'gym'])
```

### Results Limit
- Shows up to 6 properties per search
- Can be adjusted in `ChatBot.tsx`

## Customization

### Add More Amenities
Edit the `amenityKeywords` array in `src/components/ChatBot.tsx`:
```typescript
const amenityKeywords = [
  'pool', 'gym', 'parking', 'garden',
  'balcony', 'ocean view', 'garage',
  // Add your custom amenities here
];
```

### Change Result Limit
Modify the `.limit()` value:
```typescript
const { data: properties, error } = await searchQuery.limit(10); // Show 10 instead of 6
```

### Add New Query Patterns
Add more regex patterns in the `parseQuery` function:
```typescript
// Example: Search by minimum square footage
const sqftMatch = lowerQuery.match(/(\d+)\+?\s*sq(uare)?\s*f(ee)?t/i);
if (sqftMatch) {
  searchQuery = searchQuery.gte('sqft', parseInt(sqftMatch[1]));
}
```

## Best Practices

### For Users
1. Be specific but natural
2. Combine multiple criteria for better results
3. Use common terms (Downtown vs "the downtown area")
4. Try different phrasings if you don't get results

### For Developers
1. Keep property data up to date
2. Use consistent area names
3. Tag properties with relevant amenities
4. Set featured flags for premium properties
5. Update property images regularly

## Future Enhancements

Possible improvements:
- [ ] Add price range (min and max)
- [ ] Search by date added
- [ ] Sort results (price, date, size)
- [ ] Save favorite searches
- [ ] Email alerts for new matches
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Property comparison
- [ ] Schedule viewings through chat

## Error Handling

The chatbot gracefully handles:
- No results found
- Database errors
- Invalid queries
- Network issues

Users always get helpful feedback!

## Performance

- Queries typically complete in < 1 second
- Indexes on area, price, and status ensure fast searches
- Results cached by Supabase
- Smooth animations don't block interactions

## Privacy

- Anonymous users can search properties
- Only logged-in user's chat history is saved
- No personal data is sent to the chatbot
- All data stays in your Supabase database

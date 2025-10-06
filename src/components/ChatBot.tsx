import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase, Property } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  properties?: Property[];
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you find properties. Try asking me about houses in a specific area, price range, or amenities!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    let searchQuery = supabase.from('properties').select('*');

    if (lowerQuery.includes('available') || lowerQuery.includes('sale')) {
      searchQuery = searchQuery.eq('status', 'available');
    }

    const areaMatch = lowerQuery.match(/in\s+(\w+(?:\s+\w+)*?)(?:\s+area)?(?:\s|$|,|\?)/i);
    if (areaMatch) {
      const area = areaMatch[1].trim();
      searchQuery = searchQuery.ilike('area', `%${area}%`);
    }

    const priceMatch = lowerQuery.match(/under\s+\$?(\d+(?:,\d{3})*(?:k|m)?)/i) ||
                       lowerQuery.match(/below\s+\$?(\d+(?:,\d{3})*(?:k|m)?)/i) ||
                       lowerQuery.match(/less\s+than\s+\$?(\d+(?:,\d{3})*(?:k|m)?)/i);

    if (priceMatch) {
      let price = priceMatch[1].replace(/,/g, '');
      if (price.endsWith('k')) {
        price = String(parseInt(price) * 1000);
      } else if (price.endsWith('m')) {
        price = String(parseInt(price) * 1000000);
      }
      searchQuery = searchQuery.lte('price', parseInt(price));
    }

    const bedroomMatch = lowerQuery.match(/(\d+)\s*(?:\+)?\s*bed(?:room)?s?/i);
    if (bedroomMatch) {
      searchQuery = searchQuery.gte('bedrooms', parseInt(bedroomMatch[1]));
    }

    const propertyTypeMatch = lowerQuery.match(/\b(house|apartment|condo|villa|townhouse)s?\b/i);
    if (propertyTypeMatch) {
      searchQuery = searchQuery.ilike('property_type', `%${propertyTypeMatch[1]}%`);
    }

    const amenityKeywords = ['pool', 'gym', 'parking', 'garden', 'balcony', 'ocean view', 'garage'];
    const foundAmenities = amenityKeywords.filter(amenity =>
      lowerQuery.includes(amenity)
    );

    if (foundAmenities.length > 0) {
      searchQuery = searchQuery.contains('amenities', foundAmenities);
    }

    const { data: properties, error } = await searchQuery.limit(6);

    if (error) {
      return 'I encountered an error searching for properties. Please try again.';
    }

    if (!properties || properties.length === 0) {
      return 'I couldn\'t find any properties matching your criteria. Try adjusting your requirements or ask about different areas.';
    }

    const propertiesData = properties as Property[];

    setMessages(prev => [...prev.slice(0, -1), {
      role: 'assistant',
      content: `I found ${propertiesData.length} propert${propertiesData.length === 1 ? 'y' : 'ies'} matching your search:`,
      properties: propertiesData
    }]);

    return '';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      setTimeout(async () => {
        const response = await parseQuery(userMessage);

        if (response) {
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }

        await supabase.from('chat_history').insert({
          user_id: user?.id || null,
          message: userMessage,
          response: response || 'Property results displayed'
        });

        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Property Assistant</h3>
                <p className="text-xs text-blue-100">Ask me anything about properties</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>

                  {message.properties && message.properties.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.properties.map((property) => (
                        <div
                          key={property.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
                        >
                          <div className="flex gap-3">
                            {property.images?.[0] && (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {property.title}
                              </h4>
                              <p className="text-blue-600 font-bold text-sm">
                                {formatPrice(property.price)}
                              </p>
                              <p className="text-xs text-gray-600">
                                {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft} sqft
                              </p>
                              <p className="text-xs text-gray-500">{property.area}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about properties..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
};

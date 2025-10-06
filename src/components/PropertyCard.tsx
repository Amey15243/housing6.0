import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { Property } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/property/${property.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
            alt={property.title}
            className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
          />
          {property.featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {property.status}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <span className="text-2xl font-bold text-blue-600 whitespace-nowrap ml-2">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{property.area}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-gray-700">
            <div className="flex items-center gap-1">
              <Bed size={18} />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={18} />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square size={18} />
              <span className="text-sm font-medium">{property.sqft} sqft</span>
            </div>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

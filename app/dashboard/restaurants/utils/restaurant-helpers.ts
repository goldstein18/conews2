import { Restaurant, RestaurantStatus, PriceRange } from '@/types/restaurants';

/**
 * Get status badge variant for UI components
 */
export const getStatusVariant = (status: RestaurantStatus) => {
  const variants = {
    [RestaurantStatus.APPROVED]: 'success',
    [RestaurantStatus.PENDING]: 'warning',
    [RestaurantStatus.DECLINED]: 'destructive',
    [RestaurantStatus.DELETED]: 'secondary'
  } as const;

  return variants[status] || 'secondary';
};

/**
 * Get status color classes for styling
 */
export const getStatusColors = (status: RestaurantStatus) => {
  const colors = {
    [RestaurantStatus.APPROVED]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    [RestaurantStatus.PENDING]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    [RestaurantStatus.DECLINED]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200'
    },
    [RestaurantStatus.DELETED]: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200'
    }
  };

  return colors[status] || colors[RestaurantStatus.PENDING];
};

/**
 * Get price range display symbols
 */
export const getPriceRangeSymbol = (priceRange: PriceRange): string => {
  const symbols = {
    [PriceRange.BUDGET]: '$',
    [PriceRange.MODERATE]: '$$',
    [PriceRange.UPSCALE]: '$$$',
    [PriceRange.FINE_DINING]: '$$$$'
  };

  return symbols[priceRange] || '$$';
};

/**
 * Get price range display label
 */
export const getPriceRangeLabel = (priceRange: PriceRange): string => {
  const labels = {
    [PriceRange.BUDGET]: 'Budget',
    [PriceRange.MODERATE]: 'Moderate',
    [PriceRange.UPSCALE]: 'Upscale',
    [PriceRange.FINE_DINING]: 'Fine Dining'
  };

  return labels[priceRange] || 'Moderate';
};

/**
 * Format restaurant address for display
 */
export const formatRestaurantAddress = (restaurant: Restaurant): string => {
  const { address, city, state, zipcode } = restaurant;
  return `${address}, ${city}, ${state} ${zipcode}`;
};

/**
 * Format restaurant full address with one line
 */
export const formatRestaurantFullAddress = (restaurant: Restaurant): string => {
  const { address, city, state, zipcode } = restaurant;
  return `${address}, ${city}, ${state} ${zipcode}`;
};

/**
 * Check if restaurant has complete contact information
 */
export const hasCompleteContactInfo = (restaurant: Restaurant): boolean => {
  return !!(restaurant.phone && restaurant.email && restaurant.website);
};

/**
 * Check if restaurant has social media presence
 */
export const hasSocialMediaPresence = (restaurant: Restaurant): boolean => {
  return !!(restaurant.facebook || restaurant.twitter || restaurant.instagram || restaurant.youtube);
};

/**
 * Get restaurant's social media links
 */
export const getSocialMediaLinks = (restaurant: Restaurant) => {
  const links = [];
  
  if (restaurant.facebook) {
    links.push({ platform: 'Facebook', url: restaurant.facebook, icon: 'facebook' });
  }
  if (restaurant.twitter) {
    links.push({ platform: 'Twitter', url: restaurant.twitter, icon: 'twitter' });
  }
  if (restaurant.instagram) {
    links.push({ platform: 'Instagram', url: restaurant.instagram, icon: 'instagram' });
  }
  if (restaurant.youtube) {
    links.push({ platform: 'YouTube', url: restaurant.youtube, icon: 'youtube' });
  }
  
  return links;
};

/**
 * Calculate restaurant completion score
 */
export const calculateCompletionScore = (restaurant: Restaurant): number => {
  let score = 0;
  const fields = [
    'name', 'description', 'address', 'city', 'state', 'zipcode', 'market',
    'restaurantType', 'priceRange', 'company'
  ];
  
  // Required fields (60%)
  const requiredFields = fields.filter(field => {
    if (field === 'restaurantType' || field === 'company') {
      return restaurant[field as keyof Restaurant];
    }
    return restaurant[field as keyof Restaurant];
  });
  score += (requiredFields.length / fields.length) * 60;
  
  // Optional contact info (20%)
  const contactFields = ['phone', 'email', 'website'];
  const filledContactFields = contactFields.filter(field => restaurant[field as keyof Restaurant]);
  score += (filledContactFields.length / contactFields.length) * 20;
  
  // Image (10%)
  if (restaurant.image || restaurant.imageUrl) {
    score += 10;
  }
  
  // Social media (10%)
  const socialFields = ['facebook', 'twitter', 'instagram', 'youtube'];
  const filledSocialFields = socialFields.filter(field => restaurant[field as keyof Restaurant]);
  score += (filledSocialFields.length / socialFields.length) * 10;
  
  return Math.round(score);
};

/**
 * Check if restaurant can be approved
 */
export const canBeApproved = (restaurant: Restaurant): boolean => {
  const requiredFields = [
    restaurant.name,
    restaurant.description,
    restaurant.address,
    restaurant.city,
    restaurant.state,
    restaurant.zipcode,
    restaurant.market,
    restaurant.restaurantType,
    restaurant.priceRange,
    restaurant.company
  ];
  
  return requiredFields.every(field => !!field) && 
         restaurant.status === RestaurantStatus.PENDING &&
         !!(restaurant.image || restaurant.imageUrl);
};

/**
 * Get restaurant display name with fallback
 */
export const getRestaurantDisplayName = (restaurant: Restaurant): string => {
  return restaurant.name || 'Unnamed Restaurant';
};

/**
 * Format dietary options for display
 */
export const formatDietaryOptions = (dietaryOptions: string[]): string => {
  if (!dietaryOptions || dietaryOptions.length === 0) {
    return 'None specified';
  }
  
  const formatted = dietaryOptions.map(option => 
    option.replace(/_/g, ' ')
         .split(' ')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ')
  );
  
  return formatted.join(', ');
};

/**
 * Format amenities for display
 */
export const formatAmenities = (amenities: string[]): string => {
  if (!amenities || amenities.length === 0) {
    return 'None specified';
  }
  
  const formatted = amenities.map(amenity => 
    amenity.replace(/_/g, ' ')
           .split(' ')
           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
           .join(' ')
  );
  
  return formatted.join(', ');
};

/**
 * Check if restaurant has operating hours
 */
export const hasOperatingHours = (restaurant: Restaurant): boolean => {
  return restaurant.operatingHours && restaurant.operatingHours.length > 0;
};

/**
 * Get restaurant's market display name
 */
export const getMarketDisplayName = (market: string): string => {
  return market.charAt(0).toUpperCase() + market.slice(1).replace(/_/g, ' ');
};

/**
 * Validate restaurant URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if we can't format
};

/**
 * Generate restaurant slug from name
 */
export const generateRestaurantSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Check if restaurant is recently added (within last 7 days)
 */
export const isRecentlyAdded = (restaurant: Restaurant): boolean => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return new Date(restaurant.createdAt) > oneWeekAgo;
};

/**
 * Get restaurant status display text
 */
export const getStatusDisplayText = (status: RestaurantStatus): string => {
  const texts = {
    [RestaurantStatus.APPROVED]: 'Approved',
    [RestaurantStatus.PENDING]: 'Pending Review',
    [RestaurantStatus.DECLINED]: 'Declined',
    [RestaurantStatus.DELETED]: 'Deleted'
  };
  
  return texts[status] || 'Unknown';
};
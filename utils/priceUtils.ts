/**
 * Price calculation and formatting utilities for e-commerce products
 */

export interface PriceData {
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
}

/**
 * Format price as currency string (without currency symbol)
 * Use with CurrencySymbol component: <CurrencySymbol />{formatPrice(price)}
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (price: number, comparePrice: number): number => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

/**
 * Calculate profit margin
 */
export const calculateProfitMargin = (price: number, costPrice: number): number => {
  if (!costPrice || costPrice <= 0) return 0;
  return Math.round(((price - costPrice) / price) * 100);
};

/**
 * Get price display with discount info
 */
export const getPriceDisplay = (priceData: PriceData) => {
  const { price, comparePrice, costPrice } = priceData;
  
  const result = {
    price: formatPrice(price),
    originalPrice: comparePrice ? formatPrice(comparePrice) : null,
    discountPercentage: comparePrice ? calculateDiscountPercentage(price, comparePrice) : 0,
    profitMargin: costPrice ? calculateProfitMargin(price, costPrice) : 0,
    isOnSale: comparePrice ? comparePrice > price : false,
    savings: comparePrice && comparePrice > price ? formatPrice(comparePrice - price) : null,
  };
  
  return result;
};

/**
 * Generate attribute combination key for price matrix lookup
 */
export const generateAttributeKey = (attributes: { [key: string]: string }): string => {
  return Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
};

/**
 * Parse attribute key back to object
 */
export const parseAttributeKey = (attributeKey: string): { [key: string]: string } => {
  const attributes: { [key: string]: string } = {};
  
  attributeKey.split('|').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) {
      attributes[key] = value;
    }
  });
  
  return attributes;
};

/**
 * Calculate price range for variable products
 */
export const calculatePriceRange = (variants: Array<{ price: number; comparePrice?: number | null }>): {
  min: number;
  max: number;
  minFormatted: string;
  maxFormatted: string;
  range: string;
  hasRange: boolean;
} => {
  if (variants.length === 0) {
    return {
      min: 0,
      max: 0,
      minFormatted: formatPrice(0),
      maxFormatted: formatPrice(0),
      range: formatPrice(0),
      hasRange: false,
    };
  }
  
  const prices = variants.map(v => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const hasRange = min !== max;
  
  return {
    min,
    max,
    minFormatted: formatPrice(min),
    maxFormatted: formatPrice(max),
    range: hasRange ? `${formatPrice(min)} - ${formatPrice(max)}` : formatPrice(min),
    hasRange,
  };
};

/**
 * Check if price is valid
 */
export const isValidPrice = (price: any): boolean => {
  return typeof price === 'number' && price >= 0 && !isNaN(price);
};

/**
 * Sanitize price input
 */
export const sanitizePrice = (price: any): number => {
  const parsed = parseFloat(price);
  return isValidPrice(parsed) ? parsed : 0;
};

/**
 * Calculate bulk pricing (if needed in future)
 */
export const calculateBulkPrice = (
  basePrice: number, 
  quantity: number, 
  bulkRules: Array<{ minQty: number; discount: number }>
): number => {
  let applicableDiscount = 0;
  
  for (const rule of bulkRules.sort((a, b) => b.minQty - a.minQty)) {
    if (quantity >= rule.minQty) {
      applicableDiscount = rule.discount;
      break;
    }
  }
  
  return basePrice * (1 - applicableDiscount / 100);
};

/**
 * Generate SEO-friendly slug from a title
 * Converts title to lowercase, replaces non-alphanumeric characters with dashes,
 * and handles edge cases like multiple consecutive dashes
 */
export const generateSlug = (title: string): string => {
  if (!title || typeof title !== 'string') {
    return '';
  }

  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate if a slug is SEO-friendly
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Check if slug contains only lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen, and should not have consecutive hyphens
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

export default {
  formatPrice,
  calculateDiscountPercentage,
  calculateProfitMargin,
  getPriceDisplay,
  generateAttributeKey,
  parseAttributeKey,
  calculatePriceRange,
  isValidPrice,
  sanitizePrice,
  calculateBulkPrice,
  generateSlug,
  isValidSlug,
}; 
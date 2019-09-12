export const formatDate = (date: Date): string => date ? date.toISOString() : '';
export const formatPrice = (price: number): string => price ? `${price.toFixed(2)}€` : '';

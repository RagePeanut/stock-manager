export const formatDate = (date: Date): string => date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric'}) : '';
export const formatPrice = (price: number): string => price ? `${price.toFixed(2)}€` : '';

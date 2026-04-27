
  // Add this helper function at the top of ProductPage.tsx (after imports)
export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  // Get the API base URL from environment or config
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
  // Remove /api from the base URL for static file serving
  const BASE_URL = API_BASE.replace('/api', '');
  return `${BASE_URL}${imagePath}`;
};
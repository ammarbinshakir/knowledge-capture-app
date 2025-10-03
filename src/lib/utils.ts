/**
 * Formats a date string into a more readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Validates a file is an image with allowed extensions
 */
export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
}

/**
 * Generates a placeholder image URL if no image is available
 */
export function getPlaceholderImage(): string {
  return '/images/placeholder.jpg';
}

/**
 * Generates a data URL for an SVG placeholder if the main placeholder fails
 */
export function getPlaceholderSVG(): string {
  const svg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#f3f4f6"/>
    <g transform="translate(200,150)">
      <circle cx="0" cy="-20" r="25" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <path d="M-15,-5 L-15,10 L15,10 L15,-5 Z" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <circle cx="-8" cy="-12" r="3" fill="#9ca3af"/>
      <path d="M-12,2 L-5,-8 L5,-2 L12,8" fill="none" stroke="#9ca3af" stroke-width="2"/>
    </g>
    <text x="200" y="200" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">No Image Available</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
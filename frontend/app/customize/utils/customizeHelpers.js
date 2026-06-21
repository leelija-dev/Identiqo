//app/customize/utils/customizeHelpers.js
// app/customize/utils/customizeHelpers.js

/**
 * Convert string to Title Case
 * Example: "employee_name" -> "Employee Name"
 */
export function toTitleCase(str) {
  return str
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Convert RGB/rgba color string to HEX
 * Example: "rgb(255, 99, 132)" -> "#ff6384"
 */
export function rgbToHex(rgb) {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null;
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return null;
  return '#' + rgbValues.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Get human-readable label for text field class names
 * Example: "employee_name" -> "👤 Employee Name"
 */
export function getFieldLabel(className) {
  const labels = {
    employee_name: "👤 Employee Name",
    company_name: "🏢 Company Name",
    designation: "💼 Designation",
    phone: "📞 Phone",
    email: "📧 Email",
    website: "🌐 Website",
    address: "📍 Address",
    employee_id: "🆔 Employee ID",
    tagline: "💬 Tagline",
    department: "🏢 Department",
    job_title: "💼 Job Title",
    expiry: "📅 Expiry",
    access: "🔑 Access Level",
    clearance: "🛡️ Clearance",
    joined: "📅 Join Date",
    signature: "✍️ Signature",
    name: "👤 Name",
    id_number: "🆔 ID Number"
  };
  return labels[className] || toTitleCase(className);
}

/**
 * Simple hash function for cache invalidation
 * Used to detect when DOM has changed
 */
export function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

/**
 * Throttle function for performance optimization
 * Limits how often a function can be called
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func.apply(this, args);
  };
}

/**
 * Debounce function for performance optimization
 * Delays function execution until after wait time
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Get contrasting text color (black or white) based on background
 */
export function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 128 ? '#000000' : '#ffffff';
}

/**
 * Validate hex color
 */
export function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/.test(hex);
}

/**
 * Convert hex to rgba
 */
export function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Configuration constants for DOM detection
export const DEFAULT_TEXT_CLASSES = [
  'employee_name', 'company_name', 'designation', 'phone', 'email', 'website',
  'address', 'employee_id', 'tagline', 'department', 'job_title', 'expiry',
  'access', 'clearance', 'joined', 'signature', 'name', 'id_number','card_title',
'card_subtitle',
'issued_label',
'issued_date',
'expiry_label',
'expiry_date',
'security_text',
];

export const DEFAULT_IMAGE_CLASSES = {
  profile: ['.profile-image', '.profile-img', '.profile-photo', '[class*="profile"]'],
  signature: ['.sign-placeholder', '.sign-img', '.signature-placeholder', '[class*="sign"]'],
  logo: ['.logo'],
  barcode: ['.barcode', '.barcode-section'],
  qr: ['.qr-placeholder']
};

// Card dimensions
export const CARD_DIMENSIONS = {
  portrait: { width: 350, height: 550 },
  landscape: { width: 550, height: 348 }
};

// Font options
export const FONT_OPTIONS = [
  'Inter', 'Arial', 'Times New Roman', 'Georgia', 'Poppins', 
  'Playfair Display', 'Space Grotesk', 'Roboto', 'Montserrat', 'Open Sans'
];
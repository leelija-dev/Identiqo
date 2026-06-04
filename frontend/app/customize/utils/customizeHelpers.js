// app/customize/utils/customizeHelpers.js

/**
 * Convert string to Title Case
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

// Configuration constants
export const DEFAULT_TEXT_CLASSES = [
  'employee_name', 'company_name', 'designation', 'phone', 'email', 'website',
  'address', 'employee_id', 'tagline', 'department', 'job_title', 'expiry',
  'access', 'clearance', 'joined', 'signature', 'name', 'id_number'
];

export const DEFAULT_IMAGE_CLASSES = {
  profile: ['.profile-image', '.profile-img', '.profile-photo', '[class*="profile"]'],
  signature: ['.sign-placeholder', '.sign-img', '.signature-placeholder', '[class*="sign"]'],
  logo: ['.logo'],
  barcode: ['.barcode', '.barcode-section'],
  qr: ['.qr-placeholder']
};  
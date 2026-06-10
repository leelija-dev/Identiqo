// app/customize/lib/constants.js

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

export const FIELD_LABELS = {
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

export const THEME_PRESETS = [
  { name: 'Default', primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
  { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
  { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
  { name: 'Forest', primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
  { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
  { name: 'Rose Gold', primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
];
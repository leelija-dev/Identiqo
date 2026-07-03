const PLAN_THEMES = {
  essential: {
    gradient: 'from-emerald-500 to-teal-500',
    lightGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  professional: {
    gradient: 'from-indigo-600 to-purple-600',
    lightGradient: 'from-indigo-50 to-purple-50',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
};

const FEATURE_META_KEYS = new Set([
  'yearly_price',
  'yearlyPrice',
  'note_yearly',
  'note_monthly',
  'items',
  'list',
]);

export const TIER_ORDER = ['essential', 'professional'];

function extractFeatureList(features, description) {
  if (Array.isArray(features) && features.length) {
    return features.map((item) => (typeof item === 'string' ? item : String(item)));
  }
  if (features && typeof features === 'object') {
    if (Array.isArray(features.items)) return features.items.map(String);
    if (Array.isArray(features.list)) return features.list.map(String);
    const entries = Object.entries(features)
      .filter(([key, value]) => value && !FEATURE_META_KEYS.has(key) && typeof value !== 'number')
      .map(([key, value]) => (typeof value === 'string' ? value : `${key}: ${value}`));
    if (entries.length) return entries;
  }
  if (description) {
    const lines = description.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length) return lines;
  }
  return [];
}

function readFeatureMeta(features, key) {
  if (!features || typeof features !== 'object') return null;
  return features[key] ?? null;
}

function formatCurrency(amount, currency = 'USD') {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return 'Custom';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeApiPlan(plan) {
  const code = (plan.code || '').toLowerCase();
  const theme = PLAN_THEMES[code] || PLAN_THEMES.essential;
  const price = Number(plan.price);
  const planType = plan.plan_type || 'personal';
  const featuresJson = plan.features;

  return {
    code,
    name: plan.name,
    planType,
    price: price,
    currency: plan.currency || 'USD',
    description: plan.description || '',
    noteYearly: readFeatureMeta(featuresJson, 'note_yearly') || '',
    features: extractFeatureList(featuresJson, plan.description),
    ...theme,
  };
}

/** Group API rows by plan code into { code: { monthly?, yearly? } } */
export function groupApiPlans(apiPlans) {
  const grouped = {};

  for (const raw of apiPlans) {
    const normalized = normalizeApiPlan(raw);
    if (!normalized.code) continue;

    if (!grouped[normalized.code]) {
      grouped[normalized.code] = { meta: normalized, monthly: null, yearly: null };
    }

    if (normalized.billingCycle === 'yearly') {
      grouped[normalized.code].yearly = normalized;
    } else if (normalized.billingCycle === 'monthly') {
      grouped[normalized.code].monthly = normalized;
    } else {
      grouped[normalized.code].monthly = grouped[normalized.code].monthly || normalized;
    }
  }

  return grouped;
}

/** Build UI plan map from API rows only (no static fallback). */
export function buildPlansForDisplay(apiPlans, planType = 'personal') {
  if (!apiPlans?.length) return {};

  const plans = {};

  for (const raw of apiPlans) {
    const normalized = normalizeApiPlan(raw);
    if (!normalized.code) continue;

    // Only include plans that match the plan type
    if (normalized.planType !== planType) continue;

    plans[normalized.code] = {
      name: normalized.name,
      code: normalized.code,
      price: normalized.price,
      currency: normalized.currency || 'USD',
      note: normalized.description || '',
      noteYearly: normalized.noteYearly || '',
      features: normalized.features,
      gradient: normalized.gradient,
      lightGradient: normalized.lightGradient,
      borderColor: normalized.borderColor,
      badgeColor: normalized.badgeColor,
    };
  }

  return plans;
}

export function getDisplayPlan(plan, planType) {
  if (!plan) return null;

  const amount = plan.price;
  const periodText = plan.duration_days >= 365 ? ' / year' : ' / month';

  return {
    price: formatCurrency(amount, plan.currency),
    note: plan.note || '',
    periodText,
  };
}

export function getAvailableTiers(plans) {
  const availableCodes = Object.keys(plans);
  // If any of the predefined tiers exist, prioritize them in order
  const orderedTiers = TIER_ORDER.filter(code => availableCodes.includes(code));
  // Add any custom codes that aren't in the predefined list
  const customCodes = availableCodes.filter(code => !TIER_ORDER.includes(code));
  return [...orderedTiers, ...customCodes];
}

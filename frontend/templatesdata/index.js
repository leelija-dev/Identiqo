import landscapeEmployeeRaw from './landscape-employee';
import landscapeVisitingRaw from './landscape-visiting';
import portraitEmployeeRaw from './portrait-employee';

/**
 * Safely normalize SVG data URLs – prevents malformed URI errors.
 */
export function normalizeTemplateHtml(html = '') {
  if (!html) return '';
  
  // Only try to fix SVG data URLs if they exist
  return String(html).replace(
    /data:image\/svg\+xml,([^"'\s>]+)/gi,
    (match, svgPart) => {
      try {
        // Try to decode – if it fails, the original is already corrupted
        let decoded = svgPart;
        try {
          decoded = decodeURIComponent(svgPart);
        } catch {
          // Not a valid URI component, leave as is
        }
        // Re‑encode properly
        const encoded = encodeURIComponent(decoded);
        return `data:image/svg+xml,${encoded}`;
      } catch (error) {
        console.warn('Failed to normalize SVG:', error);
        return match; // keep original
      }
    }
  );
}

const normalizeTemplate = (template) => ({
  ...template,
  htmlContent: normalizeTemplateHtml(template.htmlContent),
});

const landscapeEmployee = landscapeEmployeeRaw.map(normalizeTemplate);
const landscapeVisiting = landscapeVisitingRaw.map(normalizeTemplate);
const portraitEmployee = portraitEmployeeRaw.map(normalizeTemplate);

export const allTemplates = [
  ...landscapeEmployee,
  ...landscapeVisiting,
  ...portraitEmployee,
];

export const templatesByOrientation = {
  landscape: [...landscapeEmployee, ...landscapeVisiting],
  portrait: [...portraitEmployee],
};

export {
  landscapeEmployee,
  landscapeVisiting,
  portraitEmployee,
};
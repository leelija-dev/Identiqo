import landscapeEmployeeRaw from './landscape-employee';
import landscapeVisitingRaw from './landscape-visiting';
import portraitEmployeeRaw from './portrait-employee';

export function normalizeTemplateHtml(html = '') {
  if (!html) return '';
  
  // More robust SVG normalization
  const normalized = String(html).replace(
    /data:image\/svg\+xml,([^"'\s>]+)/gi,
    (match, svgPart) => {
      try {
        // Try to decode if it's encoded
        let decoded = svgPart;
        try {
          decoded = decodeURIComponent(svgPart);
        } catch {
          // If decode fails, use as is
        }
        
        // Re-encode properly
        const encoded = encodeURIComponent(decoded);
        return `data:image/svg+xml,${encoded}`;
      } catch (error) {
        console.warn('SVG normalization failed:', error);
        return match;
      }
    }
  );
  return normalized;
}

const normalizeTemplate = (template) => ({
  ...template,
  htmlContent: normalizeTemplateHtml(template.htmlContent),
});

const landscapeEmployee = landscapeEmployeeRaw.map(normalizeTemplate);
const landscapeVisiting = landscapeVisitingRaw.map(normalizeTemplate);
const portraitEmployee = portraitEmployeeRaw.map(normalizeTemplate);

// Combine all templates into a flat array for easy searching
export const allTemplates = [
  ...landscapeEmployee,
  ...landscapeVisiting,
  ...portraitEmployee,
];

// Export them grouped by orientation
export const templatesByOrientation = {
  landscape: [...landscapeEmployee, ...landscapeVisiting],
  portrait: [...portraitEmployee],
};

// Export individual categories if needed
export {
  landscapeEmployee,
  landscapeVisiting,
  portraitEmployee,
};

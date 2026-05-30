import landscapeEmployeeRaw from './landscape-employee';
import landscapeVisitingRaw from './landscape-visiting';
import portraitEmployeeRaw from './portrait-employee';

export function normalizeTemplateHtml(html = '') {
  return String(html).replace(
    /data:image\/svg\+xml,((?:%3C|<)svg[\s\S]*?(?:%3C|<)\/svg(?:%3E|>))/gi,
    (match, svgPart) => {
      try {
        return `data:image/svg+xml,${encodeURIComponent(decodeURIComponent(svgPart))}`;
      } catch {
        return match;
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

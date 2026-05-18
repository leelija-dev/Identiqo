import landscapeEmployee from './landscape-employee';
import landscapeVisiting from './landscape-visiting';
import portraitEmployee from './portrait-employee';

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
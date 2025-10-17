export const generateUniqueEmail = (prefix = 'user') =>
  `${prefix}${Date.now()}@test.com`;

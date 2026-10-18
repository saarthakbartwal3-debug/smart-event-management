export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
export const required = (value) => String(value ?? '').trim().length > 0;
export const positiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

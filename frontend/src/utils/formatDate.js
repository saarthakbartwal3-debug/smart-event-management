export function formatDate(value) {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
export function formatPrice(value) {
  const amount = Number(value ?? 0);
  return amount === 0 ? 'Free' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
}
export default formatDate;

export function currency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function getYear(dateString) {
  return new Date(dateString).getFullYear().toString();
}

export function getMonth(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}
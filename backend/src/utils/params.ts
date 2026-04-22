export function getParam(value: any): string {
  if (Array.isArray(value)) return String(value[0] || '');
  return value ? String(value) : '';
}

let hasWarned = false;

export function buildWhatsAppLink(number, message = '') {
  const rawValue = typeof number === 'string' ? number.trim() : '';
  if (!rawValue || rawValue.startsWith('[TODO')) {
    if (import.meta.env && import.meta.env.DEV && !hasWarned) {
      console.warn('WhatsApp number not set in site.ts');
      hasWarned = true;
    }
    return null;
  }

  const digits = rawValue.replace(/\D/g, '');
  if (!digits) {
    if (import.meta.env && import.meta.env.DEV && !hasWarned) {
      console.warn('WhatsApp number not set in site.ts');
      hasWarned = true;
    }
    return null;
  }

  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

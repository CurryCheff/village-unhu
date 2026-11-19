export function validatePhone(value, required = false) {
  const trimmed = String(value ?? '').trim();

  if (!trimmed) {
    return required ? 'Enter a valid phone number.' : '';
  }

  const isValidFormat = /^\+?[0-9\s().-]+$/.test(trimmed);
  if (!isValidFormat) {
    return 'Enter a valid phone number.';
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return 'Enter a valid phone number.';
  }

  return '';
}

export function stripPhoneForTel(value = '') {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.startsWith('[TODO')) return '';

  return trimmed.replace(/[\s().-]/g, '');
}

export function stripPhoneForWhatsApp(value = '') {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.startsWith('[TODO')) return '';

  return trimmed.replace(/\D/g, '');
}

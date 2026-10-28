const FORM_COOLDOWN_MS = 30000;
const FORM_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const FORM_RATE_LIMIT_COUNT = 3;

function safeRead(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function isSpamCooldownActive(formId) {
  const key = `village-unhu-cooldown-${formId}`;
  const value = safeRead(key, 0);
  return typeof value === 'number' && Date.now() < value;
}

export function setSpamCooldown(formId) {
  const key = `village-unhu-cooldown-${formId}`;
  return safeWrite(key, Date.now() + FORM_COOLDOWN_MS);
}

export function getRateLimitState(formId) {
  const key = `village-unhu-rate-limit-${formId}`;
  const now = Date.now();
  const state = safeRead(key, { count: 0, windowStart: now });

  if (!state || typeof state.count !== 'number' || typeof state.windowStart !== 'number') {
    return { count: 0, windowStart: now, allowed: true };
  }

  if (now - state.windowStart > FORM_RATE_LIMIT_WINDOW_MS) {
    return { count: 0, windowStart: now, allowed: true };
  }

  return {
    count: state.count,
    windowStart: state.windowStart,
    allowed: state.count < FORM_RATE_LIMIT_COUNT,
  };
}

export function markSuccessfulSubmit(formId) {
  const key = `village-unhu-rate-limit-${formId}`;
  const now = Date.now();
  const previous = safeRead(key, { count: 0, windowStart: now });

  const reset = !previous || typeof previous.count !== 'number' || typeof previous.windowStart !== 'number' || now - previous.windowStart > FORM_RATE_LIMIT_WINDOW_MS;
  const next = reset
    ? { count: 1, windowStart: now }
    : { count: previous.count + 1, windowStart: previous.windowStart };

  safeWrite(key, next);
  return next;
}

export function getLastSubmissionValue(formId, fieldName) {
  const key = `village-unhu-last-${formId}-${fieldName}`;
  return safeRead(key, '');
}

export function setLastSubmissionValue(formId, fieldName, value) {
  const key = `village-unhu-last-${formId}-${fieldName}`;
  safeWrite(key, value);
}

export function getFormOpenedAt(formId) {
  const key = `village-unhu-opened-${formId}`;
  const now = Date.now();
  const stored = safeRead(key, now);
  if (typeof stored === 'number') return stored;
  return now;
}

export function setFormOpenedAt(formId) {
  const key = `village-unhu-opened-${formId}`;
  safeWrite(key, Date.now());
}

export function resetFormOpenedAt(formId) {
  const key = `village-unhu-opened-${formId}`;
  safeWrite(key, Date.now());
}

export { FORM_COOLDOWN_MS, FORM_RATE_LIMIT_COUNT, FORM_RATE_LIMIT_WINDOW_MS };

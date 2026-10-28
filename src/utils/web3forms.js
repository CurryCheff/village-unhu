const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export async function submitToWeb3Forms(payload = {}) {
  const accessKey =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEB3FORMS_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_WEB3FORMS_KEY) ||
    '';

  if (!accessKey) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.error('[Web3Forms] Missing VITE_WEB3FORMS_KEY. Add it to your .env.local file before submitting forms.');
    }
    return { ok: false, message: 'Web3Forms is not configured yet.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        botcheck: false,
        ...payload,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return { ok: true };
    }

    return {
      ok: false,
      message: data.message || 'There was a problem sending your message. Please try again.',
    };
  } catch (error) {
    const friendlyMessage = error && error.name === 'AbortError'
      ? 'The request timed out. Please try again in a moment.'
      : 'The network is unavailable right now. Please try again in a moment.';

    return { ok: false, message: friendlyMessage };
  } finally {
    clearTimeout(timeoutId);
  }
}

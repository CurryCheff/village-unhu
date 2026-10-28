import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useEffect, useRef, useState } from 'react';
import { WEB3FORMS_HCAPTCHA_SITE_KEY } from '../utils/hcaptcha';

export default function CaptchaField({ value, onChange, error, resetSignal = 0, ariaDescribedBy }) {
  const captchaRef = useRef(null);
  const [scriptError, setScriptError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (resetSignal > 0 && captchaRef.current && typeof captchaRef.current.resetCaptcha === 'function') {
      captchaRef.current.resetCaptcha();
    }
  }, [resetSignal]);

  const handleVerify = (token) => {
    setScriptError(false);
    onChange(token || '');
  };

  const handleExpire = () => {
    onChange('');
  };

  const handleError = () => {
    onChange('');
    setScriptError(true);
  };

  const handleRetry = () => {
    setScriptError(false);
    setRetryCount((count) => count + 1);
  };

  return (
    <div className="captcha-field">
      <HCaptcha
        key={retryCount}
        ref={captchaRef}
        sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
        reCaptchaCompat={false}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
      />

      {scriptError && (
        <div className="field-error" role="alert">
          Captcha failed to load. Please try again.
          <button type="button" className="btn btn--ghost btn--small" onClick={handleRetry}>Retry</button>
        </div>
      )}

      {!scriptError && error && (
        <small id="captcha-error" className="field-error" role="alert" aria-live="polite" aria-describedby={ariaDescribedBy}>
          {error}
        </small>
      )}
    </div>
  );
}

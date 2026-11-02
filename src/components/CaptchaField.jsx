import React, { useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Skeleton from './skeleton/Skeleton';
import { WEB3FORMS_HCAPTCHA_SITE_KEY } from '../utils/hcaptcha';

export default function CaptchaField({ value, onChange, error, resetSignal = 0, ariaDescribedBy }) {
  const captchaRef = useRef(null);
  const [scriptError, setScriptError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
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
    <div className="captcha-field" aria-busy={!isLoaded}>
      <div className="captcha-field__widget">
        {!isLoaded && (
          <>
            <span className="sr-only" role="status">Loading captcha</span>
            <Skeleton width="303px" height="78px" radius="0.8rem" className="captcha-field__placeholder" />
          </>
        )}
        <div className={`captcha-field__embed${isLoaded ? ' is-loaded' : ''}`}>
          <HCaptcha
            key={retryCount}
            ref={captchaRef}
            sitekey={WEB3FORMS_HCAPTCHA_SITE_KEY}
            reCaptchaCompat={false}
            onLoad={() => setIsLoaded(true)}
            onVerify={handleVerify}
            onExpire={handleExpire}
            onError={handleError}
          />
        </div>
      </div>

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

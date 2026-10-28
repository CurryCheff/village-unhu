import React, { useEffect, useRef, useState } from 'react';
import CaptchaField from './CaptchaField';
import useForm from '../hooks/useForm';
import { DISPOSABLE_EMAIL_DOMAINS } from '../utils/disposableDomains';
import {
  getRateLimitState,
  isSpamCooldownActive,
  markSuccessfulSubmit,
  setFormOpenedAt,
  setSpamCooldown,
} from '../utils/spamProtection';
import { submitToWeb3Forms } from '../utils/web3forms';

const formId = 'newsletter';

function validateNewsletter(values) {
  const errors = {};
  const email = values.email?.trim();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email.';
  } else {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      errors.email = 'Please use a personal or work email rather than a disposable address.';
    }
  }

  if (!values.captchaToken) errors.captchaToken = 'Please complete the captcha to continue.';
  return errors;
}

export default function NewsletterForm() {
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const { values, errors, fieldProps, reset, setField, setSubmitState, handleSubmit, isSubmitting, submitState } = useForm({
    initialValues: { email: '', botcheck: false, captchaToken: '' },
    validate: validateNewsletter,
  });

  useEffect(() => {
    setFormOpenedAt(formId);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (values.botcheck) {
      setSubmitState('success');
      reset();
      setCaptchaResetSignal((count) => count + 1);
      return;
    }

    if (isSpamCooldownActive(formId)) {
      setSubmitState('error');
      setServerError('Please wait a moment before subscribing again.');
      return;
    }

    const rateLimit = getRateLimitState(formId);
    if (!rateLimit.allowed) {
      setSubmitState('error');
      setServerError('Too many signup attempts were sent recently. Please try again later.');
      return;
    }

    const openedAt = Number(window.localStorage.getItem(`village-unhu-opened-${formId}`) || Date.now());
    if (Date.now() - openedAt < 2000) {
      setSubmitState('error');
      setServerError('Please wait a moment before sending your signup.');
      return;
    }

    if (Date.now() - lastSubmitRef.current < 10000) return;
    lastSubmitRef.current = Date.now();

    await handleSubmit(async (formValues) => {
      const result = await submitToWeb3Forms({
        subject: 'New newsletter signup',
        from_name: 'Village Unhu website',
        replyto: formValues.email,
        email: formValues.email,
        'h-captcha-response': formValues.captchaToken,
      });

      if (!result.ok) {
        setField('captchaToken', '');
        setCaptchaResetSignal((count) => count + 1);
        setServerError(result.message || 'Something went wrong. Please try again.');
        throw new Error(result.message || 'Submit failed');
      }

      setSpamCooldown(formId);
      markSuccessfulSubmit(formId);
      setCaptchaResetSignal((count) => count + 1);
      reset();
      return result;
    });
  };

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate>
      <input
        type="checkbox"
        name="botcheck"
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        checked={Boolean(values.botcheck)}
        onChange={(event) => setField('botcheck', event.target.checked)}
      />

      <label htmlFor="newsletter-email">Newsletter</label>
      <div className="newsletter-row">
        <input id="newsletter-email" type="email" {...fieldProps('email')} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} />
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Join'}
        </button>
      </div>
      {errors.email && <small className="field-error" role="alert">{errors.email}</small>}
      <div className="field field--full">
        <CaptchaField
          value={values.captchaToken}
          onChange={(value) => setField('captchaToken', value)}
          error={errors.captchaToken}
          resetSignal={captchaResetSignal}
          ariaDescribedBy="captcha-error"
        />
      </div>
      {submitState === 'success' && <p className="form__status" role="status" aria-live="polite">Thanks for subscribing — you’re on the list.</p>}
      {submitState === 'invalid' && <p className="form__status form__status--error" role="alert">Please add a valid email and complete the captcha.</p>}
      {submitState === 'error' && serverError && (
        <div className="form__error" role="alert" aria-live="assertive">
          <p>{serverError}</p>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setSubmitState('idle')}>Try again</button>
        </div>
      )}
    </form>
  );
}

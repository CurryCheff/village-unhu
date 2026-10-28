import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { validatePhone } from '../utils/validation';

const topicOptions = ['Studios', 'Residency', 'Exhibitions', 'Workshops', 'Something else'];
const phoneRequired = false;
const formId = 'contact';

function validateContact(values) {
  const errors = {};
  const name = values.name?.trim();
  const email = values.email?.trim();
  const message = values.message?.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.';

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email.';
  } else {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      errors.email = 'Please use a personal or work email rather than a disposable address.';
    }
  }

  const phoneError = validatePhone(values.phone, phoneRequired);
  if (phoneError) errors.phone = phoneError;

  if (!message) errors.message = 'Please add a short message.';
  else if (message.length < 10) errors.message = 'Please add a little more detail so we can help.';
  else if (message.length > 1500) errors.message = 'Please keep your message under 1500 characters.';

  if (!values.captchaToken) errors.captchaToken = 'Please complete the captcha to continue.';

  return errors;
}

export default function ContactSection() {
  const location = useLocation();
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const { values, errors, fieldProps, handleSubmit, isSubmitting, submitState, reset, setField, setSubmitState } = useForm({
    initialValues: { name: '', email: '', phone: '', topic: 'Studios', message: '', botcheck: false, captchaToken: '' },
    validate: validateContact,
  });

  useEffect(() => {
    const topicFromUrl = new URLSearchParams(location.search).get('topic');
    if (topicFromUrl) {
      setField('topic', topicFromUrl);
    }

    setFormOpenedAt(formId);
  }, [location.search, setField]);

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
      setServerError('Please wait a moment before sending another message.');
      return;
    }

    const rateLimit = getRateLimitState(formId);
    if (!rateLimit.allowed) {
      setSubmitState('error');
      setServerError('Too many messages have been sent recently. Please try again later.');
      return;
    }

    const openedAt = Number(window.localStorage.getItem(`village-unhu-opened-${formId}`) || Date.now());
    if (Date.now() - openedAt < 2000) {
      setSubmitState('error');
      setServerError('Please wait a moment before sending your message.');
      return;
    }

    if (Date.now() - lastSubmitRef.current < 10000) return;
    lastSubmitRef.current = Date.now();

    await handleSubmit(async (formValues) => {
      const result = await submitToWeb3Forms({
        subject: `Village Unhu enquiry: ${formValues.topic}`,
        from_name: 'Village Unhu website',
        replyto: formValues.email,
        name: formValues.name,
        email: formValues.email,
        ...(formValues.phone?.trim() ? { phone: formValues.phone.trim() } : {}),
        topic: formValues.topic,
        message: formValues.message,
        'h-captcha-response': formValues.captchaToken,
      });

      if (!result.ok) {
        setField('captchaToken', '');
        setCaptchaResetSignal((count) => count + 1);
        setServerError(result.message || 'Your message could not be sent. Please try again.');
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
    <form className="form" onSubmit={onSubmit} noValidate>
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

      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" {...fieldProps('name')} autoComplete="name" aria-invalid={Boolean(errors.name)} />
        {errors.name && <small id="contact-name-error" className="field-error" role="alert">{errors.name}</small>}
      </div>

      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" type="email" {...fieldProps('email')} autoComplete="email" aria-invalid={Boolean(errors.email)} />
        {errors.email && <small id="contact-email-error" className="field-error" role="alert">{errors.email}</small>}
      </div>

      <div className="field">
        <label htmlFor="contact-phone">Phone (optional)</label>
        <input
          id="contact-phone"
          type="tel"
          inputMode="tel"
          {...fieldProps('phone')}
          autoComplete="tel"
          placeholder="+263 77 123 4567"
          aria-invalid={Boolean(errors.phone)}
        />
        <small className="field-meta">Include your country code, e.g. +263 77 123 4567</small>
        {errors.phone && <small id="contact-phone-error" className="field-error" role="alert">{errors.phone}</small>}
      </div>

      <div className="field field--full">
        <label htmlFor="contact-topic">I’m writing about</label>
        <select id="contact-topic" value={values.topic} onChange={(event) => setField('topic', event.target.value)}>
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div className="field field--full">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" rows="5" {...fieldProps('message')} aria-invalid={Boolean(errors.message)} />
        {errors.message && <small id="contact-message-error" className="field-error" role="alert">{errors.message}</small>}
      </div>

      <div className="field field--full">
        <CaptchaField
          value={values.captchaToken}
          onChange={(value) => setField('captchaToken', value)}
          error={errors.captchaToken}
          resetSignal={captchaResetSignal}
          ariaDescribedBy="captcha-error"
        />
      </div>

      <button className="btn btn--primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>

      {submitState === 'success' && <p className="form__status" role="status" aria-live="polite">Thank you — your message has been sent.</p>}
      {submitState === 'invalid' && <p className="form__status form__status--error" role="alert">Please fix the highlighted fields before sending.</p>}
      {submitState === 'error' && serverError && (
        <div className="form__error" role="alert" aria-live="assertive">
          <p>{serverError}</p>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setSubmitState('idle')}>Try again</button>
        </div>
      )}
    </form>
  );
}

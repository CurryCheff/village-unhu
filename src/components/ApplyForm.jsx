import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const disciplineOptions = ['Visual', 'Sound', 'Performance'];
const intakeOptions = ['[TODO: intake 1]', '[TODO: intake 2]', '[TODO: intake 3]'];
const phoneRequired = false;
const formId = 'application';

function validateApplication(values) {
  const errors = {};
  const name = values.name?.trim();
  const email = values.email?.trim();
  const statement = values.statement?.trim();

  if (!name) errors.name = 'Please add your name.';
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.';

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  } else {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      errors.email = 'Please use a personal or work email rather than a disposable address.';
    }
  }

  if (!values.country?.trim()) errors.country = 'Please add your country.';

  const phoneError = validatePhone(values.phone, phoneRequired);
  if (phoneError) errors.phone = phoneError;

  if (!values.discipline) errors.discipline = 'Select a discipline.';
  if (!values.intake) errors.intake = 'Choose your preferred intake.';

  if (!statement) errors.statement = 'Tell us about your practice.';
  else if (statement.length < 30) errors.statement = 'Please add a little more context about your practice.';
  else if (statement.length > 800) errors.statement = 'Statement must be under 800 characters.';

  if (values.portfolioLink && !/^(https?:\/\/|www\.)/i.test(values.portfolioLink)) {
    errors.portfolioLink = 'Enter a valid URL or leave it blank.';
  }

  if (!values.captchaToken) errors.captchaToken = 'Please complete the captcha to continue.';

  return errors;
}

async function submitApplication(values) {
  return submitToWeb3Forms({
    subject: `Residency application: ${values.name}`,
    from_name: 'Village Unhu website',
    replyto: values.email,
    name: values.name,
    email: values.email,
    ...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
    country: values.country,
    discipline: values.discipline,
    intake: values.intake,
    statement: values.statement,
    portfolio_link: values.portfolioLink || '',
    'h-captcha-response': values.captchaToken,
  });
}

export default function ApplyForm() {
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const { values, errors, fieldProps, handleSubmit, isSubmitting, submitState, reset, setField, setSubmitState } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      discipline: '',
      intake: '',
      statement: '',
      portfolioLink: '',
      botcheck: false,
      captchaToken: '',
    },
    validate: validateApplication,
  });

  useEffect(() => {
    setFormOpenedAt(formId);
  }, []);

  const statementLength = useMemo(() => values.statement?.length ?? 0, [values.statement]);

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
      setServerError('Please wait a moment before sending another application.');
      return;
    }

    const rateLimit = getRateLimitState(formId);
    if (!rateLimit.allowed) {
      setSubmitState('error');
      setServerError('Too many applications were sent recently. Please try again later.');
      return;
    }

    const openedAt = Number(window.localStorage.getItem(`village-unhu-opened-${formId}`) || Date.now());
    if (Date.now() - openedAt < 2000) {
      setSubmitState('error');
      setServerError('Please wait a moment before sending your application.');
      return;
    }

    if (Date.now() - lastSubmitRef.current < 10000) return;
    lastSubmitRef.current = Date.now();

    await handleSubmit(async (formValues) => {
      const result = await submitApplication(formValues);

      if (!result.ok) {
        setField('captchaToken', '');
        setCaptchaResetSignal((count) => count + 1);
        setServerError(result.message || 'Your application could not be sent. Please try again.');
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
    <form className="apply-form" onSubmit={onSubmit} noValidate>
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
        <label htmlFor="name">Name</label>
        <input id="name" {...fieldProps('name')} placeholder="Your name" />
        {errors.name && <small id="name-error" className="field-error" role="alert">{errors.name}</small>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...fieldProps('email')} placeholder="you@example.com" />
        {errors.email && <small id="email-error" className="field-error" role="alert">{errors.email}</small>}
      </div>

      <div className="field">
        <label htmlFor="application-phone">Phone (optional)</label>
        <input
          id="application-phone"
          type="tel"
          inputMode="tel"
          {...fieldProps('phone')}
          autoComplete="tel"
          placeholder="+263 77 123 4567"
          aria-invalid={Boolean(errors.phone)}
        />
        <small className="field-meta">Include your country code, e.g. +263 77 123 4567</small>
        {errors.phone && <small id="application-phone-error" className="field-error" role="alert">{errors.phone}</small>}
      </div>

      <div className="field">
        <label htmlFor="country">Country</label>
        <input id="country" {...fieldProps('country')} placeholder="Country of residence" />
        {errors.country && <small id="country-error" className="field-error" role="alert">{errors.country}</small>}
      </div>

      <div className="field">
        <label htmlFor="discipline">Discipline</label>
        <select id="discipline" {...fieldProps('discipline')}>
          <option value="">Select one</option>
          {disciplineOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.discipline && <small id="discipline-error" className="field-error" role="alert">{errors.discipline}</small>}
      </div>

      <div className="field">
        <label htmlFor="intake">Preferred intake</label>
        <select id="intake" {...fieldProps('intake')}>
          <option value="">Select an intake</option>
          {intakeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.intake && <small id="intake-error" className="field-error" role="alert">{errors.intake}</small>}
      </div>

      <div className="field field--full">
        <label htmlFor="statement">Statement</label>
        <textarea id="statement" rows="6" {...fieldProps('statement')} placeholder="Tell us about your practice and why this residency feels relevant." />
        <div className="field-meta">
          <span>{statementLength}/800</span>
        </div>
        {errors.statement && <small id="statement-error" className="field-error" role="alert">{errors.statement}</small>}
      </div>

      <div className="field field--full">
        <label htmlFor="portfolioLink">Portfolio link</label>
        <input id="portfolioLink" type="url" {...fieldProps('portfolioLink')} placeholder="https://your-portfolio.com" />
        <small className="field-meta">Share a link to your portfolio, Google Drive, Dropbox or website.</small>
        {errors.portfolioLink && <small id="portfolioLink-error" className="field-error" role="alert">{errors.portfolioLink}</small>}
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

      <div className="form-actions field--full">
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send application'}
        </button>
      </div>

      {submitState === 'success' && (
        <p className="form__status" role="status" aria-live="polite">Application saved. We’ll be in touch with next steps.</p>
      )}
      {submitState === 'invalid' && (
        <p className="form__status form__status--error" role="alert">Please fix the highlighted fields before submitting.</p>
      )}
      {submitState === 'error' && serverError && (
        <div className="form__error" role="alert" aria-live="assertive">
          <p>{serverError}</p>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setSubmitState('idle')}>Try again</button>
        </div>
      )}
    </form>
  );
}

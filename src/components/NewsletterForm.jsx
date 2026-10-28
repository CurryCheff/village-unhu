import React, { useRef, useState } from 'react';
import useForm from '../hooks/useForm';
import { submitToWeb3Forms } from '../utils/web3forms';

function validateNewsletter(values) {
  const errors = {};
  if (!values.email?.trim() || !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Please enter a valid email.';
  }
  return errors;
}

export default function NewsletterForm() {
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const { values, errors, fieldProps, reset, setField, setSubmitState, handleSubmit, isSubmitting, submitState } = useForm({
    initialValues: { email: '', botcheck: false },
    validate: validateNewsletter,
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    if (values.botcheck) {
      setSubmitState('success');
      reset();
      return;
    }

    if (Date.now() - lastSubmitRef.current < 10000) return;
    lastSubmitRef.current = Date.now();
    setServerError('');

    await handleSubmit(async (formValues) => {
      const result = await submitToWeb3Forms({
        subject: 'New newsletter signup',
        from_name: 'Village Unhu website',
        replyto: formValues.email,
        email: formValues.email,
        // TODO: replace with a real mailing list provider (Buttondown/Mailchimp) when the list grows
        botcheck: false,
      });

      if (!result.ok) {
        setServerError(result.message || 'Something went wrong. Please try again.');
        throw new Error(result.message || 'Submit failed');
      }

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
      {errors.email && <small className="field-error">{errors.email}</small>}
      {submitState === 'success' && <p className="form__status" role="status" aria-live="polite">Thanks for subscribing — you’re on the list.</p>}
      {submitState === 'invalid' && <p className="form__status form__status--error" role="alert">Please add a valid email.</p>}
      {submitState === 'error' && serverError && (
        <div className="form__error" role="alert" aria-live="assertive">
          <p>{serverError}</p>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setSubmitState('idle')}>Try again</button>
        </div>
      )}
    </form>
  );
}

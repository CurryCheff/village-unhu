import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { submitToWeb3Forms } from '../utils/web3forms';
import { validatePhone } from '../utils/validation';

const topicOptions = ['Studios', 'Residency', 'Exhibitions', 'Workshops', 'Something else'];
const phoneRequired = false;

function validateContact(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Please enter your name.';
  if (!values.email?.trim() || !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Please enter a valid email.';
  const phoneError = validatePhone(values.phone, phoneRequired);
  if (phoneError) errors.phone = phoneError;
  if (!values.message?.trim()) errors.message = 'Please add a short message.';
  return errors;
}

export default function ContactSection() {
  const location = useLocation();
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const { values, errors, fieldProps, handleSubmit, isSubmitting, submitState, reset, setField, setSubmitState } = useForm({
    initialValues: { name: '', email: '', phone: '', topic: 'Studios', message: '', botcheck: false },
    validate: validateContact,
  });

  useEffect(() => {
    const topicFromUrl = new URLSearchParams(location.search).get('topic');
    if (topicFromUrl) {
      setField('topic', topicFromUrl);
    }
  }, [location.search, setField]);

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
        subject: `Village Unhu enquiry: ${formValues.topic}`,
        from_name: 'Village Unhu website',
        replyto: formValues.email,
        name: formValues.name,
        email: formValues.email,
        ...(formValues.phone?.trim() ? { phone: formValues.phone.trim() } : {}),
        topic: formValues.topic,
        message: formValues.message,
        botcheck: false,
      });

      if (!result.ok) {
        setServerError(result.message || 'Your message could not be sent. Please try again.');
        throw new Error(result.message || 'Submit failed');
      }

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
        {errors.name && <small id="contact-name-error" className="field-error">{errors.name}</small>}
      </div>

      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" type="email" {...fieldProps('email')} autoComplete="email" aria-invalid={Boolean(errors.email)} />
        {errors.email && <small id="contact-email-error" className="field-error">{errors.email}</small>}
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
        {errors.phone && <small id="contact-phone-error" className="field-error">{errors.phone}</small>}
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
        {errors.message && <small id="contact-message-error" className="field-error">{errors.message}</small>}
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

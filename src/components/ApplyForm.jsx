import React, { useMemo, useRef, useState } from 'react';
import useForm from '../hooks/useForm';
import { submitToWeb3Forms } from '../utils/web3forms';

const disciplineOptions = ['Visual', 'Sound', 'Performance'];
const intakeOptions = ['[TODO: intake 1]', '[TODO: intake 2]', '[TODO: intake 3]'];

function validateApplication(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Please add your name.';
  if (!values.email?.trim() || !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.country?.trim()) errors.country = 'Please add your country.';
  if (!values.discipline) errors.discipline = 'Select a discipline.';
  if (!values.intake) errors.intake = 'Choose your preferred intake.';
  if (!values.statement?.trim()) errors.statement = 'Tell us about your practice.';
  if (values.statement && values.statement.trim().length > 800) errors.statement = 'Statement must be under 800 characters.';
  if (values.portfolioLink && !/^(https?:\/\/|www\.)/i.test(values.portfolioLink)) {
    errors.portfolioLink = 'Enter a valid URL or leave it blank.';
  }
  return errors;
}

async function submitApplication(values) {
  return submitToWeb3Forms({
    subject: `Residency application: ${values.name}`,
    from_name: 'Village Unhu website',
    replyto: values.email,
    name: values.name,
    email: values.email,
    country: values.country,
    discipline: values.discipline,
    intake: values.intake,
    statement: values.statement,
    portfolio_link: values.portfolioLink || '',
    botcheck: false,
  });
}

export default function ApplyForm() {
  const lastSubmitRef = useRef(0);
  const [serverError, setServerError] = useState('');
  const { values, errors, fieldProps, handleSubmit, isSubmitting, submitState, reset, setField, setSubmitState } = useForm({
    initialValues: {
      name: '',
      email: '',
      country: '',
      discipline: '',
      intake: '',
      statement: '',
      portfolioLink: '',
      botcheck: false,
    },
    validate: validateApplication,
  });

  const statementLength = useMemo(() => values.statement?.length ?? 0, [values.statement]);

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
      const result = await submitApplication(formValues);

      if (!result.ok) {
        setServerError(result.message || 'Your application could not be sent. Please try again.');
        throw new Error(result.message || 'Submit failed');
      }

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
        {errors.name && <small id="name-error" className="field-error">{errors.name}</small>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...fieldProps('email')} placeholder="you@example.com" />
        {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
      </div>

      <div className="field">
        <label htmlFor="country">Country</label>
        <input id="country" {...fieldProps('country')} placeholder="Country of residence" />
        {errors.country && <small id="country-error" className="field-error">{errors.country}</small>}
      </div>

      <div className="field">
        <label htmlFor="discipline">Discipline</label>
        <select id="discipline" {...fieldProps('discipline')}>
          <option value="">Select one</option>
          {disciplineOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.discipline && <small id="discipline-error" className="field-error">{errors.discipline}</small>}
      </div>

      <div className="field">
        <label htmlFor="intake">Preferred intake</label>
        <select id="intake" {...fieldProps('intake')}>
          <option value="">Select an intake</option>
          {intakeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.intake && <small id="intake-error" className="field-error">{errors.intake}</small>}
      </div>

      <div className="field field--full">
        <label htmlFor="statement">Statement</label>
        <textarea id="statement" rows="6" {...fieldProps('statement')} placeholder="Tell us about your practice and why this residency feels relevant." />
        <div className="field-meta">
          <span>{statementLength}/800</span>
        </div>
        {errors.statement && <small id="statement-error" className="field-error">{errors.statement}</small>}
      </div>

      <div className="field field--full">
        <label htmlFor="portfolioLink">Portfolio link</label>
        <input id="portfolioLink" type="url" {...fieldProps('portfolioLink')} placeholder="https://your-portfolio.com" />
        <small className="field-meta">Share a link to your portfolio, Google Drive, Dropbox or website.</small>
        {errors.portfolioLink && <small id="portfolioLink-error" className="field-error">{errors.portfolioLink}</small>}
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

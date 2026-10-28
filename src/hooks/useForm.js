import { useCallback, useMemo, useState } from 'react';

export default function useForm({ initialValues, validate = () => ({}) }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState('idle');

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setField(name, value);
  }, [setField]);

  const validateFields = useCallback(() => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(async (submitFn) => {
    const valid = validateFields();
    if (!valid) {
      setSubmitState('invalid');
      return false;
    }

    setIsSubmitting(true);
    setSubmitState('submitting');

    try {
      const result = await submitFn(values);
      setSubmitState('success');
      return result;
    } catch (error) {
      setSubmitState('error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateFields, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitState('idle');
  }, [initialValues]);

  const fieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  }), [errors, handleChange, values]);

  return useMemo(() => ({
    values,
    errors,
    setValues,
    setField,
    handleChange,
    fieldProps,
    validateFields,
    handleSubmit,
    reset,
    isSubmitting,
    submitState,
    setSubmitState,
  }), [errors, fieldProps, handleChange, handleSubmit, isSubmitting, reset, setField, submitState, validateFields, values]);
}

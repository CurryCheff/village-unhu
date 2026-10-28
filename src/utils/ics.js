export function buildIcsEvent({ title, start, end, description, location = '' }) {
  const escapeValue = (value = '') =>
    value
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');

  const toUtcDate = (dateInput) => {
    const date = new Date(dateInput);
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
  };

  const startDate = toUtcDate(start);
  const endDate = toUtcDate(end || new Date(new Date(start).getTime() + 60 * 60 * 1000));

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${title}-${startDate}@village-unhu`,
    `DTSTAMP:${toUtcDate(new Date())}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeValue(title)}`,
    `DESCRIPTION:${escapeValue(description)}`,
    `LOCATION:${escapeValue(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(event) {
  const data = buildIcsEvent(event);
  const blob = new Blob([data], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

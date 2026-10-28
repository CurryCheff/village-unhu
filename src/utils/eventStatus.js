export function getEventStatus(dateString) {
  if (!dateString) return 'upcoming';

  const today = new Date();
  const eventDate = new Date(dateString);

  if (Number.isNaN(eventDate.getTime())) return 'upcoming';
  if (eventDate < today) return 'past';

  const monthAhead = new Date();
  monthAhead.setMonth(today.getMonth() + 1);
  return eventDate <= monthAhead ? 'opening-soon' : 'upcoming';
}

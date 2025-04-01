export function convertToCompactEuDatetime(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date)) {
    return 'Invalid Date';
  }

  return date.toLocaleString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

export function isSameDay(dateInput1, dateInput2) {
  const date1 = new Date(dateInput1);
  const date2 = new Date(dateInput2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatToOnlyTime(dateInput) {
  const date = new Date(dateInput);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function prettifyDateTime(isoString) {
  const date = new Date(isoString);

  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  };

  return date.toLocaleString('en-GB', options).replace(',', ' -');
}

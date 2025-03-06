
export function convertToCompactEuDatetime(date){
    return date.toLocaleString('en-GB', {
        hour12: false, // Use 24-hour format
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
};

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatToOnlyTime(date){
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  // const seconds = date.getSeconds().toString().padStart(2, '0');
  // return `${hours}:${minutes}:${seconds}`;
  return `${hours}:${minutes}`;
}
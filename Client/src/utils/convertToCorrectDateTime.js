
function convertToCompactEuDatetime(date){
    return date.toLocaleString('en-GB', {
        hour12: false, // Use 24-hour format
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
};

export default convertToCompactEuDatetime;
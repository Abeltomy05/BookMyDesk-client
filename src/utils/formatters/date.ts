export const formatDate = (dateInput: Date | string | undefined) => {
  if (!dateInput) return "Invalid date";
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
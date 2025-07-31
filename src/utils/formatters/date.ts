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

export const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toDateString(); 
};

export const getMonthName = (monthStr: string) => {
  return new Date(`${monthStr}-01`).toLocaleString('default', { month: 'long' });
};
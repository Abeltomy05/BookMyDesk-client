import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (dateInput: Date | string | undefined) => {
  if (!dateInput) return "Invalid date";
  const date = dayjs(dateInput).tz('Asia/Kolkata');
  return date.format('DD MMM YYYY');
};

export const formatDateLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toDateString(); 
};

export const getMonthName = (monthStr: string) => {
  return new Date(`${monthStr}-01`).toLocaleString('default', { month: 'long' });
};

export const formatBookingDates = (bookingDates: string[] | Date[]) => {
  if (!bookingDates || bookingDates.length === 0) return 'No dates';

  const sortedDates = [...bookingDates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let isConsecutive = true;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffInDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffInDays !== 1) {
      isConsecutive = false;
      break;
    }
  }

  if (sortedDates.length === 1) {
    return formatDate(sortedDates[0]);
  }

  if (isConsecutive) {
    return `${formatDate(sortedDates[0])} - ${formatDate(sortedDates[sortedDates.length - 1])} (${sortedDates.length} days)`;
  }

  return `${sortedDates.map(d => formatDate(d)).join('\n')} (${sortedDates.length} days)`;
};

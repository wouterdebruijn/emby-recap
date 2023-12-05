export function locateDurationString(
  duration: number,
  hoursOnly = false,
  daysOnly = false,
) {
  const remaining = duration;
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining - (days * 86400)) / 3600);
  const minutes = Math.floor(
    (remaining - (days * 86400) - (hours * 3600)) / 60,
  );

  if (hoursOnly && hours !== 0) {
    return hours === 1 ? `${hours} hour` : `${hours} hours`;
  }

  if (daysOnly && days !== 0) {
    return days === 1 ? `${days} day` : `${days} days`;
  }

  if (days !== 0 && hours !== 0 && minutes !== 0) {
    return `${days} days, ${hours} hours and ${minutes} minutes`;
  }

  if (hours !== 0 && minutes !== 0) {
    return `${hours} hours and ${minutes} minutes`;
  }

  if (days !== 0 && hours !== 0) {
    return `${days} days and ${hours} hours`;
  }

  if (days !== 0) {
    return `${days} days`;
  }

  if (hours !== 0) {
    return `${hours} hours`;
  }

  if (minutes !== 0) {
    return `${minutes} minutes`;
  }

  return `${duration} seconds`;
}

export function getWeekday(day: number) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[day];
}

export function getPlace(place: number) {
  switch (place) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${place}th`;
  }
}

export function startOfIsoDay(value = new Date()) {
  return new Date(new Date(value).toISOString().slice(0, 10));
}

export function endOfIsoDay(value = new Date()) {
  const date = startOfIsoDay(value);
  date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCMilliseconds(date.getUTCMilliseconds() - 1);
  return date;
}

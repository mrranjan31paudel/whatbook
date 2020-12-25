function parseDateTime(date, time) {
  let parsedValue = `${date} at ${time.split(':', 2).join(':')}`;

  return parsedValue;
}

export default parseDateTime;

function parseDateTime(dateTime) {
  let parsedValue = dateTime.replace('T', ' at ').replace(':00.000Z', '');
  return parsedValue;
}

export default parseDateTime;
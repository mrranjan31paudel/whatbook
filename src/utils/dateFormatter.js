import { MONTH } from './../constants/dob';

function formatToYYYYMMDD(date) {

  let dateParts = date.split(' ');
  let monthNumber = `${MONTH.indexOf(dateParts[1])}`;

  if (monthNumber.length < 2) {
    monthNumber = '0' + monthNumber;
  }

  return `${dateParts[3]}-${monthNumber}-${dateParts[2]}`;
}

export default formatToYYYYMMDD;
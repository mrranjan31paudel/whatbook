const MONTH = [
  'Month',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTH_OPTIONS = MONTH.map((m, idx) => ({
  label: m,
  value: `${idx}`,
}));

const DAY = [
  'Day',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
];
const DAY_OPTIONS = DAY.map((d, idx) => ({
  label: d,
  value: `${idx}`,
}));

let YEAR_OPTIONS = [
  {
    label: 'Year',
    value: '0',
  },
];

let currYear = new Date().getFullYear();

for (let i = currYear - 50; i <= currYear; ++i) {
  YEAR_OPTIONS.push({
    label: `${i}`,
    value: `${i}`,
  });
}

export { MONTH, MONTH_OPTIONS, DAY, DAY_OPTIONS, YEAR_OPTIONS };

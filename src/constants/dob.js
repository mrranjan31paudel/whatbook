const MONTH = ['Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DAY = ['Day', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

let Year = {
    '0': 'Year',
};

for (let i = 1950; i <= 2020; ++i) {
    Year[`${i}`] = `${i}`;
}

export { MONTH, DAY, Year };
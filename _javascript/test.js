let savings = 100000;
let period = 12;
let addition = 10000;
let percent = 0.1395;
let result = 0;
let profit = 0;

for (let i = 0; i <= period; i++) {
    if (i = 0) {
        result += savings * percent / 12
    } else {
        savings += addition;
        result += savings * percent / 12;
    }
};

console.log(result, profit);


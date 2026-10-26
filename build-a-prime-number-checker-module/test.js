
const { isPrime } = require("./index");

console.log(isPrime(2));  // true
console.log(isPrime(7));  // true
console.log(isPrime(9));  // false
console.log(isPrime(1));  // false
console.log(isPrime(0));  // false
console.log(isPrime(-5)); // false

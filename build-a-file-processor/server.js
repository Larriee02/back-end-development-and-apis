// Starter file — add your code here
const fs = require("fs");
console.log(fs);

fs.readFile("assets/poem.txt", { encoding: "utf8" }, (err, data) => {
  console.log(data);
});

const fsPromises = require("fs/promises");

async function main() {
  const data = await fsPromises.readFile("assets/poem.txt", {
    encoding: "utf8",
  });
  console.log(data);
}

main();

fs.writeFileSync("assets/output.txt", "Hello, freeCodeCamp!");
fs.appendFileSync("assets/output.txt", "\nRunning");


const exists = fs.existsSync("assets/output.txt");
console.log(exists);

const entries = fs.readdirSync("assets");
console.log(entries);
const buf = Buffer.from("Hello, Node!");
console.log(buf);
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

mod=(4+3)%6;
console.log(mod);

readline.question("0 - 0 \n" + 
    "1 - 1 \n" +
    "x - exit \n" +
    "? - help \n" +
    "Your selection: ", (input) => {
  readline.close();
});
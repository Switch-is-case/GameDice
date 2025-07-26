const crypto = require('crypto');

const a = process.argv.slice(2);

let playerMod;
let computerMod;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
// gsk - generated secrete key
function gsk(length){
    return crypto.randomBytes(length).toString('hex');
}
let sk = gsk(32);
// r - random
function r(n){
    return Math.floor(Math.random()*n);
}
let v = r(2);

let hmac = crypto.createHmac('sha256' ,sk).update(v.toString()).digest('hex');

//console.log('Secret key:', sk);
//console.log('Random value:', v);
//console.log('HMAC:', hmac);
console.log("Let's determine who makes the first move. \n" + 
    "I selected a random value in the range 0..1 \n" + 
    "(HMAC=" + hmac + "). \n" + 
    "Try to guess my selection. \n");

readline.question("0 - 0 \n" + 
    "1 - 1 \n" +
    "x - exit \n" +
    "? - help \n" +
    "Your selection: ", (input) => {

    if (input === 'x') {
      console.log("Goodbye!");
      readline.close();
      return;
    }

    if (input === '?') {
      console.log("Try to guess whether the computer selected 0 or 1.");
      readline.close();
      return;
    }

    console.log("My selection: " + v + "(KEY=" + sk +").")

    if (input == v){
        console.log("You make the first move and choose the dice \n" +
            "Choose your dice:"
        )
        readline.question("0 - "+ a[0] + "\n" + 
        "1 - "+ a[1] + "\n" +
        "2 - "+ a[2] + "\n" +
        "x - exit \n" +
        "? - help \n" +
        "Your selection: ", (dicechoice) => {

        if(dicechoice === "x"){
            console.log("Goodbye!");
        }

        else if(dicechoice === '?'){
            console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
        }

        else if(['0', '1', '2'].includes(dicechoice)){
            console.log("You choose the " + a[dicechoice] + "dice");

            let playerChoice = parseInt(dicechoice);

            let playerDieValues = a[playerChoice].split(',');

            let remainingChoices = [0, 1, 2].filter(i => i !== playerChoice);

            let randomIndex = Math.floor(Math.random() * remainingChoices.length);

            let computerChoice = remainingChoices[randomIndex];

            let computerDieValues = a[computerChoice].split(',');

            console.log("I choose the " + a[computerChoice] + " dice");

            // gsk - generated secrete key
            function gsk(length){
                return crypto.randomBytes(length).toString('hex');
            }
            sk = gsk(32);
            // r - random
            function r(n){
                return Math.floor(Math.random()*n);
            }
            v = r(6);

            hmac = crypto.createHmac('sha256' ,sk).update(v.toString()).digest('hex');

            console.log("It's time for your roll.");

            console.log("I selected a random value in the range 0..5 \n" + 
                "(HMAC=" + hmac + "). \n" + 
                "Add your number modulo 6."
            )

            readline.question("0 - 0 \n" + 
            "1 - 1 \n" +
            "2 - 2 \n" +
            "3 - 3 \n" +
            "4 - 4 \n" +
            "5 - 5 \n" +
            "x - exit \n" +
            "? - help \n" +
            "Your selection: ", (number) => {
                if(number === "x"){
                console.log("Goodbye!");
                }

                else if(number === '?'){
                console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
                }

                else if(['0', '1', '2', '3', '4', '5'].includes(number)){
                    console.log("My number is " + v + "(KEY=" + sk +").")
                    mod = (v + number)%6;
                    playerMod = mod;
                    let playerRollResult = parseInt(playerDieValues[playerMod]);
                    console.log("Your roll result is " + playerRollResult);

                    // gsk - generated secrete key
                    function gsk(length){
                        return crypto.randomBytes(length).toString('hex');
                    }
                    sk = gsk(32);
                    // r - random
                    function r(n){
                        return Math.floor(Math.random()*n);
                    }
                    v = r(6);

                    hmac = crypto.createHmac('sha256' ,sk).update(v.toString()).digest('hex');

                    console.log("It's time for my roll.");

                    console.log("I selected a random value in the range 0..5 \n" + 
                        "(HMAC=" + hmac + "). \n" + 
                        "Add your number modulo 6."
                    )
                    
                    readline.question("0 - 0 \n" + 
                    "1 - 1 \n" +
                    "2 - 2 \n" +
                    "3 - 3 \n" +
                    "4 - 4 \n" +
                    "5 - 5 \n" +
                    "x - exit \n" +
                    "? - help \n" +
                    "Your selection: ", (number) => {
                        if(number === "x"){
                        console.log("Goodbye!");
                        }

                        else if(number === '?'){
                        console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
                        }
                        
                        else if(['0', '1', '2', '3', '4', '5'].includes(number)){
                            console.log("My number is " + v + "(KEY=" + sk +").")
                            mod = (v + number)%6;
                            computerMod = mod;
                            let computerRollResult = parseInt(computerDieValues[computerMod]);
                            console.log("My roll result is " + computerRollResult);

                            if(playerRollResult > computerRollResult){
                                console.log("You win " + "(" + playerRollResult +">" + computerRollResult + ")!");
                                readline.close();
                            }
                            else{
                                console.log("Computer win " + "(" + playerRollResult +"<" + computerRollResult + ")!");
                                readline.close();
                            }

                        }

                    })

                }
            });

        }
    }); 
    }
    else {
        let a = process.argv.slice(2).map(s => s.split(',').map(Number));

        let randomIndex = Math.floor(Math.random() * a.length);
        let computerChoice = a.splice(randomIndex, 1)[0];

        console.log("I make the first move and choose the " + computerChoice + " dice.")

        readline.question("0 - "+ a[0] + "\n" + 
        "1 - "+ a[1] + "\n" +
        "x - exit \n" +
        "? - help \n" +
        "Your selection: ", (dicechoice) => {

        if(dicechoice === "x"){
            console.log("Goodbye!");
        }

        else if(dicechoice === '?'){
            console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
        }

        else if(['0', '1'].includes(dicechoice)){
            console.log("You choose the " + a[dicechoice] + " dice");

            let playerChoice = parseInt(dicechoice);

            let playerDieValues = a[playerChoice];

            let computerDieValues = computerChoice;

            // gsk - generated secrete key
            function gsk(length){
                return crypto.randomBytes(length).toString('hex');
            }
            sk = gsk(32);
            // r - random
            function r(n){
                return Math.floor(Math.random()*n);
            }
            v = r(6);

            hmac = crypto.createHmac('sha256' ,sk).update(v.toString()).digest('hex');

            console.log("It's time for my roll.");

            console.log("I selected a random value in the range 0..5 \n" + 
                "(HMAC=" + hmac + "). \n" + 
                "Add your number modulo 6."
            )

            readline.question("0 - 0 \n" + 
            "1 - 1 \n" +
            "2 - 2 \n" +
            "3 - 3 \n" +
            "4 - 4 \n" +
            "5 - 5 \n" +
            "x - exit \n" +
            "? - help \n" +
            "Your selection: ", (number) => {
                if(number === "x"){
                console.log("Goodbye!");
                }

                else if(number === '?'){
                console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
                }

                else if(['0', '1', '2', '3', '4', '5'].includes(number)){
                    console.log("My number is " + v + "(KEY=" + sk +").")
                    mod = (v + number)%6;
                    playerMod = mod;
                    let playerRollResult = parseInt(playerDieValues[playerMod]);
                    console.log("My roll result is " + playerRollResult);

                    // gsk - generated secrete key
                    function gsk(length){
                        return crypto.randomBytes(length).toString('hex');
                    }
                    sk = gsk(32);
                    // r - random
                    function r(n){
                        return Math.floor(Math.random()*n);
                    }
                    v = r(6);

                    hmac = crypto.createHmac('sha256' ,sk).update(v.toString()).digest('hex');

                    console.log("It's time for your roll.");

                    console.log("I selected a random value in the range 0..5 \n" + 
                        "(HMAC=" + hmac + "). \n" + 
                        "Add your number modulo 6."
                    )
                    
                    readline.question("0 - 0 \n" + 
                    "1 - 1 \n" +
                    "2 - 2 \n" +
                    "3 - 3 \n" +
                    "4 - 4 \n" +
                    "5 - 5 \n" +
                    "x - exit \n" +
                    "? - help \n" +
                    "Your selection: ", (number) => {
                        if(number === "x"){
                        console.log("Goodbye!");
                        }

                        else if(number === '?'){
                        console.log("Each dice has different numbers. Choose the one that gives you an advantage.");
                        }
                        
                        else if(['0', '1', '2', '3', '4', '5'].includes(number)){
                            console.log("My number is " + v + "(KEY=" + sk +").")
                            mod = (v + number)%6;
                            computerMod = mod;
                            let computerRollResult = parseInt(computerDieValues[computerMod]);
                            console.log("Your roll result is " + computerRollResult);

                            if(playerRollResult > computerRollResult){
                                console.log("You win " + "(" + playerRollResult +">" + computerRollResult + ")!");
                                readline.close();
                            }
                            else{
                                console.log("Computer win " + "(" + playerRollResult +"<" + computerRollResult + ")!");
                                readline.close();
                            }

                        }

                    })

                }
            });

        }

    });

    }
});
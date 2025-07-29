const crypto = require('crypto');
const prompt = require('prompt-sync')();

class Die {
    #values;

    constructor(valuesString) {
        this.#values = valuesString.split(',').map(Number);
    }

    getRollResult(index) {
        return this.#values[index];
    }

    toString() {
        return `[${this.#values.join(',')}]`;
    }
}

class Player {
    #name;
    #isHuman;
    #die = null;
    #rollResult = 0;

    constructor(name, isHuman) {
        this.#name = name;
        this.#isHuman = isHuman;
    }

    setDie(dieObject) { this.#die = dieObject; }
    getDie() { return this.#die; }
    setRollResult(result) { this.#rollResult = result; }
    getRollResult() { return this.#rollResult; }
    getName() { return this.#name; }
    isHuman() { return this.#isHuman; }
}

class CryptoHelper {
    static secureRandom(max) {
        return crypto.randomBytes(4).readUInt32LE(0) % max;
    }

    static generateKey() {
        return crypto.randomBytes(32).toString('hex').toUpperCase();
    }

    static createHmac(key, data) {
        return crypto.createHmac('sha256', key).update(data).digest('hex').toUpperCase();
    }
}

class UI {
    #prompt;

    constructor() {
        this.#prompt = prompt;
    }

    displayMessage(message) {
        console.log(message);
    }

    askQuestion(query) {
        return this.#prompt(`${query} `);
    }

    showMenu(options, showExit = true, showHelp = true) {
        options.forEach((opt, i) => this.displayMessage(`${i} - ${opt}`));
        if (showExit) this.displayMessage("X - exit");
        if (showHelp) this.displayMessage("? - help");
    }
    
    displaySeparator() {
        this.displayMessage("----------------------------------------------------");
    }
}

class Rules {
    determineWinner(player1, player2) {
        const result1 = player1.getRollResult();
        const result2 = player2.getRollResult();
        if (result1 > result2) return player1;
        if (result2 > result1) return player2;
        return null;
    }

    getRollIndex(secretValue, opponentValue) {
        return (secretValue + opponentValue) % 6;
    }
}

class Game {
    #ui;
    #rules;
    #players;
    #allDice;

    constructor(diceArgs) {
        if (diceArgs.length < 2) {
            console.log("Ошибка: Укажите как минимум две игральные кости.");
            process.exit(1);
        }

        this.#ui = new UI();
        this.#rules = new Rules();
        this.#players = [new Player("You", true), new Player("My", false)];
        this.#allDice = diceArgs.map(arg => new Die(arg));
    }

    start() {
        this.#ui.displayMessage("Добро пожаловать в игру!");
        this.#ui.displaySeparator();
        const humanGoesFirst = this.#determineFirstMove();
        this.#ui.displaySeparator();
        this.#selectDicePhase(humanGoesFirst);
        this.#ui.displaySeparator();
        this.#playRollsPhase();
        this.#ui.displaySeparator();
        this.#endGame();
    }

    #determineFirstMove() {
        const key = CryptoHelper.generateKey();
        const computerChoice = CryptoHelper.secureRandom(2);
        const hmac = CryptoHelper.createHmac(key, computerChoice.toString());

        this.#ui.displayMessage("Let's determine who makes the first move.");
        this.#ui.displayMessage(`I selected a random value in the range 0..1 \n(HMAC=${hmac}).`);
        this.#ui.displayMessage("Try to guess my selection.");
        this.#ui.showMenu(['0', '1']);

        const playerInput = this.#ui.askQuestion("Your selection:");
        if (playerInput.toLowerCase() === 'x') process.exit();

        this.#ui.displayMessage(`My selection: ${computerChoice} (KEY=${key}).`);
        return parseInt(playerInput, 10) === computerChoice;
    }

    #selectDicePhase(humanGoesFirst) {
        let availableDice = [...this.#allDice];
        const [human, computer] = this.#players;

        if (humanGoesFirst) {
            this.#ui.displayMessage("You make the first move to choose the dice.");
            this.#playerSelectsDie(human, availableDice);
            this.#computerSelectsDie(computer, availableDice);
        } else {
            this.#ui.displayMessage("I make the first move to choose the dice.");
            this.#computerSelectsDie(computer, availableDice);
            this.#playerSelectsDie(human, availableDice);
        }
    }
    
    #playerSelectsDie(player, availableDice) {
        this.#ui.displayMessage("Choose your dice:");
        this.#ui.showMenu(availableDice.map(d => d.toString()));
        const choiceStr = this.#ui.askQuestion("Your selection:");
        const choiceIndex = parseInt(choiceStr, 10);
        
        const chosenDie = availableDice.splice(choiceIndex, 1)[0];
        player.setDie(chosenDie);
        this.#ui.displayMessage(`You choose the ${player.getDie()} dice.`);
    }

    #computerSelectsDie(player, availableDice) {
        const choiceIndex = CryptoHelper.secureRandom(availableDice.length);
        const chosenDie = availableDice.splice(choiceIndex, 1)[0];
        player.setDie(chosenDie);
        this.#ui.displayMessage(`I choose the ${player.getDie()} dice.`);
    }

    #playRollsPhase() {
        for (const player of this.#players) {
            this.#handlePlayerRoll(player);
            this.#ui.displaySeparator();
        }
    }
    
    #handlePlayerRoll(currentPlayer) {
        this.#ui.displayMessage(`It's time for ${currentPlayer.getName().toLowerCase()} roll.`);
        const key = CryptoHelper.generateKey();
        const secretValue = CryptoHelper.secureRandom(6);
        const hmac = CryptoHelper.createHmac(key, secretValue.toString());
        
        this.#ui.displayMessage(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
        this.#ui.displayMessage("Add your number modulo 6.");
        this.#ui.showMenu(['0','1','2','3','4','5']);
        
        const opponent = this.#players.find(p => p !== currentPlayer);
        let opponentValue;
        
        opponentValue = parseInt(this.#ui.askQuestion("Your selection:"), 10);
        
        this.#ui.displayMessage(`My number is ${secretValue} (KEY=${key}).`);
        const rollIndex = this.#rules.getRollIndex(secretValue, opponentValue);
        const rollResult = currentPlayer.getDie().getRollResult(rollIndex);
        currentPlayer.setRollResult(rollResult);
        
        this.#ui.displayMessage(`The fair number generation result is ${secretValue} + ${opponentValue} = ${rollIndex} (mod 6).`);
        this.#ui.displayMessage(`${currentPlayer.getName()} roll result is ${rollResult}.`);
    }

    #endGame() {
        const [human, computer] = this.#players;
        const winner = this.#rules.determineWinner(human, computer);
        
        this.#ui.displayMessage(`Final Score: You (${human.getRollResult()}) vs. Computer (${computer.getRollResult()})`);
        
        if (winner === null) {
            this.#ui.displayMessage("It's a draw!");
        } else {
            this.#ui.displayMessage(`${winner.getName()} win!`);
        }
    }
}

const diceArguments = process.argv.slice(2);
const game = new Game(diceArguments);
game.start();
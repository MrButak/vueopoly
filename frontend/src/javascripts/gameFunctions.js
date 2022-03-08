const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();

// Function returns a number which represents the index postion of a player in players array
exports.getCrntPlayer = () => {

    // gameLogic.whosTurn is the index postition in players array

    // for first turn of the game
    if(gameLogic.value.firstTurn){return(gameLogic.value.whosTurn)};

    // if have reached end of player array, return to index 0
    if(gameLogic.value.whosTurn == players.value.length - 1) {
        gameLogic.value.whosTurn = 0;
        return(gameLogic.value.whosTurn);
    };

    // increase index postion
    gameLogic.value.whosTurn++;
    return(gameLogic);
};

// Function returns 2 random numbers (1-6)
exports.rollDice = () => {

    let dice = [];
    dice.push(Math.floor(Math.random() * 6 + 1));
    dice.push(Math.floor(Math.random() * 6 + 1));
      
    return(dice)
};
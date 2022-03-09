const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();

// Function returns a number which represents the index position of a player in players array
exports.getCrntPlayer = () => {

    // gameLogic.whosTurn is the index postition in players array

    // for first turn of the game
    if(gameLogic.value.firstTurn){return(gameLogic.value.whosTurn)};

    // if have reached end of player array, return to index 0
    if(gameLogic.value.whosTurn == players.value.length - 1) {
        gameLogic.value.whosTurn = 0;
        return(gameLogic.value.whosTurn);
    };

    // increase index position
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

// Function adds rolled dice to player position and gets new postion information
exports.playerPosInfo = (moveCount) => {

    // TODO: modular math
    let propertyInfo = {};
    // calculate player's new position
    players.value[gameLogic.value.whosTurn].position += moveCount;
    
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];

    let propertyCoordIndex = vueopoly.value.tiles.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['coord'] = vueopoly.value.tiles[[propertyCoordIndex]];

    return(propertyInfo)
    
};


// Function is main funciton call that handles property which player lands on
exports.dtrmPropertyAction = (propertyInfo) => {

    console.log(vueopoly.value);


    // IDEA: send array back. ['chance', indexOf card in array]
    let handleSpecialProperty = () => {

        switch(propertyInfo.info.id.toLowerCase()) {

            case 'chance':
                return(handleChanceCard());
            case 'communitychest':
                return(handleCommChestCard());
            case 'freeparking':
                return(handleFreeParking());
            case 'incometax':
                return(handleIncomeTax());
            case 'luxerytax':
                return(handleLuxertyTax());
            // case 'gotojail':
        }
       
    };

    let handleOwnableProperty = () => {

        // TODO: determine buy/payrent
        return 'ownable property'
        // return canBuyProperty()
        // return payRent()  // moneyCheck // endGame (calculate property mortgages as well, or just end game btn and display message of not enough money)

    };

    // main function call
    switch(propertyInfo.info.group.toLowerCase()) {

        case 'special':
            return handleSpecialProperty();
            
        default:
            return handleOwnableProperty()  
    };   
};

let handleChanceCard = () => {

    let returnData = [];
    returnData.push('chance');
    returnData.push(Math.floor(Math.random() * 14));
    return(returnData);
};

let handleCommChestCard = () => {

    let returnData = [];
    returnData.push('communitychest')
    returnData.push(Math.floor(Math.random() * 15));
    return(returnData);
};

let handleFreeParking = () => {

};

let handleIncomeTax = () => {

};

let handleLuxertyTax = () => {

};

const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();

// Function returns an integer which represents the index position of a player in players array
exports.getCrntPlayer = () => {
    
    // * gameLogic.whosTurn is the index postition in players array

    // for first turn of the game
    if(gameLogic.value.firstTurn){
        gameLogic.value.firstTurn = false;
        return(gameLogic.value.whosTurn)
    };

    // TODO: handle in jail
    // if(players.value[gameLogic.value.whosTurn].inJail) {

    // };

    // if have reached end of player array, return to index 0
    if(gameLogic.value.whosTurn == players.value.length - 1) {

        gameLogic.value.whosTurn = 0;
        return(gameLogic.value.whosTurn);
    };

    // increase index position
    gameLogic.value.whosTurn++;


    return(gameLogic.value.whosTurn);
};


exports.moneyCheck = (priceToPay, playersMoney) => {
    
    
    if(priceToPay < playersMoney) {
        console.log("money check true")
        return true;
    };
    console.log("money check true")
    return false;

};


// Function returns 2 random numbers (1-6)
exports.rollDice = () => {

    let dice = [];
    dice.push(Math.floor(Math.random() * 6 + 1));
    dice.push(Math.floor(Math.random() * 6 + 1));
      
    return(dice)
};


// Function adds rolled dice to player position and gets new postion information
exports.movePlayerPos = (moveCount) => {

    
    let propertyInfo = {};

    // wrap piece around gameboard
    if(players.value[gameLogic.value.whosTurn].position + moveCount > 39) {
        let newPos = moveCount - (39 - players.value[gameLogic.value.whosTurn].position + 1);
        players.value[gameLogic.value.whosTurn].position = newPos;
    }
    else {
        players.value[gameLogic.value.whosTurn].position += moveCount;
    };
    
    
    // get index of property landed on and add property to object
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];

    console.log(vueopoly.value.properties[propertyInfoIndex]);
    console.log("property info movePlayerPos() ^^^^^^")
    
  
    return(propertyInfo)
};


// Function is main funciton call after dice roll. Handles property landed on.
exports.dtrmPropertyAction = (propertyInfo, crntDiceRoll) => {

    // Function checks if chance or community chest cards are in deck. If not re-asign
    // TODO: make hard copy of vueopoly.value.chance / communitychest to gameLogic.value.chance / community chest
    let checkForEmptyDeck = (cardType) => {

        switch(cardType) {
            
            case 'chance':
                // if deck is empty. re-asign deck and empty gameLogic.usedChance
                if(vueopoly.value.chance.length < 1) {
                    gameLogic.value.chance = this.vueopoly.value.chance; // = gameLogic.value.usedChance
                    gameLogic.value.usedChance = [];
                    break;
                };
                break;

            case 'communitychest':
                if(vueopoly.value.communitychest.length < 1) {
                    gameLogic.value.communitychest = this.vueopoly.value.chance; // = gameLogic.value.usedCommunityChest
                    gameLogic.value.usedCommunityChest = [];
                    break;
                };
                break;
            
            default:
                console.log("unhandled error dtrmPropertyAction.checkForEmptyDeck() gameFunctions.js")
            
        };
            
    };


    
    let handleSpecialProperty = () => {

        let numCardsLeftInDeck;
        let returnData = [];
        switch(propertyInfo.info.id.toLowerCase()) {

            // returns index of random chance and comm chest cards
            case 'chance':
                
                checkForEmptyDeck('chance');
                returnData.push('chance');
                numCardsLeftInDeck = gameLogic.value.chance.length;
                returnData.push(Math.floor(Math.random() * numCardsLeftInDeck));
                return(returnData);
            
            case 'communitychest':
                
                checkForEmptyDeck('communitychest');
                returnData.push('communitychest');
                numCardsLeftInDeck = gameLogic.value.communitychest.length;
                returnData.push(Math.floor(Math.random() * numCardsLeftInDeck));
                return(returnData);

            case 'freeparking':
                returnData.push('freeparking');
                returnData.push(gameLogic.value.freeParking);
                return(returnData);

            case 'incometax':
                returnData.push('incometax');
                if(players.value[gameLogic.value.whosTurn].money * .10 > 200) {
                    returnData.push(200)
                }
                else {
                    returnData.push(players.value[gameLogic.value.whosTurn].money * .10)
                };
                return(returnData);

            case 'luxerytax':
                returnData.push('luxurytax');
                returnData.push(75);
                return(returnData);
            
            // jail / just visiting
            case 'jail':
                returnData.push('jail');
                return(returnData);

            case 'gotojail':
                returnData.push('gotojail');
                console.log("TODO: handle when land on goto jail");
                return(returnData);
            case 'go':
                returnData.push('go');
                return(returnData);
            default:
                console.log("unhandled action in gameFunctions.js dtrmPropertyAction()");
        };
    };
    

    // Function
    let handleOwnableProperty = () => {

        let returnData = [];
        switch(propertyInfo.info.ownedby) {

            case -1:
                returnData.push('notowned');
                // returnData.push(getTotalRentAmount);
                returnData.push(propertyInfo.info.price);
                return(returnData);

            default:
                // TODO: check if mortgaged
                returnData.push('owned');
                returnData.push(this.getTotalRentAmount(propertyInfo))
                // returnData.push(propertyInfo.info.price);
                return(returnData);
        };
        
    };
    
    // main function call
    switch(propertyInfo.info.group.toLowerCase()) {

        case 'special':
            return handleSpecialProperty();
            
        default:
            return handleOwnableProperty()  
    };   
};

exports.getTotalRentAmount = (propertyInfo) => { // propertyInfo{info: propertyObject}

    switch(propertyInfo.info.group.toLowerCase()) {

            
        case 'railroad':
            let railRoadsOwned = 0;
            // create array of all railroads
            let totalRrs = vueopoly.value.properties.filter(property => property.group.toLowerCase() == 'railroad');
            console.log(totalRrs);
            // see how many railroads are owned
            totalRrs.forEach((rr) => {
                if(rr.ownedby == propertyInfo.info.ownedby) {
                    railRoadsOwned++;
                    
                };
            });
            
            // return different rent amounts for amount of railroads owned
            switch(railRoadsOwned) {

                case 1: {
                    return(25);   
                }
                case 2: {
                    return(50);
                }
                case 3: {
                    return(100);
                }
                case 4: {
                    return(200);
                }
            };

        
        case 'utilities':

            switch(propertyInfo.info.id.toLowerCase()) {

                case 'electriccompany':
                    // check if both utilities are owned
                    // get index of waterworks and check ownedby 
                    let waterWorksIndex = vueopoly.value.properties.findIndex(item => item.id == 'waterworks');
                    // if owner owns both utilities
                    if(vueopoly.value.properties[waterWorksIndex].ownedby == propertyInfo.info.ownedby) {
                        return((crntDiceRoll[0] + crntDiceRoll[1]) * 10)
                    };
                    // if only this utility owned
                    return((crntDiceRoll[0] + crntDiceRoll[1]) * 4)
                    
                case 'waterworks':
                    // get index of waterworks and check to see if owned
                    let electricCompanyIndex = vueopoly.value.properties.findIndex(item => item.id == 'electriccompany');
                    // if owner owns both utilities
                    if(vueopoly.value.properties[electricCompanyIndex].ownedby == propertyInfo.info.ownedby) {
                        return((crntDiceRoll[0] + crntDiceRoll[1]) * 10)
                    };
                    // if only this utility owned
                    return((crntDiceRoll[0] + crntDiceRoll[1]) * 4);
            };
            return;

        default:
            // no buildings
            if(propertyInfo.info.buildings > 0) {
                return(propertyInfo.info.rent)
            };
            // with buildings
            return(propertyInfo.info.multpliedrent[propertyInfo.info.buildings])
    };
}

// TODO special cards are also being removed form vueopoly.value.chance/communitychest
exports.handleSpecialCard = (cardTitle) => {

    let crntPlayer = players.value[gameLogic.value.whosTurn];
    let propertyIndex;
    let propertyMovedTo;
    let specialAction = {

        movePlayer: {
            willMove: false,
            position: 0,
            canOwn: false,
            owned: false,
            backThreeSpaces: false,
            log: "optional string for game logs"
        },
        addFunds: {

            willAddFunds: false,
            amount: 0,
            log: "optional string for game logs"
        },
        removeFunds: {
            willRemoveFunds: true,
            amount: 0,
            log: "optional string for game logs"
        }
    };
    
    cardTitle = cardTitle.toLowerCase();

    // Function handles special card "move" action. Checks property moved to, to see if buyable or must pay rent
    let checkPropOwned = (property) => {

        if(property.ownedby == -1) {
            specialAction.movePlayer.canOwn = true;
            specialAction.movePlayer.owned = false;
            return false;
        };
        specialAction.movePlayer.canOwn = true;
        specialAction.movePlayer.owned = true;
        return true;

    };

    

    // determine which special card to take action on
    let cardDrawn;
    if(cardTitle.toLowerCase() == 'chance') {cardDrawn = gameLogic.value.usedChance;}
    else {cardDrawn = gameLogic.value.usedCommunityChest;};
    

    switch(cardDrawn[0].action) { // card that was drawn. // used cards are inserted into arry using unshift(), so index always 0 here

        case 'addfunds':
           
            crntPlayer.money += cardDrawn[0].amount;
            
            return([false, "logs for receive payment on special card"]);

        case 'removefunds':
            // If enough money to pay
            if(this.moneyCheck(cardDrawn[0].amount, crntPlayer.money)) {
                
                crntPlayer.money -= cardDrawn[0].amount;
                return([false, "logs for payment on special card"]);
            }
            // If not enough money to pay
            else {

                console.log("not enough funds");
                return([false, "logs for not enough funds for payment on special card"]);
                // TODO: send not enough money message (possible write a function to handle if moneyCheck() returns false)
            };

        case 'addfundsfromplayers':
            console.log("not handled this special card yet");
            console.log([false, "not handled this special card yet"]);
            return;
            
        case 'removefundstoplayers':
            console.log("not handled this special card yet");
            console.log([false, "not handled this special card yet"]);
            return;

        case 'propertycharges':
            console.log("not handled this special card yet");
            console.log([false, "not handled this special card yet"]);
            return;

        case 'move':

            specialAction.movePlayer.willMove = true;

            switch(cardDrawn[0].tileid) {

                case 'go':
                    crntPlayer.position = 0;
                    specialAction.movePlayer.position = 0;
                    specialAction.movePlayer.canOwn = false;

                case 'illinoiseave':
                case 'boardwalk':
                case 'stcharlesplace':
                case 'readingrailroad':

                    propertyIndex = vueopoly.value.properties.findIndex((each => each.id == cardDrawn[0].tileid));
                    propertyMovedTo = vueopoly.value.properties[propertyIndex];

                    crntPlayer.position = propertyMovedTo.position;

                    specialAction.movePlayer.position = propertyMovedTo.position;
                    specialAction.movePlayer.owned = checkPropOwned(propertyMovedTo)

                    return(specialAction);
                    
                // TODO: try a function call
                // this.dtrmPropertyAction(property, diceRoll) object, integer
                // go back 3 spaces
                default:
                    crntPlayer.position -= 3;
                    propertyIndex = vueopoly.value.properties.findIndex((each => each.position == crntPlayer.position));
                    propertyMovedTo = vueopoly.value.properties[propertyIndex];

                    specialAction.movePlayer.position = crntPlayer.position;
                    specialAction.movePlayer.backThreeSpaces = true;

                    return(specialAction);
                    
            };
        
        case 'movenearest':
            // TODO: send back data to handle move
            switch(cardDrawn[0].groupid) {

                case 'utility':
                    // utility pos 12, 28
                    switch(crntPlayerPos) {
                        case (crntPlayer.position > 28): {
                            crntPlayer.position = 12; // pass go
                            break;
                        }
                        case (crntPlayer.position > 12 && crntPlayer.position < 28): {
                            crntPlayer.position = 28;
                            break;
                        }
                        
                    }
                    console.log("nearest utility not available");
                    return([false, "logs for nearest utility"]);

                // rr pos 5,15,25,35
                case 'railroad':

                    switch(crntPlayer.position) {

                        case (crntPlayer.position > 35):
                            crntPlayer.position = 5; // pass go
                            break;
                        case (crntPlayer.position > 5 && crntPlayer.position < 15): {
                            crntPlayer.position = 15;
                            break;
                        }
                        case (crntPlayer.position > 15 && crntPlayer.position < 25): {
                            crntPlayer.position = 25;
                            break;
                        }
                        case (crntPlayer.position > 25 && crntPlayer.position < 35): {
                            crntPlayer.position = 35;
                            break;
                        }

                    }
                    console.log("nearest railroad not available");
                    return([false, "logs for nearest railroad"]);
            }

        case 'jail':

            switch(cardDrawn[0].subaction) {
                case 'getout':
                    // add 'get out of jail free' card to players special card array
                    crntPlayer.position.specialCards.push(cardDrawn[0]);

                    // remove 'get out of jail free' card from used cards array
                    if(cardTitle.toLowerCase() == 'chance') {
                        gameLogic.value.usedChance.splice(0, 1); // used cards are inserted into arry using unshift(), so index always 0 here
                        return([false, "You got a 'get out of jail free' card"]);
                    };
                    gameLogic.value.usedCommunityChest.splice(0, 1);
                    return(false, "You got a 'get out of jail free' card");
                    
                // BUG HERE ******************
                case 'goto': // 'jail'
                    // send player to jail, set jail variable true
                    let jailPosIndex = vueopoly.value.tiles.findIndex(each => each.id == 'gotojail');
                    let jailPosition = vueopoly.value.tiles[jailPosIndex].position;
                    crntPlayer.inJail = true;
                    return([true, jailPosIndex]);
            };
        default:
            console.log("special card not handled, see what card this is and make a case for .action")
            return([false, "special card not handled, see what card this is and make a case for .action"]);
    };
};

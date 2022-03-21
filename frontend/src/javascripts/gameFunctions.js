const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();

// Function returns an integer which represents the index position of a player in players array
exports.getCrntPlayer = () => {
    
    // gameLogic.whosTurn is the index postition in players array

    // for first turn of the game
    if(gameLogic.value.firstTurn){
        gameLogic.value.firstTurn = false;
        return(gameLogic.value.whosTurn)
    };

    // if have reached end of player array, return to index 0
    if(gameLogic.value.whosTurn == players.value.length - 1) {

        gameLogic.value.whosTurn = 0;

        // Check to see if player is in jail. If so, increase player position again
        if(players.value[gameLogic.value.whosTurn].inJail) {

            // Check if player is ready to come out of jail
            if(players.value[gameLogic.value.whosTurn].turnsInJail == 3) {

                players.value[gameLogic.value.whosTurn].turnsInJail = 0;
                players.value[gameLogic.value.whosTurn].inJail = false;
                return(gameLogic.value.whosTurn);
            };

            // If not ready to come out of jail, increase turnsInJail variable
            players.value[gameLogic.value.whosTurn].turnsInJail++;
            // increase player index position again, skipping player in jail
            gameLogic.value.whosTurn++;
            return(gameLogic.value.whosTurn);
        
        };
        return(gameLogic.value.whosTurn);
    };

    // increase index position
    gameLogic.value.whosTurn++;

    // Check to see if player is in jail. If so, increase player index position again
    if(players.value[gameLogic.value.whosTurn].inJail) {

        // Check if player is ready to come out of jail
        if(players.value[gameLogic.value.whosTurn].turnsInJail == 3) {
            players.value[gameLogic.value.whosTurn].turnsInJail = 0;
            players.value[gameLogic.value.whosTurn].inJail = false;
            return(gameLogic.value.whosTurn);
        };

        // if have reached end of player array, return to index 0
        if(gameLogic.value.whosTurn == players.value.length - 1) {

            // skip player in jail, so return index 1 instead of 0
            gameLogic.value.whosTurn = 1;
            return(gameLogic.value.whosTurn);
        };
        // if not increase player index position again, skipping player in jail
        gameLogic.value.whosTurn++;
        return(gameLogic.value.whosTurn)
     
     };

    return(gameLogic.value.whosTurn);
};


exports.moneyCheck = (priceToPay, playersMoney) => {

    
    if(priceToPay < playersMoney) {
        return true;
    };
    return false;
    // let cost = priceToPay[1];
    // let playerMoney = players.value[gameLogic.value.whosTurn];
    // if(cost > playerMoney) {return false};
    // return true;

};


// Function returns 2 random numbers (1-6)
exports.rollDice = () => {

    let dice = [];
    dice.push(Math.floor(Math.random() * 6 + 1));
    dice.push(Math.floor(Math.random() * 6 + 1));
      
    return(dice)
};


// Function adds rolled dice to player position and gets new postion information
exports.movePlayerPos = (moveCount, moveDirect) => {

    // TODO: modular math (wrap around gameboard)
    let propertyInfo = {};

    if(!moveDirect[0]) {
        // calculate player's new position
            players.value[gameLogic.value.whosTurn].position += moveCount;
    }
    else {
            players.value[gameLogic.value.whosTurn].position = moveDirect[1];
            console.log("shouldn't be here unless special card")
    };
    
    
    // get index of property landed on and add property to object
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];

    // add this to object as well. // I can remove this. I'm not using coords as originally planned
    // let propertyCoordIndex = vueopoly.value.tiles.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    // propertyInfo['coord'] = vueopoly.value.tiles[[propertyCoordIndex]];

    return(propertyInfo)
};


// Function is main funciton call after dice roll. Handles property landed on.
exports.dtrmPropertyAction = (propertyInfo, crntDiceRoll) => {

    // Function checks if chance or community chest cards are in deck. If not re-asign
    let checkForEmptyDeck = (cardType) => {

        switch(cardType) {
            
            case 'chance':
                // if deck is empty. re-asign deck and empty gameLogic.usedChance
                if(vueopoly.value.chance.length < 1) {
                    gameLogic.value.chance = this.vueopoly.value.chance;
                    gameLogic.value.usedChance = [];
                    break;
                };
                break;

            case 'communitychest':
                if(vueopoly.value.communitychest.length < 1) {
                    gameLogic.value.communitychest = this.vueopoly.value.chance;
                    gameLogic.value.usedCommunityChest = [];
                    break;
                };
                break;
            
            default:
                console.log("unhandled error dtrmPropertyAction.checkForEmptyDeck() gameFunctions.js")
            
        };
            
    };


    // TODO: jail/just visiting
    let handleSpecialProperty = () => {
        let returnData = [];
        switch(propertyInfo.info.id.toLowerCase()) {

            // returns index of random chance card
            case 'chance':
                checkForEmptyDeck('chance');
                returnData.push('chance');
                returnData.push(Math.floor(Math.random() * 14));

                // handleSpecialCards(returnData)
                return(returnData);
            
            case 'communitychest':
                checkForEmptyDeck('communitychest');
                returnData.push('communitychest');
                returnData.push(Math.floor(Math.random() * 15));
                return(returnData);

            case 'freeparking':
                returnData.push('freeparking');
                returnData.push(gameLogic.value.freeParking);
                return(returnData);

            case 'incometax':
                returnData.push('incometax');
                if(players.value[0].money * .10 > 200) {
                    returnData.push(200)
                }
                else {
                    returnData.push(players.value[0].money * .10)
                };
                return(returnData);

            case 'luxerytax':
                returnData.push('luxurytax');
                returnData.push(75);
                return(returnData);
            // case 'gotojail':
        };
    };
    
    // Function
    let getTotalRentAmount = () => {
        
        switch(propertyInfo.info.group.toLowerCase()) {

            // BUG !!! returning wrong amount. if only 1 owned, returning 4 owned
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
                console.log(railRoadsOwned)
                console.log("rr's owned")
                // return different rent amounts for amount of railroads owned
                switch(totalRrOwned) {

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
                        // check if both utilities are owned
                        // get index of waterworks and check ownedby 
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
                returnData.push(getTotalRentAmount())
                // returnData.push(propertyInfo.info.price);
                return(returnData);
        }
        
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




exports.handleSpecialCard = (cardTitle) => {
    // do the dirty here
    cardTitle = cardTitle.toLowerCase();

    // determine which special card to take action on
    let cardDrawn;
    if(cardTitle.toLowerCase() == 'chance') {cardDrawn = gameLogic.value.usedChance[0].action;}
    else {cardDrawn = gameLogic.value.usedCommunityChest[0].action;};
    
    

    switch(cardDrawn.action) { // card that was drawn. // used cards are inserted into arry using unshift(), so index always 0 here

        case 'addfunds':
            players.value[gameLogic.value.whosTurn].money += gameLogic.value.usedChance[0].amount;

        case 'removefunds':
            // If enough money to pay
            if(this.moneyCheck(cardDrawn.amount, players.value[gameLogic.value.whosTurn].money)) {
                players.value[gameLogic.value.whosTurn].money -= gameLogic.value.usedChance[0].amount;
                break;
            }
            // If not enough money to pay
            else {
                // TODO: send not enough money message (possible write a function to handle if moneyCheck() returns false)
            };
        case 'move':
            // this.movePlayerPos([true, ])
            switch(cardDrawn.tileid) {

                case 'go':
                case 'illinoiseave':
                case 'boardwalk':
                    let propertyPosIndex = vueopoly.value.tiles.findIndex((item.id == gameLogic.value.usedChance[0].tileid));
                    let propertyPos = vueopoly.value.tiles[propertyPosIndex].position;
                    this.movePlayPos([true, propertyPos]) 
                    break;
                
                // go back 3 spaces
                default:
                    // shouldn't have to do modular math, as position is -3 and chance is more than 3 ahead of GO
                    // player position - 3
                    this.movePlayPos([true, players.value[gamelogic.value.whosTurn].position - gameLogic.value.usedChance[0].count]);
                    break;
            };
        
        case 'movenearest':
            // TODO: determine nearest utility and railroad (I think player piece should only move forward)
            switch(cardDrawn.groupid) {

                case 'utility':

                case 'railroad':
            }
        case 'jail':

            switch(cardDrawn.subaction) {
                case 'getout':
                    // add 'get out of jail free' card to players special card array
                    this.players[this.gameLogic.whosTurn].specialCards.push(this.gameLogic.usedChance[0]);
                    // remove 'get out of jail free' card from used cards array
                    this.gameLogic.usedChance.splice(0, 1); // used cards are inserted into arry using unshift(), so index always 0 here
                    break;
                case 'jail':
                    // get jail 
                    let jailPosIndex = vueopoly.value.tiles.findIndex((item.id == cardData[1]));
                    let jailPosition = vueopoly.value.tileid[jailPosIndex].position;
                    players.value[gameLogic.value.whosTurn].inJail = true;
                    this.movePlayerPos[true, jailPosition];
            };
    };
};

 
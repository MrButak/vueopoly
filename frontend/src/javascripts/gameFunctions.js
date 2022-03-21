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
        console.log("money check true")
        return true;
    };
    console.log("money check true")
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
exports.movePlayerPos = (moveCount) => {

    // TODO: modular math (wrap around gameboard)
    let propertyInfo = {};

    
    players.value[gameLogic.value.whosTurn].position += moveCount;
    
    
    // get index of property landed on and add property to object
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];
    console.log("property info", vueopoly.value.properties[propertyInfoIndex])
    
    

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

            case 'jail':
                returnData.push('jail');
                return(returnData);

            default:
                console.log("unhandled")
            // case 'gotojail':
        };
    };
    
    // Function
    // let getTotalRentAmount = () => {
        
    //     switch(propertyInfo.info.group.toLowerCase()) {

            
    //         case 'railroad':
    //             let railRoadsOwned = 0;
    //             // create array of all railroads
    //             let totalRrs = vueopoly.value.properties.filter(property => property.group.toLowerCase() == 'railroad');
    //             console.log(totalRrs);
    //             // see how many railroads are owned
    //             totalRrs.forEach((rr) => {
    //                 if(rr.ownedby == propertyInfo.info.ownedby) {
    //                     railRoadsOwned++;
                        
    //                 };
    //             });
                
    //             // return different rent amounts for amount of railroads owned
    //             switch(railRoadsOwned) {

    //                 case 1: {
    //                     return(25);   
    //                 }
    //                 case 2: {
    //                     return(50);
    //                 }
    //                 case 3: {
    //                     return(100);
    //                 }
    //                 case 4: {
    //                     return(200);
    //                 }
    //             };
    
            
    //         case 'utilities':

    //             switch(propertyInfo.info.id.toLowerCase()) {

    //                 case 'electriccompany':
    //                     // check if both utilities are owned
    //                     // get index of waterworks and check ownedby 
    //                     let waterWorksIndex = vueopoly.value.properties.findIndex(item => item.id == 'waterworks');
    //                     // if owner owns both utilities
    //                     if(vueopoly.value.properties[waterWorksIndex].ownedby == propertyInfo.info.ownedby) {
    //                         return((crntDiceRoll[0] + crntDiceRoll[1]) * 10)
    //                     };
    //                     // if only this utility owned
    //                     return((crntDiceRoll[0] + crntDiceRoll[1]) * 4)
                        

    //                 case 'waterworks':
    //                     // check if both utilities are owned
    //                     // get index of waterworks and check ownedby 
    //                     let electricCompanyIndex = vueopoly.value.properties.findIndex(item => item.id == 'electriccompany');
    //                     // if owner owns both utilities
    //                     if(vueopoly.value.properties[electricCompanyIndex].ownedby == propertyInfo.info.ownedby) {
    //                         return((crntDiceRoll[0] + crntDiceRoll[1]) * 10)
    //                     };
    //                     // if only this utility owned
    //                     return((crntDiceRoll[0] + crntDiceRoll[1]) * 4);
    //             };
    //             return;

    //         default:
    //             // no buildings
    //             if(propertyInfo.info.buildings > 0) {
    //                 return(propertyInfo.info.rent)
    //             };
    //             // with buildings
    //             return(propertyInfo.info.multpliedrent[propertyInfo.info.buildings])
    //     };
    // };

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

exports.getTotalRentAmount = (propertyInfo) => {

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
}

// TODO special cards are also being removed form vueopoly.value.chance/communitychest
exports.handleSpecialCard = (cardTitle) => {


    let checkPropOwned = (propertyId) => {

        console.log("checkPropOwned()", propertyId)
        let propertyInfo = []; // [is purchasable?, pay rent?]
        let propertyIndex = vueopoly.value.properties.findIndex((item => item.id == propertyId));

        switch(propertyId.toLowerCase()) {
            case 'go':
                propertyInfo = [false];
                return propertyInfo;
            default:
                // propertyIndex = vueopoly.value.properties.findIndex((item => item.id == propertyId));
                if(vueopoly.value.properties[propertyIndex].ownedby == -1) {
                    propertyInfo = [true, false]
                    return propertyInfo;
                };
                
                propertyInfo = [false, true, this.getTotalRentAmount(vueopoly.value.properties[propertyIndex])];
                return(propertyInfo);
        };

    };

    // do the dirty here
    cardTitle = cardTitle.toLowerCase();

    // determine which special card to take action on
    let cardDrawn;
    if(cardTitle.toLowerCase() == 'chance') {cardDrawn = gameLogic.value.usedChance;}
    else {cardDrawn = gameLogic.value.usedCommunityChest;};
    
    
    console.log(cardDrawn)
    console.log("is this the issue? cardDrawn?")
    switch(cardDrawn[0].action) { // card that was drawn. // used cards are inserted into arry using unshift(), so index always 0 here

        case 'addfunds':
           
            players.value[gameLogic.value.whosTurn].money += cardDrawn[0].amount;
            
            return([false, "logs for receive payment on special card"]);

        case 'removefunds':
            // If enough money to pay
            if(this.moneyCheck(cardDrawn[0].amount, players.value[gameLogic.value.whosTurn].money)) {
                
                players.value[gameLogic.value.whosTurn].money -= cardDrawn[0].amount;
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
            // movePlayerPos(null, [true, position])
            // return([directMove, position, maybe something for logs])
            // [true, 4]
            switch(cardDrawn[0].tileid) {

                case 'go':
                case 'illinoiseave':
                case 'boardwalk':
                case 'stcharlesplace':
                case 'readingrailroad':

                    let propertyPosIndex = vueopoly.value.tiles.findIndex((each => each.id == cardDrawn[0].tileid));
                  
                    players.value[gameLogic.value.whosTurn].position = propertyPosIndex;
                    // checkPropOwned // [is purchasable?, pay rent?]
                    return([true, propertyPosIndex, checkPropOwned(cardDrawn[0].tileid)]);
                    
                
                // go back 3 spaces
                default:
                    // shouldn't have to do modular math, as position is -3 and chance is more than 3 ahead of GO
                    // player position - 3
                    // this.movePlayerPos(null, [true, players.value[gameLogic.value.whosTurn].position - cardDrawn[0].count]);
                    players.value[gameLogic.value.whosTurn].position -= 3;
    
                    return([true, players.value[gameLogic.value.whosTurn].position, checkPropOwned(cardDrawn[0].tileid)]);
                    
            };
        
        case 'movenearest':
            // TODO: determine nearest utility and railroad (I think player piece should only move forward)
            switch(cardDrawn[0].groupid) {

                case 'utility':
                    console.log("nearest utility not available");
                    return([false, "logs for nearest utility"]);
                case 'railroad':
                    console.log("nearest railroad not available");
                    return([false, "logs for nearest railroad"]);
            }

        case 'jail':

            switch(cardDrawn[0].subaction) {
                case 'getout':
                    // add 'get out of jail free' card to players special card array
                    players.value[gameLogic.value.whosTurn].specialCards.push(cardDrawn[0]);

                    // remove 'get out of jail free' card from used cards array
                    if(cardTitle.toLowerCase() == 'chance') {
                        gameLogic.value.usedChance.splice(0, 1); // used cards are inserted into arry using unshift(), so index always 0 here
                        return([false, "You got a 'get out of jail free' card"]);
                    };
                    gameLogic.value.usedCommunityChest.splice(0, 1);
                    return(false, "You got a 'get out of jail free' card");
                    
                
                case 'goto': // 'jail'
                    // send player to jail, set jail variable true
                    let jailPosIndex = vueopoly.value.tiles.findIndex(each => each.id == cardDrawn[0]);
                    let jailPosition = vueopoly.value.tiles[jailPosIndex].position;
                    players.value[gameLogic.value.whosTurn].inJail = true;
                    // function call [true] tells function this is a direct move to [jailPosition]
                    // this.movePlayerPos(null, [true, jailPosition]);
                    return([true, jailPosIndex]);
            };
        default:
            console.log("special card not handled, see what card this is and make a case for .action")
            return([false, "special card not handled, see what card this is and make a case for .action"]);
    };
};

 
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
        return(gameLogic.value.whosTurn);
    };
    // increase index position
    gameLogic.value.whosTurn++;
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
exports.playerPosInfo = (moveCount) => {

    // TODO: modular math (wrap around gameboard)
    let propertyInfo = {};

    // calculate player's new position
    players.value[gameLogic.value.whosTurn].position += moveCount;
    
    // get index of landed on property and add property to object
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];

    // add this to object as well. // I can remove this. I'm not using coords as originally planned
    let propertyCoordIndex = vueopoly.value.tiles.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['coord'] = vueopoly.value.tiles[[propertyCoordIndex]];

    return(propertyInfo)
};

// Function is main funciton call that handles property which player lands on
exports.dtrmPropertyAction = (propertyInfo, crntDiceRoll) => {

    // TODO: jail/just visiting
    let handleSpecialProperty = () => {
        let returnData = [];
        switch(propertyInfo.info.id.toLowerCase()) {

            // returns index of random chance card
            case 'chance':
                returnData.push('chance');
                returnData.push(Math.floor(Math.random() * 14));
                return(returnData);
            // returns index of random community chest card
            case 'communitychest':
                returnData.push('communitychest')
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

    let getTotalRentAmount = () => {

        switch(propertyInfo.info.group.toLowerCase()) {

            case 'railroad':
                let railRoadsOwned = 0;
                // create array of all railroads
                let totalRrOwned = vueopoly.value.properties.filter(property => property.group.toLowerCase() == 'railroad');
                console.log(totalRrOwned);
                // see how many railroads are owned
                totalRrOwned.forEach((rr) => {
                    if(rr.ownedby == propertyInfo.info.ownedby) {
                        railRoadsOwned++;
                        return;
                    };
                });
                // return different amounts for amount of railroads ownded
                switch(totalRrOwned.length) {

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

            default:
                // no buildings
                if(propertyInfo.info.buildings > 0) {
                    return(propertyInfo.info.rent)
                };
                // with buildings
                return(propertyInfo.info.multpliedrent[propertyInfo.info.buildings])
        };
    };


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
                returnData.push(getTotalRentAmount)
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



exports.handleChanceCard = () => {

};

exports.handleCommunityChest = () => {

};

exports.actionMessage = () => {

    return("test")
};
 
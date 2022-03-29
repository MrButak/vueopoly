const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();


exports.passGo = () => {

    let crntPlayer = players.value[gameLogic.value.whosTurn];
    crntPlayer.money += 200;
    return;
};

// Function returns an integer which represents the index position of a player in players array
exports.getCrntPlayer = () => {
    
    // * gameLogic.whosTurn is the index postition in players array

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

    let crntPlayer = players.value[gameLogic.value.whosTurn]
    
    let propertyInfo = {};

    // wrap piece around gameboard
    if(crntPlayer.position + moveCount > 39) {
        // pass go
        this.passGo();
        let newPos = moveCount - (39 - crntPlayer.position + 1);
        crntPlayer.position = newPos;
    }
    else {
        crntPlayer.position += moveCount;
    };
    
    
    // get index of property landed on and add property to object
    let propertyInfoIndex = vueopoly.value.properties.findIndex(each => each.position == players.value[gameLogic.value.whosTurn].position);
    propertyInfo['info'] = vueopoly.value.properties[propertyInfoIndex];

    // console.log(vueopoly.value.properties[propertyInfoIndex]);
    // console.log("property info movePlayerPos() ^^^^^^")
    
  
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
            
            case 'jail': // just visiting
                returnData.push('jail');
                return(returnData);

            case 'gotojail':
                returnData.push('gotojail');
                console.log("TODO: handle when land on goto jail");
                return(returnData);

            case 'go':
                this.passGo();
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

    let propertyMovedTo = () => {

        propertyIndex = vueopoly.value.properties.findIndex((each => each.position == crntPlayer.position));
        return(vueopoly.value.properties[propertyIndex]);

    };
    cardTitle = cardTitle.toLowerCase();

    let specialAction = {

        movePlayer: {
            willMove: false,
            position: 0,
            id: "",
            canOwn: false,
            owned: false,
            backThreeSpaces: false,
            log: "optional string for game logs",
            moveNearest: false,
            willPassGo: false
        },
        addFunds: {

            willAddFunds: false,
            amount: 0,
            log: "optional string for game logs"
        },
        removeFunds: {
            willRemoveFunds: false,
            amount: 0,
            log: "optional string for game logs"
        },
        jail: {
            handleJail: false,
            willGo: false,
            getOut: false
        }
    };
    
    

    // Function handles special card "move" action. Checks property moved to, to see if buyable or must pay rent
    // let checkPropOwned = (property) => {

    //     if(property.ownedby == -1) {
    //         specialAction.movePlayer.canOwn = true;
    //         specialAction.movePlayer.owned = false;
    //         return false;
    //     };
    //     specialAction.movePlayer.canOwn = true;
    //     specialAction.movePlayer.owned = true;
    //     return true;

    // };

    

    // determine which special card to take action on
    let cardDrawn;
    if(cardTitle.toLowerCase() == 'chance') {cardDrawn = gameLogic.value.usedChance;}
    else {cardDrawn = gameLogic.value.usedCommunityChest;};
    

    switch(cardDrawn[0].action) { // card that was drawn. // used cards are inserted into arry using unshift(), so index always 0 here

        case 'addfunds':
           
            crntPlayer.money += cardDrawn[0].amount;
            return(specialAction);

        case 'removefunds':
            // If enough money to pay
            if(this.moneyCheck(cardDrawn[0].amount, crntPlayer.money)) {
                crntPlayer.money -= cardDrawn[0].amount;
                return(specialAction);
            };

            // TODO
            console.log("not enough money to pay");
            return(specialAction);
             

        case 'addfundsfromplayers':
            crntPlayer.money += players.value.length * cardDrawn[0].amount;
            // TODO send logs
            return(specialAction);
            
        case 'removefundstoplayers':
            console.log("not handled this special card yet");
            return(specialAction);

        case 'propertycharges':
            let houseCosts = crntPlayer.buindingCount.houses * cardDrawn.buildings;
            let hotelCosts = crntPlayer.buindingCount.hotels * cardDrawn.hotels;
            let totalCostToPay = houseCosts + hotelCosts;
            if(this.moneyCheck(totalCostToPay, crntPlayer.money)) {
                crntPlayer.money -= totalCostToPay;
                return(specialAction);
            };
            // TODO
            console.log("not enough money to pay");
            return(specialAction);

            

        case 'move':
            let propIndex;
            let prop;
            specialAction.movePlayer.willMove = true;
            let propertyObj;
            switch(cardDrawn[0].tileid) {

                case 'go':
                    crntPlayer.position = 0;
                    specialAction.movePlayer.position = 0;
                    specialAction.movePlayer.canOwn = false;
                    specialAction.movePlayer.id = 'go';
                    return(specialAction);

                case 'illinoiseave':
                case 'boardwalk':
                case 'stcharlesplace':
                case 'readingrailroad':

                    propIndex = vueopoly.value.properties.findIndex((each => each.id == cardDrawn[0].tileid));
                    prop = vueopoly.value.properties[propIndex];
                    crntPlayer.position = prop.position;
                    specialAction.movePlayer.position = prop.position;
                    console.log(crntPlayer.position, "should be property specified on card")
                    // specialAction.movePlayer.owned = checkPropOwned(prop); // no need. this is done in PlayerDashboade.vue dtrmProperty...()
                    specialAction.movePlayer.id = prop.id;
                    return(specialAction);
                    
                // go back 3 spaces
                default:
                    crntPlayer.position -= 3;
                    propertyObj = propertyMovedTo();
                    specialAction.movePlayer.position = crntPlayer.position;
                    specialAction.movePlayer.backThreeSpaces = true;
                    specialAction.movePlayer.id = propertyObj.id;
                    return(specialAction);   
            };
        
        case 'movenearest':
            
            specialAction.movePlayer.willMove = true;
            specialAction.movePlayer.moveNearest = true;

            switch(cardDrawn[0].groupid) {

                case 'utility':
                    // utility pos 12, 28

                    if(crntPlayer.position > 28) {
                        crntPlayer.position = 12; // TODO: handle pass go
                        specialAction.movePlayer.willP = true;
                        specialAction.movePlayer.position = 12;
                        propertyObj = propertyMovedTo();
                        specialAction.movePlayer.id = propertyObj.id;
                        return(specialAction);
                    };
                    
                    crntPlayer.position = 28;
                    specialAction.movePlayer.position = 28;
                    propertyObj = propertyMovedTo();
                    specialAction.movePlayer.id = propertyObj.id;
                    return(specialAction);

                // rr pos 5,15,25,35
                case 'railroad':

                    if(crntPlayer.position > 35) {
                        crntPlayer.position = 5; // TODO: handle pass go
                        specialAction.movePlayer.position = 5;
                        propertyObj = propertyMovedTo();
                        specialAction.movePlayer.id = propertyObj.id;
                        return(specialAction);
                    }
                    else if(crntPlayer.position > 5 && crntPlayer.position < 15) {
                        crntPlayer.position = 15;
                        specialAction.movePlayer.position = 15;
                        propertyObj = propertyMovedTo();
                        specialAction.movePlayer.id = propertyObj.id;
                        return(specialAction);
                    }
                    else if(crntPlayer.position > 15 && crntPlayer.position < 25) {
                        crntPlayer.position = 25;
                        specialAction.movePlayer.position = 25;
                        propertyObj = propertyMovedTo();
                        specialAction.movePlayer.id = propertyObj.id;
                        return(specialAction);
                    }
                    else if(crntPlayer.position > 25 && crntPlayer.position < 35) {
                        crntPlayer.position = 35;
                        specialAction.movePlayer.position = 35;
                        propertyObj = propertyMovedTo();
                        specialAction.movePlayer.id = propertyObj.id;
                        return(specialAction);
                    }
                    else {
                        console.log("unhandled situation @ move to nearest in gameFunction.js handleSpecialCard()");
                    };
            };
            // jail: {
            //     handleJail: false,
            //     willGo: false,
            //     getOut: false
            // }
        case 'jail':

            specialAction.jail.handleJail = true;

            switch(cardDrawn[0].subaction) {

                case 'getout':

                    specialAction.jail.getOut = true;
                    // add 'get out of jail free' card to players special card array
                    crntPlayer.specialCards.push(cardDrawn[0]);
                    // remove 'get out of jail free' card from used cards array
                    if(cardTitle.toLowerCase() == 'chance') {
                        gameLogic.value.usedChance.splice(0, 1); // used cards are inserted into arry using unshift(), so index always 0 here
                        return(specialAction);
                    };

                    gameLogic.value.usedCommunityChest.splice(0, 1);
                    return(specialAction);
                    
                case 'goto':

                specialAction.jail.willGo = true;
                    
                    crntPlayer.inJail = true;
                    return(specialAction);
            };

        default:
            console.log("special card not handled, see what card this is and make a case for .action")
            return(specialAction);
    };
};

// Handle buy buildings

// Fuction checks if player owns the whole group of properties (is eligible to build)
exports.canBuyBuilding = (property) => {

    let crntPlayer = players.value[gameLogic.value.whosTurn];
    
    let checkIfGroupOwned = () => {

        let allPropsInGroup = vueopoly.value.properties.filter(prop => prop.group.toLowerCase() == property.group.toLowerCase());
        for(let i = 0; i < allPropsInGroup.length; i++) {
            if(allPropsInGroup[i].ownedby != crntPlayer.name || allPropsInGroup.mortgaged) {return false};

        };
        return true;
    };

    switch(property.group.toLowerCase()) {

        case 'railroad':
        case 'utilities':
            return false;
        default:
            
            return(checkIfGroupOwned());

    }
};

exports.handleBuyBuilding = (property) => {

    

};
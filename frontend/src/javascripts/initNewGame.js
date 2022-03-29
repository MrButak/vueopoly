const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players } = vueGlobalState();

class Player {

    constructor(name, alias, symbol, position, properties, money, inJail, isTurn, specialCards, turnsInJail, buildingCount) {
        this.name = name
        this.alias = alias
        this.symbol = symbol
        this.position = position
        this.properties = properties
        this.money = money
        this.inJail = inJail
        this.isTurn = isTurn
        this.specialCards = specialCards
        this.turnsInJail = turnsInJail
        this.buildingCount = buildingCount
    };
};

// Function handles new game
exports.initNewGame = (newPlayers) => {
    
    // create new players
    let playersArr = [];
    let tmpCnt = 0;
    Object.keys(newPlayers).forEach((player) => {
        playersArr[tmpCnt] = player;
        playersArr[tmpCnt] = new Player(player, newPlayers[player].alias, newPlayers[player].symbol, 0, [], 1500, false, false, [], 0, {houses: 0, hotels: 0});
        tmpCnt++;
    });

    // TODO special cards are also being removed form vueopoly.value.chance/communitychest
    let gameJson = require('../../vueopoly.json');
    // let gameJson = require('../../debug.json');
    let communityChestCards = gameJson.communitychest;
    let chanceCards = gameJson.chance;

    // object to handle some game logic. assigned to global state and local storage
    let gameLogic = {
        
        'startGame': true,
        'firstTurn': true,
        'playerCount': tmpCnt,
        'whosTurn': 0, // index in players array
        'gameLog': [{log: 'New game created.', style: 'game'}], // first game log!
        'chance': chanceCards,
        'usedChance': [],
        'communitychest': communityChestCards,
        'usedCommunityChest': [],
        'freeParking': 0
    };
    
    
    // set local storage
    localStorage.setItem('vueopoly', JSON.stringify(gameJson));
    localStorage.setItem('players', JSON.stringify(playersArr));
    localStorage.setItem('gamelogic', JSON.stringify(gameLogic));
    
    // return objs to set as global state
    return{playersArr, gameJson, gameLogic};
};


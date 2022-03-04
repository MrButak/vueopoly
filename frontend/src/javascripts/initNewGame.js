const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players } = vueGlobalState();

class Player {

    constructor(name, alias, symbol, postion, properties, money, inJail, isTurn) {
        this.name = name
        this.alias = alias
        this.symbol = symbol
        this.postion = postion
        this.properties = properties
        this.money = money
        this.inJail = inJail
        this.isTurn = isTurn
    };

    payRent = (price, player, proptery) => {
        if(this.money - price < 1) {
            return false;
        };
        
        player.money += value;
        this.money -= value;
        // game log: `${this.name} payed ${player} ${value} for rent at ${property}`
        return true;
    };

    buyProperty = (property, cost) => {
        if(this.money - cost < 1) {
            return false;
        };

        if(player === "bank") {
            this.money -= value;
            this.properties.push(property);
            return true;
            // game log: `${this.name} purchased ${property} from The Bank for ${value}`
        };
    };
};

exports.initNewGame = (newPlayers) => {
    

    // create new players
    let players = [];
    let tmpCnt = 0;
    Object.keys(newPlayers).forEach((player) => {
        players[tmpCnt] = player;
        players[tmpCnt] = new Player(player, newPlayers[player].alias, newPlayers[player].symbol, 0, {}, 500, false, false);
        tmpCnt++;
    });

    // console.log(players)
    
    // set global state
    let gameJson = require('../../vueopoly.json');
    vueopoly.value = gameJson;
    players.value = players;

    // set local storage
    localStorage.setItem('vueopoly', JSON.parse(gameJson));
    localStorage.setItem('players', JSON.parse(players));
    
};

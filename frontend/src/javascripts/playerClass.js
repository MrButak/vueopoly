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
    }

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
    }
}




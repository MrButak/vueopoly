<template>

<div class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        
        <div class="playerName">
            {{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}
        </div>

        <div class="manage-trade-btn-wrapper">
            <button>Manage</button>
            <text>${{ this.crntPlayerLogic.crntPlayerMoney }}</text>
            <button>Trade</button>
        </div>

        <div class="roll-dice-end-turn-btn-wrapper">
            <!-- different messages and options shown depending on local component variables (data()) -->
            <button v-show="!this.diceRolled" @click="this.rollDice">Roll Dice</button>
            <button v-show="this.diceRolled" @click="this.endTurn">End Turn</button>
            <button v-show="this.buyAvailable" @click="this.buyProperty">Buy</button>
            <text v-show="this.buyAvailable"><a @click="this.showProperty()">{{ this.viewPropertyLink }}</a> is available to buy</text>
            <text v-show="this.willPayRent">You payed rent at <a @click="this.showProperty()">{{ this.viewPropertyLink }}</a></text>

        </div>

        <!-- shows the game log TODO: make it prettier (player colors) and auto scroll to bottom -->
        <div class="log-and-dice-wrapper">
            <div class="gamelog-wrapper-main">
                <text v-for="log in this.gameLogic.gameLog">
                    {{ log }}
                </text>
            </div>
            <div class="show-dice-wrapper-main">
                {{ this.crntTurnLogic.crntDiceRoll[0] }} , {{ this.crntTurnLogic.crntDiceRoll[1] }}
            </div>
        </div>

    </div>
</div>


<SpecialCards ref="specialCards" />


</template>

<script>

const handleLs = require('../../../src/javascripts/handleLs');
const gameFunctions = require('../../../src/javascripts/gameFunctions');
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';
import { ref } from 'vue';
import SpecialCards from './SpecialCards.vue';

export default defineComponent({

    name: 'PlayerDashboard',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        const gameBoard = ref(require('../gameBoard/GameBoard.vue')); // component
        const playerPieces = ref(require('../playerDashboard/PlayerPieces.vue')); // component

        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic,
            gameBoard,
            playerPieces
        }
    },

    components: {
    SpecialCards
},

    data() {

        return {
            // TODO crntPlayerColor: "" // then have logs and other things in that color
            buyAvailable: false,
            willPayRent: false,
            diceRolled: false,
            showSpecialCard: false,

            crntTurnLogic: {
                propertyLandedOn: {},
                crntDiceRoll: [],
            },

            // dom stuff
            viewPropertyLink: "",
            crntPlayerLogic: {

                crntPlayerName: "",
                crntPlayerAlias: "",
                crntPlayerMoney: 0,
                crntPlayerProperties: [],

            },
            // player pieces (PlayerPieces.vew). elements in (Gameboard.vue)
            // used to remove player piece when moving to new position. These elements are inserted into the dom from PlayerPieces.vue, and are inserted into GameBoard.vue's html
            playerElements: {
                p1DomEl: document.querySelector('[data-player="player1"]'),
                p2DomEl: document.querySelector('[data-player="player2"]'),
                p3DomEl: document.querySelector('[data-player="player3"]'),
                p4DomEl: document.querySelector('[data-player="player4"]'),
                p5DomEl: document.querySelector('[data-player="player5"]'),
                p6DomEl: document.querySelector('[data-player="player6"]'),
                p7DomEl: document.querySelector('[data-player="player7"]'),
                p8DomEl: document.querySelector('[data-player="player8"]')

            }
            
        }
    },

    mounted() {
        
        this.mainGameLoop()
    },

    methods: {

        // Function is called @click to view current property player landed on
        showProperty() {

            // function call to components/gameBoard/GameBoard.vue to preform .click() on current property using property id as argument. (added to this.propertyLink variable in dom)
            this.gameBoard.default.methods.showProperty(event, this.crntTurnLogic.propertyLandedOn.info.id)
        },

        mainGameLoop() {

            // Function call
            this.startTurn(this.players[gameFunctions.getCrntPlayer()]);

            // this.buyAvailable = false
        },

        startTurn(crntPlayer) {
            
            // game log
            this.gameLogic.gameLog.push(`${crntPlayer.name}'s turn.`)
            
            // set dom variables
            this.crntPlayerLogic.crntPlayerName = crntPlayer.name;
            this.crntPlayerLogic.crntPlayerAlias = crntPlayer.alias;
            this.crntPlayerLogic.crntPlayerMoney = crntPlayer.money;
        },

        endTurn() {

            // clear local component variables
            this.buyAvailable = false;
            this.willPayRent = false;
            this.diceRolled = false;
            this.crntPlayerLogic.crntPlayerName = "";
            this.crntPlayerLogic.crntPlayerAlias = "";
            this.crntPlayerLogic.crntPlayerMoney = 0;
            this.crntPlayerLogic.crntPlayerProperties = [];

            this.viewPropertyLink = "",
            this.crntTurnLogic.propertyLandedOn = {};
            this.crntTurnLogic.crntDiceRoll = [];

            // save to local storage
            handleLs.saveToLs();

            this.mainGameLoop();
        },

        rollDice() {

            this.diceRolled = true; // hide roll dice btn

            // Function call (local component variable)
            this.crntTurnLogic.crntDiceRoll = gameFunctions.rollDice();
            // Function call (local component variable)
            this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1], [false]); // 2nd argument 'false' is used for a direct move from a special card

            // game log (global state variable)
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            this.gameLogic.gameLog.push(`${crntPlayer.name} rolled for ${this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]} and landed on ${this.crntTurnLogic.propertyLandedOn.info.name}.`)

            // remove player piece before moving to new position
            let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
            crntPlayerPiece.remove()
            // Function call to move physical (dom) player piece
            this.playerPieces.default.methods.movePlayerPiece(this.crntTurnLogic.propertyLandedOn, this.players[this.gameLogic.whosTurn]);

            
            this.dtrmPropertyAction()
        },

        // Function handles square player lands on
        dtrmPropertyAction() {

            // function call    determines what type of square player lands on, what action to take, then returns and array [case, logic to preform the action]
            let propertyAction = gameFunctions.dtrmPropertyAction(this.crntTurnLogic.propertyLandedOn, this.crntTurnLogic.crntDiceRoll);
            
            switch(propertyAction[0]) {

                case 'chance': // [case, random card number from this.vueopoly.chance[]]
                    // this.handleChanceCard(propertyAction[1])
                    this.handleSpecialCard(propertyAction);
                    break;
                case 'communitychest':
                    // this.handleCommunityChest(propertyAction[1])
                    this.handleSpecialCard(propertyAction);
                    break;
                case 'freeparking':
                    // gameFunctions.handleFreeParking()
                    console.log("freeparking not yet available");
                    break;
                case 'incometax':

                    if(gameFunctions.moneyCheck(propertyAction[1], this.players[this.gameLogic.whosTurn])) { // propertyAction[1] amount of money to pay
                        this.players[this.gameLogic.whosTurn].money -= propertyAction[1];
                        break;
                    }
                    else {
                        // TODO: not enough money to pay
                    };
                   
                case 'luxerytax':
                    if(gameFunctions.moneyCheck(propertyAction[1], this.players[this.gameLogic.whosTurn])) { // propertyAction[1] amount of money to pay
                        this.players[this.gameLogic.whosTurn].money -= propertyAction[1];
                        break;
                    }
                    else {
                        // TODO: not enough money to pay
                        break;
                    };

                // buyable property
                case 'notowned':
                    this.buyAvailable = true; // shows buy btn in dom
                    this.viewPropertyLink = this.crntTurnLogic.propertyLandedOn.info.name; // shows property name in dom
                    break;

                // owned property
                case 'owned':
                    this.willPayRent = true;
                    this.viewPropertyLink = this.crntTurnLogic.propertyLandedOn.info.name; // shows property name in dom
                    this.payRent(propertyAction[1]); //propertyAction[1] is price
                    break;
            };
            
        },

        
        handleSpecialCard(cardData) {

            let crntSpecialCard;

            switch(cardData[0]) {

                case 'chance':

                    // index of random card (cardData[1])
                    crntSpecialCard = this.gameLogic.chance[cardData[1]];

                    // send card info to display 
                    this.$refs.specialCards.setViewData(cardData, crntSpecialCard);
                    // add to used card deck (index 0)
                    this.gameLogic.usedChance.unshift(this.gameLogic.chance[cardData[1]]);
                    // remove from original deck
                    this.gameLogic.chance.splice(cardData[1], 1);
                    
                    // game log
                    this.gameLogic.gameLog.push(crntSpecialCard.title)

                    // Function call to handle all special card actions
                    gameFunctions.handleSpecialCard(cardData[0], this.gameLogic.usedChance[0]);
                    break;
                    

                case 'communitychest':

                    // index of random card (cardData[1])
                    crntSpecialCard = this.gameLogic.communitychest[cardData[1]];
                    this.$refs.specialCards.setViewData(cardData, crntSpecialCard);
                    // add to used card deck. 0 index
                    this.gameLogic.usedCommunityChest.unshift(this.gameLogic.communitychest[cardData[1]]);
                    // remove from original deck
                    this.gameLogic.communitychest.splice(cardData[1], 1);

                    // game log
                    this.gameLogic.gameLog.push(crntSpecialCard.title);

                    // Function call to handle all special card actions
                    gameFunctions.handleSpecialCard(cardData[0], this.gameLogic.usedCommunityChest[0]);
                    break;

            };

            
        },


        buyProperty() {
            

            // TODO: reuse some variables below

            // function call
            if(gameFunctions.moneyCheck(this.crntTurnLogic.propertyLandedOn.info.price ,this.players[this.gameLogic.whosTurn].money)) {

                // deduct the cost of the property from the player (and from the dom money variable)
                this.players[this.gameLogic.whosTurn].money -= this.crntTurnLogic.propertyLandedOn.info.price;
                this.crntPlayerLogic.crntPlayerMoney -= this.crntTurnLogic.propertyLandedOn.info.price;

                // add purchased property to players[].properties[]
                this.players[this.gameLogic.whosTurn].properties.push(this.crntTurnLogic.propertyLandedOn.info);

                // change the owner in vueopoly.properties[].ownedby // possibly here players references vueopoly
                let currentPlayer = this.players[this.gameLogic.whosTurn]
                let propertyIndex = this.vueopoly.properties.findIndex(each => each.id == this.crntTurnLogic.propertyLandedOn.info.id);
                this.vueopoly.properties[propertyIndex].ownedby = currentPlayer.name;

                // game log
                let crntPlayer = this.players[this.gameLogic.whosTurn];
                this.gameLogic.gameLog.push(`${crntPlayer.name} purchased ${this.crntTurnLogic.propertyLandedOn.info.name} for $${this.crntTurnLogic.propertyLandedOn.info.price}.`);

                // remove buy button and buy message
                this.buyAvailable = false;
                this.viewPropertyLink = "";

                return;
            }
            
            // TODO handle not enough money to buy
            console.log("buy property function here, but enough money")
        },

        payRent(rentAmount) {
            console.log(rentAmount)
            console.log("rent amount")
            // TODO: create function gamefunctions.getTotalRentCost()
            // TODO add houses i.e. total cost
            if(gameFunctions.moneyCheck(rentAmount, this.players[this.gameLogic.whosTurn].money)) {
                    
                let ownersName = this.crntTurnLogic.propertyLandedOn.info.ownedby

                // deduct the cost of the rent from the player (and from the dom money variable)
                this.players[this.gameLogic.whosTurn].money -= rentAmount;
                this.crntPlayerLogic.crntPlayerMoney -= rentAmount;

                // add cost of rent to property owners money
                let ownersIndex = this.players.findIndex((item) => item.name == ownersName);
                this.players[ownersIndex].money += rentAmount;
                

                // game log
                let crntPlayer = this.players[this.gameLogic.whosTurn];
                this.gameLogic.gameLog.push(`${crntPlayer.name} payed ${ownersName} $${rentAmount} in rent for staying at ${this.crntTurnLogic.propertyLandedOn.info.name}.`);    
                return;
            };

            // TODO handle not enough money to pay rent
            console.log("not enough money to pay rent. must mortgage or sell/trade");
            return;
            

        }
    }
});

</script>
<style scoped>
.player-dashboard-wrapper-main {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50vw;
    top: 31.4vw;
    left: 25vw;
    
   
}
.player-dashboard-wrapper {
    width: 47vw;
    border: 1px solid black;
    background-color: white;
    padding: 10px;
    height: 16vw;
}

.playerName {
    display: flex;
    justify-content: center;
    width: 100%;
}
.manage-trade-btn-wrapper {
    display: flex;
    justify-content: space-around;
}
.roll-dice-end-turn-btn-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.log-and-dice-wrapper {
    display: flex;
    justify-content: space-between;
    
}
.gamelog-wrapper-main {
    display: flex;
    flex-direction: column;
    height: 9vw;
    background-color: gray;
    border: 1px solid black;
    overflow-y: scroll;
    width: 18vw;
    
}
.show-dice-wrapper-main {
    display: flex;
    height:9vw;
    border: 1px solid black;
    width: 18vw;
}
#player-position {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 77vw;
    left: 86vw;
}

</style>
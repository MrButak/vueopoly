<template>

<div v-show="this.showViewOne" class="player-dashboard-wrapper-main">

    <div class="player-dashboard-wrapper">
    
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 1)">Manage</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>

        <!-- TODO: auto scroll to bottom -->
        <div class="log-and-dice-wrapper">
            <div class="gamelog-wrapper-main">
                
                <!-- <text v-for="log in this.gameLogic.gameLog">
                    would like to be able to <text style=`{{ log.style }}`>{{ log.log }}</text> 
                </text> --> 
            </div>
            <div class="show-dice-wrapper-main">
                {{ this.crntTurnLogic.crntDiceRoll[0] }} , {{ this.crntTurnLogic.crntDiceRoll[1] }}
            </div>
        </div>

        <div class="roll-dice-end-turn-btn-wrapper">
            <!-- conditional views -->
            <button v-show="!this.diceRolled" @click="this.rollDice">Roll Dice</button>
            <button v-show="this.diceRolled" @click="this.endTurn">End Turn</button>
        </div>

        <div class="game-message-wrapper">
            <text v-show="this.buyAvailable"><a style="text-decoration: underline;" @click="this.showProperty()">{{ this.viewPropertyLink }}</a> is available to buy for ${{ this.viewPayAmount }}</text>
            <text v-show="this.willPayRent">You payed rent at <a @click="this.showProperty()">{{ this.viewPropertyLink }}</a> for ${{ this.viewPayedAmount }}</text>
            <!-- conditional view -->
            <button v-show="this.buyAvailable" @click="this.buyProperty">Buy</button>
        </div>

    </div>
</div>


<div v-show="this.showViewTwo" class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 2)">Game</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>
        <p>View 2 Manage Properties</p>
    </div>
</div>

<div v-show="this.showViewJail" class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 'jail')">Manage</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>
        <p>In Jail View</p>
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
import PlayerManagerView from './PlayerManagerView.vue';

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
    SpecialCards,
    PlayerManagerView
},

    data() {

        return {
            gameLogDiv: document.querySelector('.gamelog-wrapper-main'),
            // views (game, manage, trade)
            showViewOne: true,
            showViewTwo: false,
            showViewJail: false,

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
            viewPayAmount: "",
            viewPayedAmount: "",
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

        this.initVariables();
        this.displayGameLogs();
        this.mainGameLoop();
        
    },

    methods: {

        initVariables() {
            this.gameLogDiv = document.querySelector('.gamelog-wrapper-main');
            return;
        },

        toggleDashboardViews(event, viewNum) {

            switch(viewNum) {
                case 1:
                    this.showViewJail = false;
                    this.showViewOne = false;
                    this.showViewTwo = true;
                    return;
                case 2:
                    this.showViewJail = false;
                    this.showViewTwo = false;
                    this.showViewOne = true;
                    return;
                case 'jail':
                    this.showViewOne = false;
                    this.showViewTwo = false;
                    this.showViewJail = true;

            };

        },


        displayGameLogs() {
            
            this.gameLogic.gameLog.forEach((log) => {

                let logText = document.createElement('text');
                logText.textContent = log.log;
                logText.style.fontWeight = '700';
                if(log.style == 'game') {
                    logText.style.color = 'white';
                }
                else {logText.style.color = log.style;};
                document.querySelector('.gamelog-wrapper-main').append(logText);
            });
            // scroll to bottom
            this.gameLogDiv.scrollTop = this.gameLogDiv.scrollHeight;

            
            return;
        },

        createGameLog(logObj) {

            let textElement = document.createElement('text');
            textElement.textContent = logObj.log;
            textElement.style.fontWeight = '700';
            if(logObj.style == 'game') {
                textElement.style.color = 'white';
            }
            else{textElement.style.color = logObj.style;};
            this.gameLogic.gameLog.push(logObj);
            document.querySelector('.gamelog-wrapper-main').append(textElement);
            this.gameLogDiv.scrollTop = this.gameLogDiv.scrollHeight; // scroll to bottom
            return;
        },

        // Function is called @click on link in player dashboard to view current property player landed on
        showProperty() {

            // function call to components/gameBoard/GameBoard.vue to preform .click() on current property using property id as argument. (added to this.propertyLink variable in dom)
            this.gameBoard.default.methods.showProperty(event, this.crntTurnLogic.propertyLandedOn.info.id)
        },

        mainGameLoop() {

            // Function call
            this.startTurn(this.players[gameFunctions.getCrntPlayer()]);

        },

        startTurn(crntPlayer) {

             // TODO: handle if player is in jail
            if(crntPlayer.inJail) {

                this.toggleDashboardViews('event', 'jail'); // set 'in jail' view
                console.log("player is in jail");
                
            }

            // game log
            let crntLog = {log: `${crntPlayer.name}'s turn.`, style: 'game'}
            this.createGameLog(crntLog)
            
            
            // set dom variables
            this.crntPlayerLogic.crntPlayerName = crntPlayer.name;
            this.crntPlayerLogic.crntPlayerAlias = crntPlayer.alias;

           
        },

        endTurn() {

            // clear local component variables
            this.buyAvailable = false;
            this.willPayRent = false;
            this.diceRolled = false;
            this.crntPlayerLogic.crntPlayerName = "";
            this.crntPlayerLogic.crntPlayerAlias = "";
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
            this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);
            
            // game log (global state variable)
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            let crntLog = {log: `${crntPlayer.name} rolled for ${this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]} and landed on ${this.crntTurnLogic.propertyLandedOn.info.name}.`, style: crntPlayer.symbol}
            this.createGameLog(crntLog);
            

            // remove player piece before moving to new position
            let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
            crntPlayerPiece.remove()

            // Function call to move physical (dom) player piece
            let propertyId = this.crntTurnLogic.propertyLandedOn.info.id;
            this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

            this.dtrmPropertyAction()
        },


        // Function handles square player lands on
        dtrmPropertyAction() {

            let crntLog;
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            // function call    determines what type of square player lands on, what action to take, then returns and array [case, logic to preform the action]
            let propertyAction = gameFunctions.dtrmPropertyAction(this.crntTurnLogic.propertyLandedOn, this.crntTurnLogic.crntDiceRoll);
            
            switch(propertyAction[0]) {

                case 'chance': // [case, random card number from this.vueopoly.chance[]] string, integer
                    this.handleSpecialCard(propertyAction);
                    break;

                case 'communitychest':
                    this.handleSpecialCard(propertyAction);
                    break;

                case 'freeparking':
                    // gameFunctions.handleFreeParking()
                    console.log("freeparking not yet available");
                    break;

                case 'incometax':

                    if(gameFunctions.moneyCheck(propertyAction[1], crntPlayer.money)) { // propertyAction[1] amount of money to pay

                        // deduct money from player
                        crntPlayer.money -= propertyAction[1];
                        // game log
                        let crntLog = {log: `${crntPlayer.name} payed $${propertyAction[1]} in income tax.`, style: crntPlayer.symbol}
                        this.createGameLog(crntLog);
                        break;
                    }
                    else {
                        // TODO: not enough money to pay
                        console.log("not enough money to pay incometax")
                    };
                   
                case 'luxerytax':
                    if(gameFunctions.moneyCheck(propertyAction[1], crntPlayer)) { // propertyAction[1] amount of money to pay

                        // deduct money from player
                        crntPlayer.money -= propertyAction[1];
                        // game log
                        crntLog = {log: `${crntPlayer.name} payed $${propertyAction[1]} in luxury tax.`, style: crntPlayer.symbol}
                        this.createGameLog(crntLog);
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
                    this.viewPayAmount = this.crntTurnLogic.propertyLandedOn.info.price;
                    break;
                    

                // owned property
                case 'owned':
                    this.willPayRent = true;
                    this.viewPropertyLink = this.crntTurnLogic.propertyLandedOn.info.name; // shows property name in dom
                    this.viewPayedAmount = propertyAction[1];
                    this.payRent(propertyAction[1]); //propertyAction[1] is price
                    break;
                
                case 'jail':
                    // just visiting
                    break;
                
                case 'gotojail':
                    // TODO
                    console.log("handle goto jail here")
                    break;

                case 'go':
                    gameFunctions.passGo();
                    break;

                default:
                    console.log("unhandled switch case dtrmPropertyAction() in PlayerDashboard.vue")
                    break;
            };
            
        },


        // Function moves player piece after Chance or Community Chest dictates a move
        movePlayerPieceDom(propertyId) {

            let crntPlayer = this.players[this.gameLogic.whosTurn];

            // remove player piece before moving to new position
            let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
            crntPlayerPiece.remove()

            // Function call to move physical (dom) player piece
            this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

            return;
        },


        // Function handles all chance and comm chest cards
        handleSpecialCard(cardData) {

        // cardData [chance or commchest, index of random card] (string, integer)
            let crntSpecialCard;
            let specialAction;
            let crntLog;
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            
            switch(cardData[0]) {

                case 'chance':

                    crntSpecialCard = this.gameLogic.chance[cardData[1]];

                    // game log
                    crntLog = {log: `Chance - ${crntSpecialCard.title}.`, style: 'game'};
                    this.createGameLog(crntLog);

                    // send card info to display on dom
                    this.$refs.specialCards.setViewData(cardData, crntSpecialCard);

                    // add to used card deck (index 0)
                    this.gameLogic.usedChance.unshift(this.gameLogic.chance[cardData[1]]);
                    // remove from original deck
                    this.gameLogic.chance.splice(cardData[1], 1);
                    

                    // Function call to handle all special card actions
                    specialAction = gameFunctions.handleSpecialCard(cardData[0]);
                    
                    break;

                case 'communitychest':

                    crntSpecialCard = this.gameLogic.communitychest[cardData[1]];

                    // game log
                    crntLog = {log: `Community Chest - ${crntSpecialCard.title}.`, style: 'game'};
                    this.createGameLog(crntLog);

                    this.$refs.specialCards.setViewData(cardData, crntSpecialCard);
                    this.gameLogic.usedCommunityChest.unshift(this.gameLogic.communitychest[cardData[1]]);
                    this.gameLogic.communitychest.splice(cardData[1], 1);

                    this.gameLogic.gameLog.push(crntSpecialCard.title);

                    specialAction = gameFunctions.handleSpecialCard(cardData[0]);
                    break;

                default:
                    console.log("unhandled in PlayerDashboard.vue handleSpecialCard()")

            };

            // let specialAction = {

            //     movePlayer: {
            //         willMove: false,
            //         position: 0,
            //         canOwn: false,
            //         owned: false,
            //         backThreeSpaces: false,
            //         log: "optional string for game logs"
            //     },
            //     addFunds: {

            //         willAddFunds: false,
            //         amount: 0,
            //         log: "optional string for game logs"
            //     },
            //     removeFunds: {
            //         willRemoveFunds: true,
            //         amount: 0,
            //         log: "optional string for game logs"
            //     }
            // };

            console.log(specialAction)
            console.log("specialAction ^^^^ received from special cards functions")
            
            
            
            // if card moves player
            if(specialAction.movePlayer.willMove) {

                // reset local component variable
                this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(0);
                // move player piece on the dom
                this.movePlayerPieceDom(specialAction.movePlayer.id);
                this.dtrmPropertyAction();
                return;

            };
            if(specialAction.jail.handleJail) {

                if(specialAction.jail.willGo) {
                    this.movePlayerPieceDom('injail');
                    // game log go to jail
                    crntLog = {log: `${crntPlayer.name} has gone to jail.`, style: `${crntPlayer.symbol}`};
                    this.createGameLog(crntLog);
                    return
                };
                // game log get out of jail free card
                crntLog = {log: `${crntPlayer.name} received a ${crntSpecialCard.title} card.`, style: `${crntPlayer.symbol}`};
                this.createGameLog(crntLog);
            }
             
        },


        buyProperty() {
            
            let propertyToBuy = this.crntTurnLogic.propertyLandedOn.info;
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            // function call money check
            if(gameFunctions.moneyCheck(propertyToBuy.price, crntPlayer.money)) {
 
                // deduct the cost of the property from the player
                crntPlayer.money -= propertyToBuy.price;
                
                // add purchased property to players[].properties[]
                crntPlayer.properties.push(propertyToBuy);

                // change the owner in vueopoly.properties[].ownedby // possibly here players references vueopoly
                let propertyIndex = this.vueopoly.properties.findIndex(each => each.id == propertyToBuy.id);
                this.vueopoly.properties[propertyIndex].ownedby = crntPlayer.name;

                // game log
                let crntLog = {log: `${crntPlayer.name} purchased ${propertyToBuy.name} for $${propertyToBuy.price}.`, style: crntPlayer.symbol}
                this.createGameLog(crntLog);

                // remove buy button and buy message
                this.buyAvailable = false;
                this.viewPropertyLink = "";

                return;
            }
            
            // TODO handle not enough money to buy
            console.log("buy property function here, but enough money")
        },

        payRent(rentAmount) {

            console.log(rentAmount, "rent amount");
            
            if(gameFunctions.moneyCheck(rentAmount, this.players[this.gameLogic.whosTurn].money)) {
                   
                let crntPlayer = this.players[this.gameLogic.whosTurn];
                let ownersName = this.crntTurnLogic.propertyLandedOn.info.ownedby;

                // deduct the cost of the rent from the player
                this.players[this.gameLogic.whosTurn].money -= rentAmount;

                // add cost of rent to property owners money
                let ownersIndex = this.players.findIndex((item => item.name == ownersName));
                this.players[ownersIndex].money += rentAmount;

                // game log
                let crntLog = {log: `${crntPlayer.name} payed $${rentAmount} to ${ownersName} for rent at ${this.crntTurnLogic.propertyLandedOn.info.name}.`, style: crntPlayer.symbol}
                this.createGameLog(crntLog);

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
    
}

.player-stats-top-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 4vw;
    padding: 0 0 10px 0;
}
.game-message-wrapper {
    display: flex;
    justify-content: space-around;
    padding: 10px 0 0 0;
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
    height: 15vw;
    background-color: black;
    border: 1px solid black;
    overflow-y: scroll;
    width: 80%;
}

.show-dice-wrapper-main {
    display: flex;
    height:  15vw;
    border: 1px solid black;
    width: 18vw;
}


</style>
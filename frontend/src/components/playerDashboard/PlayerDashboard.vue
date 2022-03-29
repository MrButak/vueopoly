<template>

<div v-show="this.showViewOne" class="player-dashboard-wrapper-main">

    <div class="player-dashboard-wrapper">
    
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 1)">Manage</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>

        <div class="log-and-dice-wrapper">
            <div class="gamelog-wrapper-main">
                <!-- I could consider doing a loop through the array of objects here, using v-bind for the style :style="{ 'color': log.style }" --> 
            </div>
            <div class="show-dice-wrapper-main">
                {{ this.crntTurnLogic.crntDiceRoll[0] }} , {{ this.crntTurnLogic.crntDiceRoll[1] }}
            </div>
        </div>

        <div class="roll-dice-end-turn-btn-wrapper">
            
            <!-- uncomment this along with debugDiceRoll() to manually enter dice roll -->
            <!-- DEBUG roll dice manually -->
            <!-- <input id="debug-dice-roll-one" type="text" placeholder="Enter dice roll">
            <input id="debug-dice-roll-two" type="text" placeholder="Enter dice roll"> -->
            <!-- <button v-show="!this.diceRolled" @click="this.debugDiceRoll">Roll Dice</button> -->
            

            <!-- conditional views -->
            <!-- comment these out if using debugDiceRoll() above -->
            <button v-show="!this.diceRolled" @click="this.rollDice">Roll Dice</button>
            <button class="endTurnBtn" v-show="this.diceRolled" @click="this.endTurn">End Turn</button>
        </div>

        <div class="game-message-wrapper">
            <text v-show="this.buyAvailable"><a style="text-decoration: underline;" @click="this.showProperty($event, this.crntTurnLogic.propertyLandedOn.info.id)">{{ this.viewPropertyLink }}</a> is available to buy for ${{ this.viewPayAmount }}</text>
            <text v-show="this.willPayRent">You payed rent at <a @click="this.showProperty($event, this.crntTurnLogic.propertyLandedOn.info.id)">{{ this.viewPropertyLink }}</a> for ${{ this.viewPayedAmount }}</text>
            <!-- conditional view -->
            <button v-show="this.buyAvailable" @click="this.buyProperty">Buy</button>
        </div>

    </div>
</div>


<!-- manage player view -->
<div v-show="this.showViewTwo" class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 2)">Game</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>
        <text>Properties</text>
 
        <div class="player-properties-wrapper-main">

            <div class="property-wrapper">
                <div v-for="property in this.players[this.gameLogic.whosTurn].properties" class="player-properties-wrapper">
                    <!-- not mortgaged -->
                    <text v-if="!property.mortgaged" @click="this.showProperty($event, property.id)" :style="{'color': property.group, 'text-decoration': 'underline'}">{{ property.name }}</text>
                    <!-- mortgaged -->
                    <text v-if="property.mortgaged" @click="this.showProperty($event, property.id)" :style="{'color': property.group, 'text-decoration': 'line-through'}">{{ property.name }}</text>
                    <div class="player-manager-btn-wrapper">

                        <!-- can only mortgage property if no buildings on property -->
                        <span v-show="property.buildings < 1">
                            <button v-show="!property.mortgaged" @click="this.handleMortgageProperty($event, property.id, ['mortgage', null])">Mortgage</button>
                        </span>
                        <button v-show="property.mortgaged" @click="this.handleMortgageProperty($event, property.id, ['unmortgage', null])">UnMortgage</button>

                        <!-- buy buildings -->
                         <!-- can only buy buildings if property is not mortgaged-->
                        <span v-show="!property.mortgaged">
                            <button v-show="!ownsAllPropsInGroup(property)" style="text-decoration: line-through;">Buildings</button>
                            <button v-show="ownsAllPropsInGroup(property)" @click="this.handleBuyBuilding($event, property)" style="background-color: green;">Buildings</button>
                        </span>
                    </div>
                </div>
            </div>
            <div class="prop-log-and-btns-wrpper">
                <div class="property-log-wrapper-main">
                </div>

                <div v-show="this.showMortgageBtns" class="mortgage-prop-btn-wrapper">
                    <button @click="this.handleMortgageProperty($event, null, ['confirm', 'confirmmortgage'])" class="mortgage-btn">Yes</button>
                    <button @click="this.handleMortgageProperty($event, null, ['cancel', null])" class="mortgage-btn">No</button>
                </div>
                <div v-show="this.showUnMortgageBtns" class="mortgage-prop-btn-wrapper">
                <button @click="this.handleMortgageProperty($event, null, ['confirm', 'confirmunmortgage'])" class="mortgage-btn">Yes</button>
                    <button @click="this.handleMortgageProperty($event, null, ['cancel', null])" class="mortgage-btn">No</button>
                </div>
            </div>
        </div>

        <text>Cards</text>
        <form>
            <div v-for="card in this.players[this.gameLogic.whosTurn].specialCards" class="player-card-wrapper-main">
                <input type="radio" name="player-cards">
                <text>{{ card.title }}</text>
            </div>
            <button type="submit" @click="useGetOutOfJailCard($event)">Use card</button>
        </form>

    </div>
</div>


<!-- in jail view -->
<div v-show="this.showViewJail" class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 'jail')">Manage</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>

        <div class="log-and-dice-wrapper">
            <div class="show-dice-wrapper-main">
                {{ this.crntTurnLogic.crntDiceRoll[0] }} , {{ this.crntTurnLogic.crntDiceRoll[1] }}
            </div>
            <p>In Jail View</p>
        </div>

        <div class="roll-dice-end-turn-btn-wrapper">
            <!-- conditional views -->
            <button v-show="!this.diceRolled" @click="this.rollDice">Roll Dice</button>
            <button v-show="this.diceRolled" @click="this.endTurn">End Turn</button>
        </div>
    </div>
</div>


<!-- building view -->
<div v-show="this.showViewBuilding" class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <div class="player-stats-top-wrapper">
            <button @click="toggleDashboardViews($event, 1)">Manage</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
            <button>Trade</button>
        </div>
        <div id="player-building-prop-wrapper-main">
            
            <!-- prices can only be shown if object exists -->
            <div class="building-cost-wrapper" v-if="this.crntTurnLogic.crntBuildingProperties[0]">
                <text>Buy ${{ this.crntTurnLogic.crntBuildingProperties[0].ohousecost }}</text>
                <text>Sell ${{ this.crntTurnLogic.crntBuildingProperties[0].ohousecost / 2}}</text>
            </div>
            
            <form>
                <div v-for="prop in this.crntTurnLogic.crntBuildingProperties" class="player-building-prop-wrapper">
                    
                    <!-- Only show properties that are not mortgaged (v-if="!prop.mortgaged") -->
                    <input v-if="!prop.mortgaged" type="radio" name="property-buildings" :value="prop.id">
                    <div v-if="!prop.mortgaged" class="property-buildings-list">{{ prop.name }}</div>

                    <!-- for houses  -->
                    <span v-if="prop.buildings < 5" class="property-buildings-wrapper">    
                        <div v-for="building in prop.buildings">
                            <div class="playerdashboard-house-div"> 
                            </div>
                        </div>
                    </span>
                    <!-- for hotel -->
                    <span v-if="prop.buildings > 4" class="property-buildings-wrapper">
                        <div class="playerdashboard-hotel-div"> 
                        </div>

                    </span>

                </div>
                <button type="submit" @click="buySellBuilding($event, 'buy')">Buy</button>
                <button type="submit" @click="buySellBuilding($event, 'sell')">Sell</button>
            </form>
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
        const gameBoard = ref(require('../gameBoard/GameBoard.vue')); // component. for function calls
        const playerPieces = ref(require('../playerDashboard/PlayerPieces.vue')); // component. for function calls

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

            gameLogDiv: document.querySelector('.gamelog-wrapper-main'),
            managePropertyLog: document.querySelector('.property-log-wrapper-main'),
            playerPropertyDiv: document.querySelector('.player-property-wrapper-main'),
            
            // views (game, manage, jail, trade, buildings)
            showViewOne: true,
            showViewTwo: false,
            showViewJail: false,
            showViewBuilding: false,

            // manage player view
            showMortgageBtns: false,
            showUnMortgageBtns: false,

            buyAvailable: false,
            willPayRent: false,
            diceRolled: false,
            showSpecialCard: false,

            crntTurnLogic: {
                propertyLandedOn: {},
                crntDiceRoll: [],
                crntMortgageProperty: {},
                crntBuildingProperties: [] // array of properties to purchase buildings for
            },

            // dom stuff
            viewPropertyLink: "", // current property landed on name
            viewPayAmount: "",
            viewPayedAmount: "",

            crntPlayerLogic: {
                crntPlayerName: "",
                crntPlayerAlias: "",
                crntPlayerMoney: 0,
                crntPlayerProperties: [],
                crntPlayerSpecialCards: [], // TODO: add to this array when special card is obtained

            },

            // player pieces (PlayerPieces.vew). dom elements in (Gameboard.vue)
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
        };
    },

    mounted() {

        this.initVariables();
        this.displayGameLogs(); // game dashboard view
        this.mainGameLoop();
        
    },

    methods: {
        
        // set dom variables
        initVariables() {

            this.gameLogDiv = document.querySelector('.gamelog-wrapper-main');
            this.playerPropertyDiv = document.querySelector('.player-property-wrapper-main');
            this.managePropertyLog = document.querySelector('.property-log-wrapper-main');
            return;
        },


        // Function handles the different 'views' on the player dashboard
        toggleDashboardViews(event, viewNum) {

            switch(viewNum) {
                case 1: // manage player dashboard
                    this.showViewJail = false;
                    this.showViewOne = false;
                    this.showViewBuilding = false;
                    this.showViewTwo = true;
                    break;
                case 2: // main game dashboard 
                    this.showViewJail = false;
                    this.showViewTwo = false;
                    this.showViewBuilding = false;
                    this.showViewOne = true;
                    break;
                case 'jail':
                    this.showViewOne = false;
                    this.showViewTwo = false;
                    this.showViewBuilding = false;
                    this.showViewJail = true;
                    break;
                case 'building':
                    this.showViewOne = false;
                    this.showViewTwo = false;
                    this.showViewBuilding = false;
                    this.showViewBuilding = true;
                    break;
            };
            return;
        },



        startTurn(crntPlayer) {
           
           
           let crntLog;
            // handle in jail
            if(crntPlayer.inJail) {
                crntLog = {log: `${crntPlayer.name}'s turn.`, style: 'game'};
                this.createGameLog(crntLog);
                crntLog = {log: `${crntPlayer.name} is in jail.`, style: `${crntPlayer.symbol}`};
                this.createGameLog(crntLog);
            }
            else {
                let crntLog = {log: `${crntPlayer.name}'s turn.`, style: 'game'};
                this.createGameLog(crntLog);
            };
            
            // set dom variables
            this.crntPlayerLogic.crntPlayerName = crntPlayer.name;
            this.crntPlayerLogic.crntPlayerAlias = crntPlayer.alias;
        },



        rollDice() {

            let crntPlayer = this.players[this.gameLogic.whosTurn];
            this.diceRolled = true; // hide roll dice btn
            let crntLog;

            // Function call (local component variable)
            this.crntTurnLogic.crntDiceRoll = gameFunctions.rollDice();

        // handle in jail
            if(crntPlayer.inJail) {
                
                // if roll doubles, get out of jail
                if(this.crntTurnLogic.crntDiceRoll[0] == this.crntTurnLogic.crntDiceRoll[1]) {
                

                    crntPlayer.inJail = false;
                    crntPlayer.turnsInJail = 0;
                    this.toggleDashboardViews('event', 2);
                    // game logs
                    crntLog = {log: `${crntPlayer.name} rolled doubles and got out of jail!`, style: `${crntPlayer.symbol}`};
                    this.createGameLog(crntLog);

                    // remove player piece before moving to new position
                    let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
                    crntPlayerPiece.remove()
                    
                    this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);
                    // Function call to move physical (dom) player piece
                    let propertyId = this.crntTurnLogic.propertyLandedOn.info.id;
                    this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

                    this.dtrmPropertyAction()
                    return;
                };
                return;
            }

        // not in jail
            else {
                // Function call (local component variable)
                this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);
                
                // game log (global state variable)
                let crntLog = {log: `${crntPlayer.name} rolled for ${this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]} and landed on ${this.crntTurnLogic.propertyLandedOn.info.name}.`, style: crntPlayer.symbol}
                this.createGameLog(crntLog);
                

                // remove player piece before moving to new position
                let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
                crntPlayerPiece.remove()

                // Function call to move physical (dom) player piece
                let propertyId = this.crntTurnLogic.propertyLandedOn.info.id;
                this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

                this.dtrmPropertyAction()
            };
        },

        // Function is fired after 'end turn' btn is clicked or player is sent directly to jail
        endTurn() {

            let crntPlayer = this.players[this.gameLogic.whosTurn];

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
            this.crntTurnLogic.crntBuildingProperties = [];

            // change views if was in jail
            if(crntPlayer.inJail) {
                this.toggleDashboardViews('event', 2);
            };

            // clear out 'manage player view' logs by removing all children
            while (this.managePropertyLog.firstChild) {
                this.managePropertyLog.removeChild(this.managePropertyLog.firstChild);
            };
            
            // save to local storage
            handleLs.saveToLs();
            this.mainGameLoop();
        },
        

// *** Handles buying buildings *** //

        // Function checks to see if player is eligible to build on property. Determines is 'buildings' btn is shown on player dashbord
        ownsAllPropsInGroup(property) {

            if(gameFunctions.canBuyBuilding(property)) {
                return true;
            };
            return false;
        },

        // Function shows all properties in group and 'buy building view'
        handleBuyBuilding(event, property) {


            // get all properties in group
            let allPropsInGroup = this.vueopoly.properties.filter(prop => prop.group.toLowerCase() == property.group.toLowerCase());

            // set local variable (displays on dom)
            this.crntTurnLogic.crntBuildingProperties = allPropsInGroup;
            
            // show 'building view'
            this.toggleDashboardViews(event, 'building');
           
        },

        // Function is fired when 'buy building' btn is clicked
        buySellBuilding(event, action) {

            event.preventDefault();

            let crntPlayer = this.players[this.gameLogic.whosTurn];
            let allPropsInGroup =  this.crntTurnLogic.crntBuildingProperties;
            let propCheckBoxes = event.path[1];

            let propToBuildIndex;
            let propToBuild;

            // Function return boolean if player can purchase building on property
            let canBuyBuilding = (propId) => {
                
                propToBuildIndex = this.vueopoly.properties.findIndex((prop => prop.id == propId));
                propToBuild = this.vueopoly.properties[propToBuildIndex];

                // can only have 5 buildings per property (1 hotel = 5 buildings)
                if(propToBuild.buildings > 5) {
                    return false;
                }
                
                // loop through all properties in group
                for(let i = 0; i < allPropsInGroup.length; i++) {

                    // skip property to build on
                    if(allPropsInGroup[i].id == propToBuild.id) {
                        continue;
                    };
                    // can only have buildings 'evenly' on properties (can't have 2nd building on property until each property has 1 building)
                    if(allPropsInGroup[i].buildings < propToBuild.buildings) {
                        return false;
                    };
                };
            
                // check if enough money to purchase building
                if(gameFunctions.moneyCheck(propToBuild.ohousecost, crntPlayer.money)) {

                    crntPlayer.money -= propToBuild.ohousecost; // deduct cost of building from player
                    return true;
                };
                return false;
                
            };

            let canSellBuilding = (propId) => {

                propToBuildIndex = this.vueopoly.properties.findIndex((prop => prop.id == propId));
                propToBuild = this.vueopoly.properties[propToBuildIndex];
                
                // if no buildings to sell
                if(propToBuild.buildings < 1) {
                    return false;
                };

                // loop through all properties in group
                for(let i = 0; i < allPropsInGroup.length; i++) {

                    // skip property to sell building on
                    if(allPropsInGroup[i].id == propToBuild.id) {
                        continue;
                    };
                    // can only have buildings 'evenly' on properties (can't have 2nd building on property until each property has 1 building)
                    if(allPropsInGroup[i].buildings > propToBuild.buildings) {
                        return false;
                    };

                    crntPlayer.money += propToBuild.ohousecost / 2; // add cost of building to player
                    return true;
                };
            };


            // Main function calls
            for(let i = 0; i < propCheckBoxes.length - 1; i++) {
                if(propCheckBoxes[i].checked) {

                    switch(action) {

                        case 'buy':
                            if(canBuyBuilding(propCheckBoxes[i].value)) {

                                // add a building to the property
                                propToBuild.buildings++;
                                return;
                            }
                            
                            console.log("can't buy building here");
                            return;
                        
                        case 'sell':
                            
                            if(canSellBuilding(propCheckBoxes[i].value)) {

                                propToBuild.buildings--;
                                return;
                            }
                            console.log("can't sell building here");
                            return;
                    };
                    
                };
                
            };
            
        },

        
// *** Handles mortgaging properties *** //

        // Function handles all mortgage action - in 'manage player view'
        handleMortgageProperty(event, propertyId, action) {

            let crntPlayer = this.players[this.gameLogic.whosTurn];
            let crntLog;
            let propertyLogText = document.createElement('text');

            // I should consider using this.vueopoly.properties (so I'm altering variables from one/main source)
            let mortgagePropIndex = crntPlayer.properties.findIndex((prop => prop.id == propertyId));
            let propToMortgage = crntPlayer.properties[mortgagePropIndex];
            // let mortgagePropIndex = this.vueopoly.properties.findIndex((property => property.id == propertyId));
            // let propToMortgage = this.vueopoly.properties[mortgagePropIndex];

            // Set this.crntTurnLogic.crntMortgageProperty the first time the 'mortgaged' btns are clicked because
            // the 'yes', 'no' btns do not have the propertyId sent with them, so I have no access to the property variable otherwise.
            if(propToMortgage) {
                this.crntTurnLogic.crntMortgageProperty = crntPlayer.properties[mortgagePropIndex]
            };
            
        
            switch(action[0]) {

                case 'mortgage':
                    this.showMortgageBtns = true;
                    this.showUnMortgageBtns = false;
                    propertyLogText.textContent = `Mortgage ${propToMortgage.name} for $${propToMortgage.price / 2} ?`;
                    propertyLogText.style.color = 'white';
                    this.managePropertyLog.append(propertyLogText);
                    break;

                case 'unmortgage':
                    this.showMortgageBtns = false;
                    this.showUnMortgageBtns = true;
                    propertyLogText.textContent = `Un-mortgage ${propToMortgage.name} for $${propToMortgage.price / 2 + propToMortgage.price / 2 * .1} ? (Origial mortgage price + 10%)`;
                    propertyLogText.style.color = 'white';
                    this.managePropertyLog.append(propertyLogText);
                    break;

                case 'cancel':
                    this.showMortgageBtns = false;
                    this.showUnMortgageBtns = false;
                    propertyLogText.textContent = 'Cancled.';
                    propertyLogText.style.color = 'red';
                    this.managePropertyLog.append(propertyLogText);
                    break;

                case 'confirm':

                    
                    mortgagePropIndex = crntPlayer.properties.findIndex((prop => prop.id == this.crntTurnLogic.crntMortgageProperty.id));
                    
                    switch(action[1]) {


                        case 'confirmmortgage':

                            crntPlayer.properties[mortgagePropIndex].mortgaged = true; // also changes this.vueopoly.properties[].mortgaged because crntPlayer.properties[] was pushed into array from it
                            crntPlayer.money += crntPlayer.properties[mortgagePropIndex].price / 2;

                            // player logs
                            propertyLogText.textContent = `You mortgaged ${crntPlayer.properties[mortgagePropIndex].name} for $${crntPlayer.properties[mortgagePropIndex].price / 2}.`;
                            propertyLogText.style.color = 'white';
                            this.managePropertyLog.append(propertyLogText);

                            // game logs
                            crntLog = {log: `${crntPlayer.name} mortgaged ${crntPlayer.properties[mortgagePropIndex].name} for $${crntPlayer.properties[mortgagePropIndex].price / 2}.`, style: `${crntPlayer.symbol}`};
                            this.createGameLog(crntLog);

                            this.showMortgageBtns = false;
                            
                            
                            break;

                        case 'confirmunmortgage':
                            // money check
                            if(gameFunctions.moneyCheck(crntPlayer.properties[mortgagePropIndex].price / 2 + crntPlayer.properties[mortgagePropIndex].price / 2 * .1, crntPlayer.money)) {

                                // deduct money from player
                                crntPlayer.money -= crntPlayer.properties[mortgagePropIndex].price / 2 + crntPlayer.properties[mortgagePropIndex].price / 2 * .1;

                                // manage player logs
                                propertyLogText.textContent = `You Unmortgaged ${crntPlayer.properties[mortgagePropIndex].name} for $${crntPlayer.properties[mortgagePropIndex].price / 2 + crntPlayer.properties[mortgagePropIndex].price / 2 * .1}.`;
                                propertyLogText.style.color = 'white';
                                this.managePropertyLog.append(propertyLogText);

                                // game logs
                                crntLog = {log: `${crntPlayer.name} Unmortgaged ${crntPlayer.properties[mortgagePropIndex].name} for $${crntPlayer.properties[mortgagePropIndex].price / 2 + crntPlayer.properties[mortgagePropIndex].price / 2 * .1}.`, style: `${crntPlayer.symbol}`};
                                this.createGameLog(crntLog);
                                
                                // set property to unmortgaged
                                crntPlayer.properties[mortgagePropIndex].mortgaged = false;
                                this.showUnMortgageBtns = false;
                                return;
                            };
                            
                            // player logs
                            propertyLogText.textContent = 'You do no have enough money.';
                            propertyLogText.style.color = 'white';
                            this.managePropertyLog.append(propertyLogText);
                            break;
                    };
            };
        },


        


// *** Game Logs *** //

        // Function inserts game logs into the dom
        // it may be better for me to use a v-bind and loop through the array in the template
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

        // Function pushes a new log into the this.gameLogic.gameLog array
        createGameLog(logObj) {

            // TODO, for multiple logs, instead of calling this function x times in a row, send logs in array and loop through it
            let textElement = document.createElement('text');
            textElement.textContent = logObj.log;
            textElement.style.fontWeight = '700';
            if(logObj.style == 'game') {
                textElement.style.color = 'white'; // default color for 'game master' logs
            }
            else{textElement.style.color = logObj.style;};
            this.gameLogic.gameLog.push(logObj);
            document.querySelector('.gamelog-wrapper-main').append(textElement);

            this.gameLogDiv.scrollTop = this.gameLogDiv.scrollHeight; // scroll to bottom
            return;
        },


        // Function is called @click on link in player dashboard to view current property player landed on
        showProperty(event, propertyId) {

            // function call to components/gameBoard/GameBoard.vue to perform .click() on current property using property id as argument. (added to this.propertyLink variable in dom)
            this.gameBoard.default.methods.showProperty(event, propertyId)
        },


        mainGameLoop() {

            // Function call moves to next player after previous player's turn ends
            let crntPlayer = this.players[gameFunctions.getCrntPlayer()];

            // handle in jail
            if(crntPlayer.inJail) {
                this.handleInJail(crntPlayer);
            };
            this.startTurn(crntPlayer);
        },

        // Function. If player is in jail, set 'jail view' on player dashboard
        handleInJail (crntPlayer) {

            let crntLog;

            // after 3 turns in jail, player is released
            if(crntPlayer.turnsInJail > 2) {
                crntPlayer.inJail = false;
                crntPlayer.turnsInJail = 0;
                this.toggleDashboardViews('event', 2);
                crntLog = {log: `${crntPlayer.name} was released from jail.`, style: `${crntPlayer.symbol}`};
                this.createGameLog(crntLog);
                return;
            };
            
            crntPlayer.turnsInJail++;
            this.toggleDashboardViews('event', 'jail'); // set 'in jail' view
        },

        // TODO
        useGetOutOfJailCard(event) {

            event.preventDefault();

            let crntPlayer = this.players[this.gameLogic.whosTurn];

            // can only use card if in jail
            if(!crntPlayer.inJail) {return}
            
            console.log("handle using get out of jail free card")

        },


// ***  Handles what happens after dice are rolled  *** //


        // Function handles square player lands on
        dtrmPropertyAction() {

            let crntLog;
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            // Function call determines what type of square player lands on, what action to take, then returns an array [case, logic to preform the action]
            let propertyAction = gameFunctions.dtrmPropertyAction(this.crntTurnLogic.propertyLandedOn, this.crntTurnLogic.crntDiceRoll);
            
            switch(propertyAction[0]) {

                case 'chance': // [case, random card number from this.vueopoly.chance[]] (string, integer)
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
                    crntPlayer.inJail = true;
                    this.movePlayerPieceDom('injail');
                    // game log
                    crntLog = {log: `Go to Jail, go directly to Jail, do not pass Go do not collect $200.`, style: `game`};
                    this.createGameLog(crntLog);
                    crntLog = {log: `${crntPlayer.name} has gone to jail.`, style: `${crntPlayer.symbol}`};
                    this.createGameLog(crntLog);
                    crntPlayer.position = 10
                    this.endTurn(); // directly end turn after player has gone to jail
                    break;

                case 'go':
                    gameFunctions.passGo();
                    break;

                default:
                    console.log("unhandled switch case dtrmPropertyAction() in PlayerDashboard.vue")
                    break;
            };
            
        },


// *** Special Cards (chance, community chest)  *** //

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


        // Function handles all chance and comm chest cards. If a player lands on chance or comm chest, this function is fired
        handleSpecialCard(cardData) {// cardData [chance or commchest, index of random card] (string, integer)

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
                    
                    // Function call to handle all special card actions. specialAction is an object.
                    specialAction = gameFunctions.handleSpecialCard(cardData[0]);
                    break;

                case 'communitychest':

                    crntSpecialCard = this.gameLogic.communitychest[cardData[1]];

                    // game log
                    crntLog = {log: `Community Chest - ${crntSpecialCard.title}.`, style: 'game'};
                    this.createGameLog(crntLog);

                    // send card info to display on dom
                    this.$refs.specialCards.setViewData(cardData, crntSpecialCard);

                    // add to used card deck (index 0)
                    this.gameLogic.usedCommunityChest.unshift(this.gameLogic.communitychest[cardData[1]]);

                    // remove from original deck
                    this.gameLogic.communitychest.splice(cardData[1], 1);

                    // Function call to handle all special card actions. specialAction is an object.
                    specialAction = gameFunctions.handleSpecialCard(cardData[0]);
                    break;

                default:
                    console.log("unhandled in PlayerDashboard.vue handleSpecialCard()")

            };

            // if special card moves player
            if(specialAction.movePlayer.willMove) {

                // reset local component variable the new property player is moved to
                this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(0);
                // move player piece on the dom
                this.movePlayerPieceDom(specialAction.movePlayer.id);
                this.dtrmPropertyAction();
                return;

            };

            // if card gives 'get out of jail card' or puts player in jail
            if(specialAction.jail.handleJail) {

                if(specialAction.jail.willGo) {

                    // move player piece on the dom
                    this.movePlayerPieceDom('injail');
                    crntPlayer.position = 10; // set player position to 'in jail'

                    // game log
                    crntLog = {log: `${crntPlayer.name} has gone to jail.`, style: `${crntPlayer.symbol}`};
                    this.createGameLog(crntLog);

                    // immidiately end turn if player sent to jail
                    this.endTurn();
                    return;
                };

                // if player receives a 'get out of jail free' card

                // game log 
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
            console.log("buy property function here, but not enough money")
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
        },


        // DEBUG purposes only. Ender dice roll manually
        // debugDiceRoll() {

        //     let value = document.getElementById('debug-dice-roll-one').value;
        //     let value2 = document.getElementById('debug-dice-roll-two').value;
            
        //     let dice = [parseInt(value), parseInt(value2)];
        //     let crntPlayer = this.players[this.gameLogic.whosTurn];
        //     this.diceRolled = true; // hide roll dice btn
        //     let crntLog;

        //     // Function call (local component variable)
        //     this.crntTurnLogic.crntDiceRoll = dice;

        // // handle in jail
        //     if(crntPlayer.inJail) {
                
        //         // if roll doubles, get out of jail
        //         if(this.crntTurnLogic.crntDiceRoll[0] == this.crntTurnLogic.crntDiceRoll[1]) {
                

        //             crntPlayer.inJail = false;
        //             crntPlayer.turnsInJail = 0;
        //             this.toggleDashboardViews('event', 2);
        //             // game logs
        //             crntLog = {log: `${crntPlayer.name} rolled doubles and got out of jail!`, style: `${crntPlayer.symbol}`};
        //             this.createGameLog(crntLog);

        //             // remove player piece before moving to new position
        //             let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
        //             crntPlayerPiece.remove()
                    
        //             this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);
        //             // Function call to move physical (dom) player piece
        //             let propertyId = this.crntTurnLogic.propertyLandedOn.info.id;
        //             this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

        //             this.dtrmPropertyAction()
        //             return;
        //         }
        //     }

        //     // not in jail
        //     else {
    
        //         // Function call (local component variable)
        //         this.crntTurnLogic.propertyLandedOn = gameFunctions.movePlayerPos(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);
                
        //         // game log (global state variable)
        //         let crntLog = {log: `${crntPlayer.name} rolled for ${this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]} and landed on ${this.crntTurnLogic.propertyLandedOn.info.name}.`, style: crntPlayer.symbol}
        //         this.createGameLog(crntLog);
                

        //         // remove player piece before moving to new position
        //         let crntPlayerPiece = document.querySelector(`[data-player="${crntPlayer.name.toLowerCase()}"]`);
        //         crntPlayerPiece.remove()

        //         // Function call to move physical (dom) player piece
        //         let propertyId = this.crntTurnLogic.propertyLandedOn.info.id;
        //         this.playerPieces.default.methods.movePlayerPiece(propertyId, crntPlayer);

        //         this.dtrmPropertyAction()
        //     };
        //     return;
        
        // },
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

/* player manager view */
.player-properties-wrapper-main {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
}
.player-properties-wrapper {
    display: flex;
    justify-content: space-between;

}
.property-wrapper {
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 6px;
}
.prop-log-and-btns-wrpper {
    display: flex;
    flex-direction: column;
    width: 45%;
}
.property-log-wrapper-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: black;
    border: 1px solid black;
    overflow-y: scroll;
    min-height: 8vw;
}
.player-manager-btn-wrapper {
    display: flex;
    gap: 6px;
}
.mortgage-prop-btn-wrapper {
    display: flex;
    justify-content: center;
    padding: 10px 0 0 0;
    gap: 16px;
}
.mortgage-btn {
    padding: 1px 5px;
    width: 20%;
}
.player-card-wrapper-main {

}
/* building view */
.player-building-prop-wrapper {
    display: flex;
}
.property-buildings-wrapper {
    display: flex;
}
.playerdashboard-house-div {
    display: flex;
    width: 30px;
    height: 30px;
    background-color: green;
}
.playerdashboard-hotel-div {
    display: flex;
    width: 30px;
    height: 30px;
    background-color: red;
}
.building-cost-wrapper {
    display: flex;
}
</style>
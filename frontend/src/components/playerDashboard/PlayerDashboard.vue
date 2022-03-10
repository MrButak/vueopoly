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
            <button v-show="!this.diceRolled" @click="this.rollDice">Roll Dice</button>
            <button v-show="this.diceRolled" @click="this.endTurn">End Turn</button>
            <button v-show="this.buyAvailable" @click="this.buyProperty">Buy</button>
            <text v-show="this.buyAvailable">{{ this.actionMessage }} is available to buy</text>
        </div>


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
        <button @click="this.test">Buy</button>
        

    </div>
</div>


<div id="player-position">
0
</div>

</template>


<script>

const gameFunctions = require('../../../src/javascripts/gameFunctions');
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';
import { ref } from 'vue';

export default defineComponent({

    name: 'PlayerDashboard',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        // let gameBoard = ref(0)
        const gameBoard = ref(require('../gameBoard/GameBoard.vue')); // component

        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic,
            gameBoard
        }
    },

    components: {
        // GameBoard
    },

    data() {

        return {
            
            buyAvailable: false,
            diceRolled: false,
            actionMessage: "",

            crntPlayerLogic: {

                crntPlayerName: "",
                crntPlayerAlias: "",
                crntPlayerMoney: 0,
                crntPlayerProperties: [],

            },
            crntTurnLogic: {
                propertyLandedOn: {},
                crntDiceRoll: [],
            }
        }
    },

    mounted() {
        
        this.mainGameLoop()
    },

    methods: {
        test() {
            // console.log(this.GameBoard.tmp)
            // console.log(this.gameBoard.default.methods.tmp())
            this.gameBoard.default.methods.tmp()
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

        },

        rollDice() {

            this.diceRolled = true; // hide roll dice btn

            // Function call
            this.crntTurnLogic.crntDiceRoll = gameFunctions.rollDice();
            // Function call
            this.crntTurnLogic.propertyLandedOn = gameFunctions.playerPosInfo(this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]);

            // game log
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            this.gameLogic.gameLog.push(`${crntPlayer.name} rolled for ${this.crntTurnLogic.crntDiceRoll[0] + this.crntTurnLogic.crntDiceRoll[1]} and landed on ${this.crntTurnLogic.propertyLandedOn.info.name}.`)

            // Function call
            this.dtrmPropertyAction()
        },

        dtrmPropertyAction() {

            
            // function call
            let propertyAction = gameFunctions.dtrmPropertyAction(this.crntTurnLogic.propertyLandedOn);
            // switch here
            switch(propertyAction[0]) {

                case 'chance':
                    gameFunctions.handleChanceCard()
                case 'communitychest':
                    gameFunctions.handleCommunityChest()
                case 'freeparking':
                    // gameFunctions.handleFreeParking()
                case 'incometax':
                    // gameFunctions.handleIncomeTax()
                case 'luxerytax':
                    // gameFunctions.handleLuxeryTax()
                case 'notowned':
                    this.buyAvailable = true; // shows buy btn on dom
                    this.actionMessage = gameFunctions.actionMessage(this.crntTurnLogic.propertyLandedOn)

                    return;
                case 'owned':
                    if(gameFunctions.moneyCheck(propertyAction)) {


                        console.log('enough money')
                    }

            };
            console.log(propertyAction);
        },

        buyProperty() {

            console.log(this.crntTurnLogic.propertyLandedOn)
            
            
            console.log("buy property function here")
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
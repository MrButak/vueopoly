<template>

<div class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        
        <div class="playerName">
            {{ this.crntPlayerName }} - {{ this.crntPlayerAlias }}
        </div>

        <div class="manage-trade-btn-wrapper">
            <button>Manage</button>
            <text>${{ this.crntPlayerMoney }}</text>
            <button>Trade</button>
        </div>

        <div class="roll-dice-end-turn-btn-wrapper">
            <button @click="this.rollDice">Roll Dice</button>
        </div>

        <div class="log-and-dice-wrapper">
            <div class="gamelog-wrapper-main">
                <text v-for="log in this.gameLogic.gameLog">
                    {{ log }}
                </text>
            </div>
            <div class="show-dice-wrapper-main">
                {{ this.crntDiceRoll[0] }} , {{ this.crntDiceRoll[1] }}
            </div>
        </div>

    </div>
</div>


<div id="player-position">
0
</div>
<!-- for each player -->
<!-- {{  playerName, playerAlias, money, properties, trade option, mortage option }} -->
<!-- global -->
<!-- {{ gamelog }} -->
</template>

// functions to run game
// get current player data
// 
<script>

const gameFunctions = require('../../../src/javascripts/gameFunctions');
// import ChoosePlayers from '@/components/initGame/ChoosePlayers.vue';
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({

    name: 'PlayerDashboard',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic
        }
    },

    components: {
        
    },

    data() {

        return {
            
            crntPlayerName: "",
            crntPlayerAlias: "",
            crntPlayerMoney: 0,
            crntPlayerProperties: [],
            crntDiceRoll: []
        }
    },

    mounted() {
        
        this.mainGameLoop()
    },

    methods: {

        mainGameLoop() {

            // Function call
            this.startTurn(this.players[gameFunctions.getCrntPlayer()]);
        },

        startTurn(crntPlayer) {
            
            // game log
            this.gameLogic.gameLog.push(`${crntPlayer.name}'s turn.`)
            
            // set dom variables
            this.crntPlayerName = crntPlayer.name;
            this.crntPlayerAlias = crntPlayer.alias;
            this.crntPlayerMoney = crntPlayer.money;
        },

        rollDice() {

            // Function call
            this.crntDiceRoll = gameFunctions.rollDice();
            // Function call
            let propertyInfo = gameFunctions.playerPosInfo(this.crntDiceRoll[0] + this.crntDiceRoll[1]);

            // game log
            let crntPlayer = this.players[this.gameLogic.whosTurn];
            this.gameLogic.gameLog.push(`${crntPlayer.name} rolled for ${this.crntDiceRoll[0] + this.crntDiceRoll[1]} and landed on ${propertyInfo.info.name}.`)

            // Function call
            this.dtrmPropertyAction(propertyInfo)
        },

        dtrmPropertyAction(propertyInfo) {

            let propertyAction = gameFunctions.dtrmPropertyAction(propertyInfo);
            // switch here
            console.log(propertyAction)
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
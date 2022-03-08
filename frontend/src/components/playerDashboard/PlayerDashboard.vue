<template>
<!-- after a new game is created this.gameLogic.startGame is set to true -->
<div v-show="this.gameLogic.startGame">
    <div class="player-dashboard-wrapper-main">
        <div class="player-dashboard-wrapper">
            <button @click="this.mainGameLoop" id="start-game-btn">Start Game</button>
            
            <div class="playerName">
                {{ this.crntPlayerName }} - {{ this.crntPlayerAlias }}
            </div>
            <div class="gameLog">

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
        }
    },

    mounted() {
        
      
        
        
    },
    // onmounted() {
    //     this.startGame();
    // },

    methods: {

        initDom() {


            // console.log(this.vueopoly)
            // this.playerPosition = document.getElementById('player-position');
            // this.playerPosition.style.left = '70vw'
        },

        // startGame() {
        //     console.log(typeof(this.players), 'here made it to main loop')
        //     if(this.gameLogic.gameStart) {
        //         this.mainGameLoop()
        //         return;
        //     }
        //     return
        // },

        mainGameLoop() {

            // remove start game button
            document.getElementById('start-game-btn').remove()
            console.log("did it",this.gameLogic)
        //*****
            // 3 lines vs 1. In this case which is better?
            // let crntPlayerIndex = gameFunctions.getCrntPlayer();
            // let crntPlayer = this.players[crntPlayerIndex];
            // this.getCrntPlayerData(crntPlayer);
            this.getCrntPlayerData(this.players[gameFunctions.getCrntPlayer()]);
        //*****

        },

        getCrntPlayerData(crntPlayer) {

            console.log(crntPlayer)
            this.crntPlayerName = crntPlayer.name;
            this.crntPlayerAlias = crntPlayer.alias;
            this.crntPlayerMoney = crntPlayer.money;
            // console.log(this.gameLogic)
            // console.log(this.players[0].name)
            
            // console.log(this.players[0].tmp)


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
    width: 99vw;
    top: 80vw;
    
   
}
.player-dashboard-wrapper {
    width: 47vw;
    
    border: 1px solid black;
    background-color: white;
}

.playerName {
    display: flex;
    justify-content: center;
    width: 100%;
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
<template>
<InitGame />
<GameBoard />
<!-- v-if over v-show. v-if is not loaded until condition is met -->
<div v-if="this.gameLogic.startGame">
    <PlayerDashboard ref="playerDashboard" />
    <PlayerPieces ref="playerPieces" />
</div>

</template>

<script>
// @ is an alias to /src
// const main = require('../../public/javascripts/initNewGame');
import GameBoard from '@/components/gameBoard/GameBoard.vue';
import PlayerPieces from '@/components/gameBoard/PlayerPieces.vue';
import InitGame from '@/components/initGame/InitGame.vue';
import PlayerDashboard from '@/components/playerDashboard/PlayerDashboard.vue';
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({

    name: 'Home',
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
        GameBoard,
        InitGame,
        PlayerDashboard,
        PlayerPieces
    },

    data() {

        return {
            
            
        }
    },

    mounted() {
        
      
        
        
    },
    

    methods: {

    }
})
</script>

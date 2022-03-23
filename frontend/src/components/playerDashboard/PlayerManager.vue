<template>

    <div class="player-stats-top-wrapper">
        <button>Game</button>
            <text>{{ this.crntPlayerLogic.crntPlayerName }} - {{ this.crntPlayerLogic.crntPlayerAlias }}</text>
            <text>${{ this.players[this.gameLogic.whosTurn].money }}</text>
        <button>Trade</button>
    </div>
        
</template>

<script>

const handleLs = require('../../../src/javascripts/handleLs');
const gameFunctions = require('../../../src/javascripts/gameFunctions');
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';
import { ref } from 'vue';


export default defineComponent({


    name: 'PlayerManager',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        const playerDashboard = ref(require('../playerDashboard/PlayerDashboard.vue')); // component

        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic,
            playerDashboard

        }
    },

    components: {
        // PlayerDashboard
    },

    data() {

        return {
            
            crntPlayerLogic: {

                crntPlayerName: "",
                crntPlayerAlias: "",
                crntPlayerMoney: 0,
                crntPlayerProperties: [],

            },
            
            
        }
    },

    mounted() {

        
        
    },

    methods: {

      
    }
});
</script>

<style scoped>
.player-stats-top-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 4vw;
    padding: 0 0 10px 0;
}
</style>
<template>
<InitGame />
<GameBoard />
<PlayerDashboard />
</template>

<script>
// @ is an alias to /src
// const main = require('../../public/javascripts/initNewGame');
import GameBoard from '@/components/GameBoard.vue';
import InitGame from '@/components/initGame/InitGame.vue';
import PlayerDashboard from '@/components/playerDashboard/PlayerDashboard.vue';

export default {
    name: 'Home',
    components: {
        GameBoard,
        InitGame,
        PlayerDashboard
    },

    // mounted() {
    //     this.callMain()
    // },

    // methods: {
    //     callMain() {
    //         main.initNewGame()
    //     }
    // }
}
</script>

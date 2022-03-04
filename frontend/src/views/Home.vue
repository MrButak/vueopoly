<template>
<ChoosePlayers />
<!-- put if clause here to show or not. If 'continue game' don't show this -->
<GameBoard />
</template>

<script>
// @ is an alias to /src
// const main = require('../../public/javascripts/initNewGame');
import GameBoard from '@/components/GameBoard.vue';
import ChoosePlayers from '@/components/ChoosePlayers.vue';

export default {
    name: 'Home',
    components: {
        GameBoard,
        ChoosePlayers
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

<template>
<NewGame />
<!-- put if clause here to show or not. If 'continue game' don't show this -->
<GameBoard />
</template>

<script>
// @ is an alias to /src
// const main = require('../../public/javascripts/initNewGame');
import GameBoard from '@/components/GameBoard.vue';
import NewGame from '@/components/NewGame.vue';

export default {
    name: 'Home',
    components: {
        GameBoard,
        NewGame
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

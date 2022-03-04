<template>
<GameBoard />
</template>

<script>
// @ is an alias to /src
// const main = require('../../public/javascripts/initNewGame');
import GameBoard from '@/components/GameBoard.vue'

export default {
    name: 'Home',
    components: {
        GameBoard
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

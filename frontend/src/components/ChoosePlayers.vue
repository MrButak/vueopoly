<template>

<div class="choose-players-wrapper-main">
    
    <label for="player-count">Number of players:</label>
    <select name="player-count" id="player-count">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
    <br><br>
    <button @click="this.startGame($event)" value="Start Game">Start Game</button>
    
</div>

</template>

<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '../../src/javascripts/stateStore';
const initNewGame = require('../../src/javascripts/initNewGame');

export default defineComponent({

    setup() {

        const { lsInUse, players } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players
            
        }
    },

    data() {

        return {
        }
    },

    mounted() {
        
        
        
    },

    methods: {
        startGame(event) {

            let players = {

                'Player 1': {

                    alias: 'Matthew',
                    symbol: 'Horse'

                },
                'Player 2': {

                    alias: 'Yohana',
                    symbol: 'Cat'
                }
            };
            
            initNewGame.initNewGame(players)
            
        }
    }

});
</script>

<style lang="scss">

.choose-players-wrapper-main {

    display: flex;
    flex-direction: column;
    width: 100%;
    height: 200px;
    border: 1px solid black;
}

</style>

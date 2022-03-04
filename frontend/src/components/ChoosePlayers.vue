<template>
<!-- start new game (only shown if previous game not found in storage) -->
<div v-if="this.players === 0 || this.players === null" class="choose-players-wrapper-main">
    <label for="player-count">Number of players:</label>
    <select name="player-count" id="player-count">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
    <br><br>
    <button @click="this.startGame($event)" value="Start Game">Start Game</button>
    <button @click="this.tmp()">test players</button>
</div>
<!-- if previous game found in storage -->
<!-- <div v-else>
    <p>Previous game found</p>
    <button @click="this.restoreGame()">continue game</button>
    <button @click="this.players = 0">start new game</button>
</div> -->
</template>

<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '../../src/javascripts/stateStore';
const initNewGame = require('../../src/javascripts/initNewGame');

export default defineComponent({

    setup() {

        const { lsInUse, players, vueopoly } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly
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

            // TODO: get data from form above and create obj structured like the one below
            let newPlayers = {

                'Player 1': {

                    alias: 'Matthew',
                    symbol: 'Horse'

                },
                'Player 2': {

                    alias: 'Yohana',
                    symbol: 'Cat'
                }
            };
            
            // assign new players to global state and local storage
            let gameObjs = initNewGame.initNewGame(newPlayers);
            this.players = gameObjs['playersArr'];
            this.vueopoly = gameObjs['gameJson'];
            
        },
        restoreGame() {

            console.log('not yet available')
        },
        tmp() {

            console.log(this.players)
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

<template>

<!-- start new game (only shown if previous game not found in storage) v-if="this.players === 0 || this.players === null -->
<div v-if="this.players === 0 || this.players === null" class="new-game-wrapper-main">
    <div class="new-game-title">
        <h3>Welcome to Vueopoly</h3>
    </div>

    <div class="choose-players-wrapper">
        <label for="player-count">Number of players:</label>
        <select name="player-count" id="player-count">
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
    </div>
    <div class="choose-players-wrapper">
        <span v-for="n in this.playerCount">
            <label for="`player-name${n}`">Player {{ n }} name</label>
            <input name="`player-name${n}`" type="text">
        </span>
    </div>
    
    <button @click="this.startGame($event)" value="Start Game">Start Game</button>
    <button @click="this.tmp()">testing</button>
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
            
            playerCount: 3
        }
    },

    mounted() {
        
        
        
    },

    methods: {

        // getValue() {

        //     let select = document.getElementById('player-count');
        //     let option = select.options[select.selectedIndex];
        //     this.playerCount = option.value;
        //     console.log(this.playerCount)
        // },

        
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
                },
                'Player 3': {

                    alias: 'Johnny',
                    symbol: 'Snake'
                }
            };
            
            // assign new players to global state and local storage
            let gameObjs = initNewGame.initNewGame(newPlayers);
            this.players = gameObjs['playersArr'];
            this.vueopoly = gameObjs['gameJson'];
            
        },
        restoreGame() {

            console.log('not yet available')
        }
        
    }

});
</script>

<style lang="scss">

.new-game-wrapper-main {

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 200px;
    border: 1px solid black;
}
.new-game-title {

}
.choose-players-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
}
#player-count {
    width: 30px;
}
</style>

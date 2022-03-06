<template>

<!-- start new game (only shown if previous game not found in storage) v-if="this.players === 0 || this.players === null -->

<div v-if="this.viewNumber == 1" id="choose-players-form">
    <div class="choose-players-wrapper">
        <label for="player-count">Number of players:</label>
        <select @change="updatePlayerCount" name="player-count" id="player-count">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        </select>
    </div>
    <button @click="this.viewNumber = 2" type="submit">Continue</button>
</div>


<div v-if="this.viewNumber == 2" class="choose-players-wrapper">
    <form>
        
            <div v-for="count in this.playerCount">
                <label for="player-name">Player {{ count }} name</label>
                <input name="player-name" type="text">
                <!-- <label for="player-symbol">Symbol</label> -->
                <select name="player-symbol">
                    <option v-for="symbol in this.playerSymbols">{{ symbol }}</option>
                </select>
                
            </div>
        
        <button @click="this.viewNumber = 1" type="submit">Back</button>
        <!-- <button @click="this.startGame($event)" type="submit">Start game</button> -->
        <button @click="this.validateNewGameForm($event)" type="submit">Start game</button>
        
    </form>
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
    name: 'ChoosePlayers',
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
            
            playerCount: 2,
            playerSymbols: ["", "horse", "dog", "monkey", "cat", "beaver", "snake"],
            viewNumber: 1
        }
    },

    mounted() {
        
        
        
    },

    methods: {

        updatePlayerCount(event) {

            this.playerCount = parseInt(event.target.value);
        },

        validateNewGameForm(event) {

            event.preventDefault();
            console.log(event)
            let formElements = event.target.form;
            Object.keys(formElements).forEach((key) => {
                
                console.log(formElements[key].value);
            });
        },

        startGame(event) {

            event.preventDefault();

            // create newPlayers object which I use to create new players from class
            let tmpStr = "Player ";
            let tmpArry = [];
            let newPlayers = {}
            for(let i = 0; i < event.target.form.length - 2; i++) {
                // console.log(event.target.form[i].value)
                tmpArry[i] = `${tmpStr}` + (i + 1);
                newPlayers[tmpArry[i]] = {
                    'alias': event.target.form[i + 1].value,
                    'symbol' : "Dog"
                };
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
#choose-players-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>

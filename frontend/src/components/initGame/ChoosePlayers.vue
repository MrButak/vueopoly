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
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
    </div>
    <button @click="this.viewNumber = 2" type="submit">Continue</button>
</div>


<div v-if="this.viewNumber == 2" class="choose-players-wrapper">
    <p v-if="this.errorMessage">{{ this.errorMessage }}</p>
    <form>
            <div v-for="count in this.playerCount">
                <label for="player-name">Player {{ count }} name</label>
                <input name="player-name" type="text">
                <!-- <label for="player-symbol">Symbol</label> -->
                <select name="player-symbol">
                    <option v-for="symbol in this.playerSymbols">{{ symbol }}</option>
                </select>
                
            </div>
        
        <button @click="this.restartForm" type="submit">Back</button>
        <button @click="this.validateNewGameForm($event)" type="submit">Start game</button>
        
    </form>
</div>
        
<!-- if previous game found in storage ask to restore game or start new game-->
<!-- <div v-else>
    <p>Previous game found</p>
    <button @click="this.restoreGame()">continue game</button>
    <button @click="this.players = 0">start new game</button>
</div> -->
</template>

<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';
const initNewGame = require('/src/javascripts/initNewGame');

export default defineComponent({
    name: 'ChoosePlayers',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic
        }
    },

    data() {

        return {
            
            playerCount: 2,
            playerSymbols: ["green", "yellow", "white", "black", "pink", "brown", "purple", "grey"],
            viewNumber: 1,
            errorMessage: null
        }
    },

    mounted() {
        
        
        
    },

    methods: {

        // Function resets form to original values when 'back button' clicked
        restartForm() {
            this.playerCount = 2;
            this.errorMessage = null;
            this.viewNumber = 1;
        },

        // Function updates the number of players being created (used to determine the amount of name and symbol inputs to display)
        updatePlayerCount(event) {

            this.playerCount = parseInt(event.target.value);
        },

        // Function validates new player form. If not valid, error message is displayed, if valid this.startGame() function is called
        validateNewGameForm(event) {

            event.preventDefault();
            let validForm = true;
            let aliasArry = [];
            let symbolArry = [];
            let formElements = event.target.form; 

            // iterate through all form elements, check for duplicates and blanks ("")
            Object.keys(formElements).forEach((key) => {

                switch(formElements[key].tagName) {

                    case 'INPUT':
                        if(aliasArry.includes(formElements[key].value)) {
                            validForm = false;
                            this.errorMessage = 'Unique names required';
                            return;
                        }
                        else if(formElements[key].value == "") {
                            validForm = false;
                            this.errorMessage = 'Name required';
                            return;
                        };
                        aliasArry.push(formElements[key].value);
                        return;
                        
                    case 'SELECT':
                        if(symbolArry.includes(formElements[key].value)) {
                            this.errorMessage = 'Unique symbols required';
                            validForm = false;
                            return;
                        }
                        else if(formElements[key].value == "") {
                            validForm = false;
                            this.errorMessage = 'Symbol required';
                            return;
                        };
                        symbolArry.push(formElements[key].value);
                        return;

                    case 'BUTTON':
                        return;

                    default:
                        validForm = false;
                        this.errorMessage = 'unexpected error, try again';
                        return;
                        
                }

            });
            // if the form is valid send values to startGame function which will then create players from Class
            if(validForm) {
                    console.log('valid form true');
                    this.startGame(aliasArry, symbolArry);
                    return;
                    
            };
            // invalid form
            console.log('valid form false');
            return;
        },

        startGame(aliasArry, symbolArry) {

            // create newPlayers object which I then sent to initNewGame.initNewGame() to create new players from Class
            let tmpStr = "Player ";
            let tmpArry = [];
            let newPlayers = {}
            for(let i = 0; i < aliasArry.length; i++) {
                
                tmpArry[i] = `${tmpStr}` + (i + 1);
                newPlayers[tmpArry[i]] = {
                    'alias': aliasArry[i],
                    'symbol' : symbolArry[i]
                };
            };
            
            // function call to create players from Class and set in localStorage
            let gameObjs = initNewGame.initNewGame(newPlayers);
            // assign new players to global state
            this.players = gameObjs['playersArr'];
            this.vueopoly = gameObjs['gameJson'];
            this.gameLogic = gameObjs['gameLogic'];
            // console.log(this.players);
            // console.log("players successfully created");
            console.log("where is my game logic?")
            console.log(this.gameLogic)
        },
        
    }

});
</script>

<style lang="scss">



.choose-players-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
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

<template>

</template>

<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({
    name: 'PlayerPieces',
    setup() {

        const { lsInUse, players, vueopoly, gameLogic } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly,
            gameLogic
        }
    },

    components: {
        
    },

    data() {

        return {
            
            playerPositions: []
        }
    },

    mounted() {
        
       this.initPlayerPosition()
        
    },

    methods: {

        initPlayerPosition() {
            
            // TODO: detect change in screen width, and call this function
            // function runs after page refresh or new game 

            // Function call. Positions player piece on the game board
            this.players.forEach((player) => {
                // let indexOfPlayerPosition = this.vueopoly.tiles.findIndex((each => each.position == player.position));
                this.movePlayerPiece(this.vueopoly.tiles[player.position], player);
            });

        },

        movePlayerPiece(property, player) {
            
            let elementDataId = player.name

            // Variable value source is determined by the function that called this function. property object is slightly different.
            // From PlayerDashboard.vue property.info.id . From (above) this.initPlayerPosition property.id
            let propertyId;
            try {
                propertyId = property.info.id;
                console.log(`player to move to ${propertyId}`);
                
            }
            catch {
                propertyId = property.id;
                console.log(`player to move to ${propertyId}`)
            };
                
            console.log(propertyId, "in PlayerPieces.vue")
            // switch case for all chance, community chest, jail, just visiting. I think all others can be default
            // maybe go off of player position for chance and community chest
            // this.players[this.gameLogic.whosTurn].position

            // Reference dom object of property to put player piece using the dataset
            let proptertyToMoveTo = document.querySelectorAll(`[data-id="${propertyId}"]`);
            // Get the location data of that dom object. (More than one dataset attribute with the same names (propertyId) are used on dom elements, so array is returned. Index 0 is the 'out-most' div I position the player pieces on).
            let propertyPosition = proptertyToMoveTo[0].getBoundingClientRect();

            // Create player piece
            let playerPiece = document.createElement('div')
            let playerPieceWidth = 10;
            playerPiece.textContent = player.name
            playerPiece.style.width = playerPieceWidth + "px";
            playerPiece.style.height = playerPieceWidth + "px";
            playerPiece.style.backgroundColor = player.symbol
            playerPiece.dataset.player = elementDataId.toLowerCase(); // dataset attribute
            
            
            let playerPieceoffSet = playerPieceWidth;

            // Determine the 'offset' number to use so all of the player pieces will not be piled on top of each other.
            switch(player.name.toLowerCase()) {

                case 'player 1':
                    playerPieceoffSet = playerPieceWidth;
                    break;
                case 'player 2':
                    playerPieceoffSet = playerPieceWidth * 2;
                    break;
                case 'player 3':
                    playerPieceoffSet = playerPieceWidth * 4;
                    break;
                case 'player 4':
                    playerPieceoffSet = playerPieceWidth * 8;
                    break;
                case 'player 5':
                    playerPieceoffSet = playerPieceWidth - playerPieceWidth * 2;
                    break;
                case 'player 6':
                    playerPieceoffSet = playerPieceWidth - playerPieceWidth * 4;
                    break;
                case 'player 7':
                    playerPieceoffSet = playerPieceWidth - playerPieceWidth * 8;
                    break;
                case 'player 8':
                    playerPieceoffSet = playerPieceWidth - playerPieceWidth * 16;
                    break;
            };

            // Each parent element has a different position for player pieces.
            switch(proptertyToMoveTo[0].parentElement.classList[0]) {
                
                case 'pos-top':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.bottom = (propertyPosition.height) - playerPieceWidth + "px";
                    playerPiece.style.left = (propertyPosition.width / 2) - playerPieceoffSet / 2 + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    return;

                case 'pos-right':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height / 2) - playerPieceoffSet / 2 + "px";
                    playerPiece.style.left = (propertyPosition.width) - playerPieceoffSet + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    return;

                case 'pos-bottom':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height - playerPieceWidth) + "px";
                    playerPiece.style.left = (propertyPosition.width / 2) - playerPieceoffSet / 2 + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    return;

                case 'pos-left':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height / 2) - playerPieceoffSet / 2 + "px";
                    playerPiece.style.right = (propertyPosition.width) - playerPieceWidth + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    return;
            };
        }
    }
});
</script>

<style scoped lang="scss">

.player-position {
    position: absolute;
    
}

</style>

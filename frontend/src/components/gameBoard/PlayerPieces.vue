<template>

<div v-for="a in this.players.length">
    <div class="player-position">
        
    <p>{{ a }}</p>
    </div>
</div>


</template>

<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';


export default defineComponent({
    name: 'PlayerPieces',
    setup() {

        const { lsInUse, players, vueopoly } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly
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
            
            // function runs after refresh of page or new game 

            // Function call. Positions player piece on the game board
            this.players.forEach((player) => {
                // let indexOfPlayerPosition = this.vueopoly.tiles.findIndex((each => each.position == player.position));
                this.movePlayerPiece(this.vueopoly.tiles[player.position], player)
            });
            console.log(this.players)
            console.log("coming from playerpieces")
          
        },

        movePlayerPiece(property, player) {


            console.log(player)
            console.log("player")

            // Variable name is determined by the function that called this function. property object is slightly different.
            // From PlayerDashboard.vue property.info.id . From (above) this.initPlayerPosition property.id
            let propertyId;
            try {
                propertyId = property.info.id;
            }
            catch {
                propertyId = property.id;
            };
                
            
            console.log(propertyId)

            // Reference dom object of property using the dataset
            let proptertyToMoveTo = document.querySelectorAll(`[data-id="${propertyId}"]`);
            // Get the location data of that dom object. (More than one dataset attribute with the same names (propertyId) are used on dom elements, so array is returned. Index 0 is the 'out-most' div I position the player pieces on).
            let propertyPosition = proptertyToMoveTo[0].getBoundingClientRect();

            console.log(proptertyToMoveTo)

            // Create player piece
            let playerPiece = document.createElement('div')
            let playerPieceWidth = 10;
            playerPiece.style.width = playerPieceWidth + "px";
            playerPiece.style.height = playerPieceWidth + "px";
            playerPiece.style.backgroundColor = player.symbol
            playerPiece.dataset.player = player.name; // dataset attribute
            
            let playerPieceoffSet = playerPieceWidth;

            // Determine the 'offset' number, so all of the player pieces will not be piled on top of each other.
            switch(player.name.toLowerCase()) {

                case 'player 1':
                    playerPieceoffSet = playerPieceWidth;
                    console.log("case 1 for player 1")
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
                    console.log("top position")
                    return;

                case 'pos-right':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height / 2) - playerPieceoffSet / 2 + "px";
                    playerPiece.style.left = (propertyPosition.width) - playerPieceoffSet + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    console.log("right position");
                    return;

                case 'pos-bottom':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height - playerPieceWidth) + "px";
                    playerPiece.style.left = (propertyPosition.width / 2) - playerPieceoffSet / 2 + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    console.log("bottom position");
                    return;

                case 'pos-left':
                    
                    playerPiece.style.position = "absolute";
                    playerPiece.style.top = (propertyPosition.height / 2) - playerPieceoffSet / 2 + "px";
                    playerPiece.style.right = (propertyPosition.width) - playerPieceWidth + "px";
                    proptertyToMoveTo[0].appendChild(playerPiece);
                    console.log("left position");
                    return;
            };
            
            console.log("^^^^^^^^^^")
    
        }
    }
});
</script>

<style scoped lang="scss">

.player-position {
    position: absolute;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // bottom: 13vw;
    // right: 11vw;
   /* top: 77vw;
    left: 86vw; */
    
}

</style>

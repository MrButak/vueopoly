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
            
            playerPositions: {}
        }
    },

    mounted() {
        
       this.initPlayerPosition()
        
    },

    methods: {

        initPlayerPosition() {

            // let tmpCnt = 1;
            // this.playerPositions = document.querySelectorAll('.player-position');

            // this.playerPositions.forEach((item) => {

            //     item.dataset.player = `player-${tmpCnt}`;
            //     // item.style.bottom = `${this.vueopoly.tiles[0].bottom}`
            //     // item.style.left = `${this.vueopoly.tiles[0].top}`
            //     // item.style.top = "77vw"
            //     // item.style.left = "86vw"
               
            //     // console.log(this.vueopoly.tiles[0].bottom);
            //     // console.log(this.vueopoly.tiles[0].left);
            //     tmpCnt++;
            // })
            
            // console.log("player positions here");
        }
    }
});
</script>

<style scoped lang="scss">

.player-position {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    bottom: 13vw;
    right: 11vw;
   /* top: 77vw;
    left: 86vw; */
    
}

</style>

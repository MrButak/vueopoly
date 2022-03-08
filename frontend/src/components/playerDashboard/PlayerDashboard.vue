<template>
<div class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <p>Player Dashboard</p>
    </div>
</div>

<div id="player-position">
0
</div>


</template>

<script>
// import ChoosePlayers from '@/components/initGame/ChoosePlayers.vue';
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({
    name: 'PlayerDashboard',
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
            
            playerPosition: []
        
        }
    },

    mounted() {
        
        this.initDom();
        
    },

    methods: {

        initDom() {
            console.log(this.vueopoly)
            this.playerPosition = document.getElementById('player-position');
            // this.playerPosition.style.left = '70vw'
        }

    }
});
</script>
<style scoped>
.player-dashboard-wrapper-main {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 99vw;
    top: 80vw;
    
   
}
.player-dashboard-wrapper {
    width: 47vw;
    
    border: 1px solid black;
    background-color: white;
}
#player-position {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 77vw;
    left: 86vw;
}

</style>
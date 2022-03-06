<template>
<div class="player-dashboard-wrapper-main">
    <div class="player-dashboard-wrapper">
        <p>Player Dashboard</p>
    </div>
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
            
        
        }
    },

    mounted() {
        
        
        
    },

    methods: {
    }
})
</script>
<style scoped>
.player-dashboard-wrapper-main {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 99vw;
    top: 37vw;
    
   
}
.player-dashboard-wrapper {
    width: 47vw;
    
    border: 1px solid black;
    background-color: white;
}

</style>
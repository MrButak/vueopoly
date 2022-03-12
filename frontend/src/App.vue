<template>
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->

  <router-view/>
  <!-- <PlayerDashboard ref="playerDashboard" /> -->
</template>
<script>

import { defineComponent } from 'vue';
const handleLs = require('../src/javascripts/handleLs');
import { vueGlobalState } from '../src/javascripts/stateStore';
import PlayerDashboard from '@/components/playerDashboard/PlayerDashboard.vue';

export default defineComponent({

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
        PlayerDashboard
    },

    data() {

        return {
        }
    },

    mounted() {
        
        this.checkForGameinProgress();
        
    },

    methods: {
        
        checkForGameinProgress() {
            
            // call function to check for game in localStorage (handleLs.handleLs() also creates localStorage objects if available and none exist)
            if(handleLs.handleLs()) {
                // console.log("local storge objects of existing game was present");
                // this.$refs.playerDashboard.mainGameLoop()
                // if approveRestoreGame() {restoreGame()}
                console.log('game found')
                // console.log(typeof(this.gameLogic))
                return;
            }
            else {
                console.log('game not found')
                // this.$refs.playerDashboard.mainGameLoop()
            };
            
            
        }
    }
});

</script>
<style lang="scss">


</style>

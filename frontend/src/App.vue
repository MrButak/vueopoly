<template>
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->

  <router-view/>
</template>
<script>

import { defineComponent } from 'vue';
const handleLs = require('../src/javascripts/handleLs')
import { vueGlobalState } from '../src/javascripts/stateStore';

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
        
        this.checkForGameinProgress();
        
    },

    methods: {
        
        checkForGameinProgress() {
            
            // call function to check for game in localStorage (handleLs.handleLs() also creates localStorage objects if available and none exist)
            if(handleLs.handleLs()) {
                console.log("local storge objects of existing game was present");
                console.log(this.players);
                console.log("saved players");
                // console.log(this.vueopoly.properties[0].id)
                // if approveRestoreGame() {restoreGame()}
                return;
            };
            
        }
    }
});

</script>
<style lang="scss">


</style>

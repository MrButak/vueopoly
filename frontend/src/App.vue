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

        const { lsInUse, players } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players
            
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
            
            if(handleLs.handleLs()) {
                console.log("local storge objects of existing game was present");
                // if approveRestoreGame() {restoreGame()}
                // else initNewGame()
                return;
            };
            // console.log(this.lsInUse)
            // console.log(this.players)
            // initNewGame()
        }
    }
});

</script>
<style lang="scss">


</style>

<template>

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
            
            
        }
    },

    mounted() {
        
       
        
    },

    methods: {

    }
});

</script>


<style scoped lang="scss">

</style>

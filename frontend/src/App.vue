<template>
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->

  <router-view/>
</template>
<script>
const handleLs = require('../src/javascripts/handleLs')
import { defineComponent } from 'vue';
import { vueGlobalState } from '../src/javascripts/stateStore';
export default defineComponent({
    setup() {

        //const handleLs = handleLs();
        const { lsInUse } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            //handleLs
        }
    },

    data() {

        return {
        }
    },

    mounted() {
        
        handleLs.handleLs();
        console.log(this.lsInUse)
    },

    methods: {
    
    }
});

</script>
<style lang="scss">



</style>

<template>
<div v-if="this.players === 0 || this.players === null" class="new-game-wrapper-main">
    <div class="new-game-title">
        <h3>Welcome to Vueopoly</h3>
    </div>
    <ChoosePlayers />
</div>
</template>

<script>
import ChoosePlayers from '@/components/ChoosePlayers.vue';
import { defineComponent } from 'vue';
import { vueGlobalState } from '../../src/javascripts/stateStore';


export default defineComponent({

    setup() {

        const { lsInUse, players, vueopoly } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly
        }
    },
    components: {
        ChoosePlayers
    },

    data() {

        return {
            
            playerCount: null
        }
    },

    mounted() {
        
        
        
    },

    methods: {
    }
})
</script>
<style scoped>

</style>
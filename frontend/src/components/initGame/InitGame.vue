<template>
<!-- if no saved game was found -->
<div v-if="this.players === 0 || this.players === null" class="new-game-wrapper-main">
    <div class="new-game-title">
        <h3>Welcome to Vueopoly</h3>
    </div>
    <ChoosePlayers />
</div>
<!-- <div v-else class="new-game-wrapper-main">
    <p>save game found</p>
    <p>continue game?</p>
    <p>start new game?</p>
</div> -->
</template>

<script>
import ChoosePlayers from '@/components/initGame/ChoosePlayers.vue';
import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

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
.new-game-wrapper-main {

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    
    border: 1px solid black;
}
/* needs to be targeted to the h3*/ 
.new-game-title {
    margin: 0;
    padding: 0;
}

</style>
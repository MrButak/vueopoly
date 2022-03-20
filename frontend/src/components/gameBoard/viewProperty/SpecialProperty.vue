<template>

<div class="border-wrapper">
    <h2 class="property-name">{{ this.propertyName }}</h2>

    <p class="align-center"></p>

    <div class="rent-price-wrapper">
        <div class="name-price-wrapper">
            <text>test</text>
        </div>
    </div>

    
    <small class="align-center">test</small>

    <div class="player-data-wrapper">
        <div class="name-price-wrapper">
            <small>test</small><small>test</small>
        </div>
    </div>
    

</div>  
</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({
    name: 'RailRoadProperty',
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

            propertyName: "",
            propertyDescription: "",
            
        }
    },
    mounted() {
       
    },

    methods: {

        // Function (called from ViewProperty.vue) gets current 'view property' information from this.vueopoly object
        setPropertyData(property) {
            this.propertyName = property.name
            
            console.log("made it to special")
            console.log(property)
            
        }
    }
});

</script>


<style scoped lang="scss">

.border-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    padding: 10px;
}
.name-price-wrapper {
    display: flex;
    justify-content: space-between;
    
}

.rent-price-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    gap: 6px;

}
.player-data-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
}

</style>
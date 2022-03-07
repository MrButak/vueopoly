<template>

<div class="border-wrapper">
    <h2>{{ this.propertyName }}</h2>

    <p class="align-center">Price ${{ this.price }}</p>

    <div class="rent-price-wrapper">
        <div class="name-price-wrapper">
            <text>Rent</text><text>$25</text>
        </div>
        
     <div class="name-price-wrapper">
            <text>If 2 RR's are owned</text><text>$50</text>
        </div>

        <div class="name-price-wrapper">
            <text>If 3 ""  ""  ""</text><text>$100</text>
        </div>

        <div class="name-price-wrapper">
            <text>If 4 ""  ""  ""</text><text>$200</text>
        </div>
    </div>

    
    
    <small class="align-center">Morgage Value {{this.price / 2 }}</small>

    <div class="player-data-wrapper">
        <div class="name-price-wrapper">
            <small>Owned By:</small><small>xx</small>
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
            price: 0
        }
    },
    mounted() {
       
    },

    methods: {

        // Function (called from ViewProperty.vue) gets current 'view property' information from this.vueopoly object
        setPropertyData(property) {
            this.propertyName = property.name
            this.price = property.price;
            console.log("made it to rr")
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
<template>

<div class="border-wrapper">
    <h2>{{ this.propertyName }}</h2>

    <p class="align-center">Cost ${{ this.price }}</p>

    <div class="rent-price-wrapper">
       
            <text>&emsp;If ONE "Utility" is</text>
            <text>owned, rent is 4 times</text>
            <text>amount shown on dice.</text>
            <text>&emsp;If BOTH "Utilities"</text>
            <text>are owned, rent is 10</text>
            <text>times amount shown</text>
            <text>on dice.</text>
    </div>

    <small class="align-center">Morgage Value $75</small>

    <div class="player-data-wrapper">
        <div class="name-price-wrapper">
            <small>Owned By:</small><small>33sdssd</small>
        </div>
    </div>
    

</div>  
</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({
    name: 'UtilityProperty',
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
            
            console.log(property)
            this.propertyName = property.name;
            this.price = property.price;       
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
.align-center {
    text-align: center;
}
.rent-price-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0 10px 10px 10px;
    gap: 2px;

}

.player-data-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

</style>
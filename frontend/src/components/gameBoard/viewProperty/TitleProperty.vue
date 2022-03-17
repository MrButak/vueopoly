<template>
    <h2><small>title deed</small><br />{{ this.propertyName }}</h2>

    <p class="align-center">Rent ${{ this.rent }}</p>

    <div class="rent-price-wrapper">
        <div class="name-price-wrapper">
            <text>With 1 House</text><text>{{ this.multpliedrent.rentWith1House }}</text>
        </div>
        
     <div class="name-price-wrapper">
            <text>With 2 Houses</text><text>{{ this.multpliedrent.rentWith2House }}</text>
        </div>

        <div class="name-price-wrapper">
            <text>With 3 Houses</text><text>{{ this.multpliedrent.rentWith3House }}</text>
        </div>

        <div class="name-price-wrapper">
            <text>With 4 Houses</text><text>{{ this.multpliedrent.rentWith4House }}</text>
        </div>
    </div>

    <p class="align-center">With HOTEL {{ this.multpliedrent.rentWith5House }}</p>
    
    <small class="align-center">Morgage Value $110</small>

    <div class="player-data-wrapper">
        <div class="name-price-wrapper">
            <small>Owned By:</small><small>{{ this.ownedBy }}</small>
        </div>
        <div class="name-price-wrapper">
            <small>Houses:</small><small>{{ this.buildingCount}}</small>
        </div>
    </div>

</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({
    name: 'TitleProperty',
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

            cardColor: "",
            propertyName: "",
            rent: 0,
            multpliedrent: {},
            ownedBy: "",
            buildingCount: 0,
            isMortgaged: null
        }
    },
    mounted() {
       
    },

    methods: {

        // Function (called from ViewProperty.vue) gets current 'view property' information from this.vueopoly object
        setPropertyData(property) {
            
            this.propertyName = property.name;
            this.rent = property.rent;
            this.buildingCount = property.buildings;
            this.isMortgaged = property.mortgaged;

            // add rent prices with houses to this.multpliedrent Object
            let tmpCnt = 1;
            Object.keys(property.multpliedrent).forEach((item) => {
                this.multpliedrent[`rentWith${tmpCnt}House`] = property.multpliedrent[item];
                tmpCnt++;
            });

            if(property.ownedby == -1) {
                this.ownedBy = "none";
            }
            else {
                this.ownedBy = property.ownedby.name;
            };

            // set card color from property obj
            this.cardColor = property.group.toLowerCase;
            
           
        }
 
    }
});

</script>


<style scoped lang="scss">

.name-price-wrapper {
    display: flex;
    justify-content: space-between;
    
}

.rent-price-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    gap: 2px;

}
.player-data-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
}
</style>
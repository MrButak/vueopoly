<template>
    <h2><small>title deed</small><br />{{ this.propertyName }}</h2>

    <p>is this on here/?????</p>
    
    <div class="rent-price-wrapper">
        <p class="align-center">{{ this.propertyDescription }}</p>
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
            propertyDescription: ""
        }
    },
    mounted() {
       
    },

    methods: {

        // Function (called from ViewProperty.vue) gets current 'view property' information from this.vueopoly object
        setPropertyData(property) {
            
            console.log(property)

            this.propertyName = property.name;
            switch(property.id.toLowerCase()) {

                case 'electriccompany':
                    this.propertyDescription = 'If one utility is "owned...."'
                    return;
                    
                case 'waterworks':
                    this.propertyDescription = "Water works"
                    return;
                    
            }

            

       
        }
    }
});

</script>


<style lang="scss">

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

h2 {
    text-align: center;
    /* background-color: red;*/
    color: black;
    padding: 20px;
    margin: 0;
    border: 2px solid black;

    small {
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 2px;
    }
}


</style>
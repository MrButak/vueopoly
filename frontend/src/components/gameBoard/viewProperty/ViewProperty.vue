<template>
<div class="modal">
    <div class="modal-content">
        
        <div class="box">

            <TitleProperty ref="titleProperty" />
            <UtilityProperty ref="utilityProperty" />
        </div>
        
    </div>   
</div>
</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';
import TitleProperty from '@/components/gameBoard/viewProperty/TitleProperty.vue';
import UtilityProperty from '@/components/gameBoard/viewProperty/UtilityProperty.vue';
export default defineComponent({
    name: 'ViewProperty',
    setup() {

        const { lsInUse, players, vueopoly } = vueGlobalState();
        return { // make it available in <template>
            lsInUse,
            players,
            vueopoly
        }
    },
    components: {
        
        TitleProperty,
        UtilityProperty
    },

    data() {
        return {

        }
    },
    mounted() {

        this.setViewModal();
    },

    methods: {

        setViewModal() {
            this.modal = document.querySelector(".modal");
            this.trigger = document.querySelector(".trigger");
            this.closeButton = document.querySelector(".close-button");
            // click outside of modal to hide
            window.addEventListener("click", this.windowOnClick); 
        },

        toggleModal() {
            this.modal.classList.toggle("show-modal");
        },

        // Function will hide modal if area outside of modal is clicked
        windowOnClick(event) {
            if (event.target === this.modal) {
                this.toggleModal();
                
            }
        },
        // Function (called from GameBoard.vue) gets current 'view property' information from this.vueopoly object
        getPropertyData (propertyId) {
            console.log(propertyId)
            // console.log(this.vueopoly.properties)
            let propertyIndex = this.vueopoly.properties.findIndex(each => each.id == propertyId);
            let property = this.vueopoly.properties[propertyIndex];
            console.log(this.vueopoly.properties, "the final one")
            // console.log(propertyId, "here")
            switch(property.group.toLowerCase()) {

                case 'special':
                   
                case 'railroad':
                   
                case 'utilities':
                    this.$refs.utilityProperty.setData(property);
                    return;
                default:
                    this.$refs.titleProperty.setPropertyData(property);
                    return;
            }      

            
            
        },
        
    }
});

</script>


<style lang="scss">

.modal {
    z-index: 2;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}
.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.show-modal {
    opacity: 1;
    visibility: visible;
    transform: scale(1.0);
    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
.close-button {
    display: none;
}



body {
  font-family: 'Montserrat', sans-serif;
  color: #444444;
  font-size:1em;
  box-sizing:border-box;
}
hr {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}



.box {
    display: flex;
    flex-direction: column;
    
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 1px 1px 1px #ccc;
    background-color:white;
  }
h2 {
    text-align: center;
    background-color: red;
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
  .align-center {
    text-align: center;
  }


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
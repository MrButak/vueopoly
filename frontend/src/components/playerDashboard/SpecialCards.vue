<template>
<div class="special-card-modal">
    <div class="special-card-modal-content">
        <div class="special-card-box">
            <p> This is my special card</p>
            <p> This is my special card</p>
            <p> This is my special card</p>
            <p> This is my special card</p>

        </div>
    </div>
</div>
</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

export default defineComponent({

    name: 'SpecialCards',

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
            
            specialCardmodal: null,
            specialCardTrigger: null,
            closeButton: null,
        }
    },

    mounted() {
        
        
       this.setViewModal();
        
    },

    methods: {

        
        showSpecialCard() {
            console.log("ok we're making it here special cards")
            console.log(this.specialCardTrigger)
            this.specialCardTrigger.click()
        },


        setViewModal() {

            this.specialCardModal = document.querySelector(".special-card-modal");
            // this.closeButton = document.querySelector(".close-button");

            // click outside of modal to hide
            window.addEventListener("click", this.windowOnClick); 
        },

        toggleModal() {
            
            // TODO can take as argument 'chance' or 'communitychest', then set this.argument and use variable to show which card
            // set dom variable, take as argument
            
            this.specialCardModal.classList.toggle("special-card-show-modal");
        },

        // Function will hide modal if area outside of modal is clicked
        windowOnClick(event) {
            if (event.target === this.specialCardModal) {
                this.toggleModal();
                
            }
        }
    }
});

</script>


<style scoped lang="scss">
/* special cards */
.special-card-modal {
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
.special-card-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.special-card-show-modal {
    opacity: 1;
    visibility: visible;
    transform: scale(1.0);
    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
.special-card-box {
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 500px;
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 1px 1px 1px #ccc;
    background-color:white;
}
</style>

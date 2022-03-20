<!-- Handles chance and community chest -->
<template>
<div class="special-card-modal">
    <div class="special-card-modal-content">
               
        <div class="container">
            <div class="card">
                <h1 class="card-type">{{this.cardType}}</h1>
                <h2 class="card-desc">{{this.cardDesc}}</h2>
                <!-- <p class="card-sub">this card may be kept until needed, or sold</p> -->
                <div class="card-image">
                    <!-- TODO: add svg as vue component -->
                </div>
            </div>
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

            // dom stuff
            cardType: "",
            cardDesc: ""
        }
    },

    mounted() {
        
       this.setViewModal();
    },

    methods: {

        setViewModal() {

            this.specialCardModal = document.querySelector(".special-card-modal");
            // this.closeButton = document.querySelector(".close-button");

            // click outside of modal to hide
            window.addEventListener("click", this.windowOnClick); 
        },

        setViewData(cardData, crntSpecialCard) {

            switch(cardData[0]) {

                case 'chance':
                    this.cardType = "chance";
                    this.cardDesc = crntSpecialCard.title;

                case 'communitychest':
                    this.cardType = "Community Chest";
                    this.cardDesc = crntSpecialCard.title;
            }
             
            


            this.toggleModal()

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
    width: 100%;
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




/* card design   */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  background-color: #E0F7FA;
}

.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  height: 250px;
  width: 420px;
  background: #F57F17;
  padding: 25px;
  background: radial-gradient(rgb(255, 171, 145), #F57F17);
/*   box-shadow: 2px 8px 6px gray,
               0px 10px 8px white;*/
  position: relative;
}

.card-type {
  font-family: 'Pacifico', cursive;
  margin-bottom: 2rem;
}

.card-desc,
.card-sub {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
}

.card-desc {
  font-size: 1.45rem;
  margin-bottom: 2.2rem;
  border: none;
  background-color: none;
}

.card-sub {
  font-size: 0.9rem;
}

.card-image {
  position: absolute;
  top: 40px;
  left: 250px;
}

.card-image svg {
    opacity: 0;
    animation: slide-in 500ms linear forwards;
}

@keyframes slide-in {
  from {
    opacity: 0;
    margin-left: 25%;
  }

  to {
    margin-left: 0%;
    opacity:1;
  }
}
</style>

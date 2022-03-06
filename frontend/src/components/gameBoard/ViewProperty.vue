<template>
    <div class="modal">
        <div class="modal-content">
            <p>Here's the modal</p>
            <p>Here's the modal</p>
            <p>Here's the modal</p>
            <p>Here's the modal</p>
            <p>Here's the modal</p>
        </div>
        
    </div>
</template>


<script>

import { defineComponent } from 'vue';
import { vueGlobalState } from '/src/javascripts/stateStore';

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
        
    },

    data() {
        return {

            modal: null,
            trigger: null,
            closeButton: null
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
    }
});

</script>


<style scoped>
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
    background-color: white;
    padding: 1rem;
    max-width: 93%;
    border-radius: 0.5rem;
    border: 1px solid black;
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

</style>
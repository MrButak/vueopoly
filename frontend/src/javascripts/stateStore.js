import { ref } from 'vue';
const vueopoly = ref({});
const players = ref([]); // array of objs
const lsInUse = ref(false);
const gameLogic = ref({})

export const vueGlobalState = function() {

  // other functions, for example to mutate message ref
  
    return {
        vueopoly,
        players,
        lsInUse,
        gameLogic
    };
};
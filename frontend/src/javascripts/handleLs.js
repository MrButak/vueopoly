const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players } = vueGlobalState();

// Function handles all function calls below
exports.handleLs = () => {

    if(checkLsAvailable()) {
        // if local storge for game already in use, set global state from local storage
        if(localStorage.getItem('players') !== '0' &&
        localStorage.getItem('players') !== null) {
            restoreLs();
            return true;
        };
        // if no game local storage in use, set local storage
        setLs()
        return false;
    };
    return false;
};

// Function checks if local storage is available for use on browser
let checkLsAvailable = () => {
    //console.log(lsInUse.value, "hereffff")

    try {
        localStorage.setItem('test', 'is local storage available?');
        localStorage.removeItem('test');
        lsInUse.value = true; // set global state
        return true;
    }
    // local storage not available
    catch (error) {
        console.log(error)
        lsInUse.value = false; // set global state
        return false;
    };
};

// Function sets local storage objects if doesn't exist
let setLs = () => {

    localStorage.setItem("vueopoly", "");
    localStorage.setItem("players", "0");
    // initially set global state to 0 so I know wether to start a new game (ChoosePlayers.vue)
    players.value = 0;
    return;
};

// Function restores global state variables from local storage variables
let restoreLs = () => {

    // convert local storage string to object
    let lsVueopoly = localStorage.getItem('vueopoly');
    lsVueopoly = JSON.parse(lsVueopoly);
    let lsPlayers = localStorage.getItem('players');
    lsPlayers = JSON.parse(lsPlayers);

    // set global state variables
    vueopoly.value = lsVueopoly;
    players.value = lsPlayers;
    return;
};

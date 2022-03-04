const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players } = vueGlobalState();

// Function handles all function calls below
exports.handleLs = () => {

    if(checkLsAvailable) {
        // if local storge for game already in use, set global state from local storage
        if(localStorage.vueopoly) {
            restoreLs();
            return;
        };
        setLs()
        return;
    };
    return;
};

// Function checks if local storage is available for use on browser
exports.checkLsAvailable = () => {

    let tmpStr = "is local storage available?";

    try {
        localStorage.setItem("test", tmpStr);
        console.log(localStorage.test)
        localStorage.removeItem(test);
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
exports.setLs = () => {

    localStorage.setItem("vueopoly", "");
    localStorage.setItem("players", "");
    return;
};

// Function restores global state variables from local storage variables
exports.restoreLs = () => {

    // convert local storage string to object
    let lsVueopoly = localStorage.getItem("vueopoly");
    lsVueopoly = JSON.parse(lsVueopoly);
    let lsPlayers = localStorage.getItem("players");
    lsPlayers = JSON.parse(lsPlayers);

    // set global state variables
    vueopoly.value = lsVueopoly;
    players.value = lsPlayers;
    return;
};

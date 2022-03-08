const { vueGlobalState } = require('../javascripts/stateStore');
const { lsInUse, vueopoly, players, gameLogic } = vueGlobalState();

exports.getCrntPlayer = () => {

    return(gameLogic.value.whosTurn)
};
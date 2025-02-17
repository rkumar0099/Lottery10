const lottery_abi = require('./contracts/Lottery.json');
var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');
const LOTTERY_CONTRACT_ADDR = "0xB4112ed1c7A72eb94541a4f14FFe516347dE597F";

export {
    LOTTERY_CONTRACT_ADDR,
    lottery_abi,
    ETH_WEI
}

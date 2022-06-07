
/*
const AmtCollector = artifacts.require('AmtCollector');
const GAS = 1000000;

contract('AmtCollector', async (accounts) => {
    //let instance = await AmtCollector.deployed();

    it('check owner', async() => {
        let instance = await AmtCollector.deployed();
        const owner = await instance.getOwner.call();
        assert.equal(owner, accounts[0], 'Owner do not match');
    });
    
    it ('Add Amt', async() => {
        let instance = await AmtCollector.deployed();
        await instance.addAmt({
            from: accounts[0],
            value: GAS,
            gas: GAS,
        });
        const val = await instance.getAmt.call();
        assert .equal(val, GAS, 'Amt is not equal to value added');
    });

    it('Transfer Amt', async() => {
        let instance = await AmtCollector.deployed();
        await instance.addAmt({
            from: accounts[0],
            value: GAS,
            gas: GAS,
        });
        let bal = await instance.balanceOf(accounts[1]);
        console.log('Initial Bal: ', bal);

        await instance.transferAmt(accounts[1], GAS);
        const res = await instance.getAmt.call();
        //console.log(res);
        assert.equal(res, GAS, 'amt not equal');

        bal = await instance.balanceOf(accounts[1]);
        console.log('Final Bal: ', bal);

    });

});

*/
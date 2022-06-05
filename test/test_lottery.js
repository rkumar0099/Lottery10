
/*
const Lottery = artifacts.require("Lottery");


contract("Lottery", accounts => {

    it ('Add Member', async () => {
        let instance = await Lottery.deployed();
        await instance.addMember(accounts[1], 'Rabindar', 1);
        const Id = await instance.getId.call(accounts[1]);
        assert .equal(Id, 1, 'Ids not match');
    });

    it('Duplication', async() => {
        let instance = await Lottery.deployed();
        await instance.addMember(accounts[1], 'Rabindar', 1);
        const Id = await instance.getId.call(accounts[1]);
        assert .equal(Id, 1, 'Ids not match');
        await instance.addMember(accounts[1], 'Rabindar', 1);
        const num = await instance.numPeers.call();
        assert .equal(num, 1, 'Duplicate members added');
    });

    
    it ('Add all members', async () => {
        let instance = await Lottery.deployed();
        var i = 0;
        while (i < accounts.length) {
            await instance.addMember(accounts[i], 'Rabi', 1);
            i += 1;
        }
        const num = await instance.numPeers.call();
        assert.equal(num, 10, 'Failed');
    });

    it ('Deciding lottery winner', async() => {
        let instance = await Lottery.deployed();
        var i = 0;
        while (i < accounts.length) {
            await instance.addMember(accounts[i], 'Rabi', 1);
            i += 1;
        }
        const num = await instance.numPeers.call();
        assert.equal(num, 10, 'Failed');

        var seed = Math.floor(Math.random() * 11);
        if (seed === 0) {
            seed += 1;
        }
        await instance.draw(seed);
        const rnd = await instance.roundCompleted.call();
        const winner = await instance.getWinner.call(rnd);
        console.log(winner);
        assert.equal(winner, accounts[seed  - 1], 'Winners do not match');
    });

    it ('Checking Reset', async() => {
        let instance = await Lottery.deployed();
        var i = 0;
        while (i < accounts.length) {
            await instance.addMember(accounts[i], 'Rabi', 1);
            i += 1;
        }
        var num = await instance.numPeers.call();
        assert.equal(num, 10, 'Failed');

        var seed = Math.floor(Math.random() * 11);
        if (seed === 0) {
            seed += 1;
        }
        await instance.draw(seed);
        num = await instance.numPeers.call();
        assert .equal(num, 0, 'Num Peers are not zero after reset');
    });
    
});

*/
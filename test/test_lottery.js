const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {
    const sender = accounts[0];

    
    it('Check owner', async () => {
        let instance = await Lottery.deployed();
        const owner = await instance.getOwner.call();
        console.log(owner);
        assert.equal(owner, sender, 'Owner init not same');
        for(var i = 0; i < 10; i ++) {
            console.log(i + ". " + accounts[i]);
        }
    });


    it ('Add Member', async () => {
        let instance = await Lottery.deployed();
        await instance.addMember(accounts[1], 'Rabindar', 1);
        const Id = await instance.getId.call(accounts[1]);
        assert.equal(Id, 1, 'Ids not match');
    });


    it('Duplication', async() => {
        let instance = await Lottery.deployed();
        await instance.addMember(accounts[1], 'Rabindar', 1);
        const num = await instance.numPeers.call();
        assert.equal(num, 1, 'Duplicate members added');
    });

    
    it ('Add all members', async () => {
        let instance = await Lottery.deployed();
        var i = 0;
        while (i < accounts.length) {
            await instance.addMember(accounts[i], 'Rabi', 1);
            i += 1;
        }
        const num = await instance.numPeers.call();
        assert.equal(num, 10, 'Num of peers not equal to 10');
        const total = await instance.totalFunds.call();
        assert.equal(total, 10, 'Total funds not equal to 10');
    });
    

    it ('Deciding lottery winner', async() => {
        let instance = await Lottery.deployed();

        var i = 0;
        while (i < accounts.length) {
            await instance.addMember(accounts[i], 'Rabi', 1);
            i += 1;
        }
        

        var seed = Math.floor(Math.random() * 10);
        var index = seed;
        seed += 1;
        console.log('Seed: ', seed);
        console.log('Index: ', index);

        let expected_winner = {
            "addr": accounts[index],
            "rnd": 1,
            "amt": 10,
        }
        console.log('Expected Winner ', expected_winner);

        await instance.draw(seed);
        const winner = await instance.getWinner.call(1);
        assert.equal(winner["addr"], accounts[index], 'Winner addr do not match');
        assert.equal(winner["rnd"], 1, 'Winner round do not match');
        assert.equal(winner["amt"], 10, 'Winner amt do not match');
       
    });


    it ('Checking Reset', async() => {
        let instance = await Lottery.deployed();
        num = await instance.numPeers.call();
        assert .equal(num, 0, 'Num Peers are not zero after reset');
    });
    
});

const hre = require('hardhat');

async function Main(){
    const tradeFactory = await hre.ethers.getContractFactory('Trade');
    const trade = await tradeFactory.deploy();
    await trade.waitForDeployment();
    console.log(await trade.getAddress())
}

Main().catch((err) => {
    console.log(err);
    process.exit(1);
})
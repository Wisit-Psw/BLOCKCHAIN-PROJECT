const hre = require("hardhat");

async function main() {
  try {

    const TradeContract = await hre.ethers.getContractFactory("Trade");
    

    const contractAddress = "0x5D1f51CA6f94C877dB172533d5F4c84a6f1A2E3c"; // deployed contract address
    const contract = await TradeContract.attach(contractAddress);
 

    const amount = await contract.getLendCredit('0x00000000000000007465737478617366', '0x00000000000000007465737478617366');;
    console.log("amount:", amount);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
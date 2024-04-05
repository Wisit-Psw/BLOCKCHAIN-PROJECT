require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        `0xfd648b28f02807d8fda06c658915c636327f48ca711895269da9544e1fda2078`,
      ],
    }
  },
};

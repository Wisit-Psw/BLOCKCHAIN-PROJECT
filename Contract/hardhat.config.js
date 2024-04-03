require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        `0x4a22eff947c423257ac5ca868d39cd9e53c77cf62cbed3126f4488d2e6ce4320`,
      ],
    }
  },
};

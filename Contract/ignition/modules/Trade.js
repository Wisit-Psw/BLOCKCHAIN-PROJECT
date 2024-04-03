const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TradeModule", (m) => {

  const trade = m.contract("Trade");

  return { trade };
});

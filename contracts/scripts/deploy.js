const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbChainTraceability Smart Contract to Polygon...");

  const HerbChain = await hre.ethers.getContractFactory("HerbChainTraceability");
  const herbChain = await HerbChain.deploy();

  await herbChain.waitForDeployment();

  const contractAddress = await herbChain.getAddress();
  console.log(`HerbChainTraceability deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";
import { SuperSimpleLogic } from "../typechain-types"

async function main() {
  const [deployer] = await ethers.getSigners()
  const SuperSimpleLogic = await ethers.getContractFactory("SuperSimpleLogic");
  const logic = await SuperSimpleLogic.deploy()
  await logic.deployed()

  const SuperSimpleProxy = await ethers.getContractFactory("SuperSimpleProxy");
  const proxy = await SuperSimpleProxy.deploy(logic.address);

  await proxy.deployed();
  const proxyAsLogic = SuperSimpleLogic.attach(proxy.address)

  console.log(`\nLogic:      ${logic.address}`)
  console.log(`Proxy:      ${proxy.address}`)
  console.log(`EOA sender: ${deployer.address}`)
  console.log("\ncalling \"SuperSimpleLogic.doSomething(42)...\"")
  await proxyAsLogic.doSomething(42, { value: ethers.utils.parseEther("1") });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";
import { SimpleLogic } from "../typechain-types"

async function main() {
  const [deployer] = await ethers.getSigners()
  const SimpleLogic = await ethers.getContractFactory("SimpleLogic");
  const logic = await SimpleLogic.deploy()
  await logic.deployed()

  const SimpleProxy = await ethers.getContractFactory("SimpleProxy");
  const proxy = await SimpleProxy.deploy(logic.address);

  await proxy.deployed();
  const proxyAsLogic = SimpleLogic.attach(proxy.address)

  console.log(`\nLogic:      ${logic.address}`)
  console.log(`Proxy:      ${proxy.address}`)
  console.log(`EOA sender: ${deployer.address}`)

  console.log(`\nSimpleLogic.someVariable before: ${await proxyAsLogic.someVariable()}`)
  console.log("calling \"SimpleLogic.doSomething(42)...\"")
  await proxyAsLogic.doSomething(42, { value: ethers.utils.parseEther("1") });
  console.log(`SimpleLogic.someVariable after: ${await proxyAsLogic.someVariable()}`)

  console.log(`\nSimpleLogic.getThisAddress: ${await proxyAsLogic.getThisAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

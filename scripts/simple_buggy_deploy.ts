import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners()
  const SimpleBuggyLogic = await ethers.getContractFactory("SimpleBuggyLogic");
  const logic = await SimpleBuggyLogic.deploy()
  await logic.deployed()

  const SimpleBuggyProxy = await ethers.getContractFactory("SimpleBuggyProxy");
  const proxy = await SimpleBuggyProxy.deploy(logic.address);

  await proxy.deployed();
  const proxyAsLogic = SimpleBuggyLogic.attach(proxy.address)

  console.log(`\nLogic:      ${logic.address}`)
  console.log(`Proxy:      ${proxy.address}`)
  console.log(`EOA sender: ${deployer.address}`)

  console.log(`\nProxy.someVariable before: ${await proxyAsLogic.someVariable()}`)
  console.log("calling \"SimpleBuggyLogic.setVariable(42)...\"")
  await proxyAsLogic.setVariable(42, { value: ethers.utils.parseEther("1") });
  console.log(`Proxy.someVariable after: ${await proxyAsLogic.someVariable()}`)

  console.log(`\nSimpleBuggyLogic.getThisAddress: ${await proxyAsLogic.getThisAddress()} is the address of the Proxy contract`)

  console.log(`\nNow deploy a new Logic contract and upgrade the Proxy to use it...`)

  const newLogic = await SimpleBuggyLogic.deploy()
  await newLogic.deployed()

  console.log(`Logic address before: ${await proxy.logicContract()}`)
  console.log(`Calling proxy.upgrade(newLogic.address)...`)
  await proxy.upgrade(newLogic.address)
  console.log(`Logic address after:  ${await proxy.logicContract()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners()
  const Logic = await ethers.getContractFactory("Logic");
  const logic = await Logic.deploy()
  await logic.deployed()

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(logic.address);

  await proxy.deployed();
  const proxyAsLogic = Logic.attach(proxy.address)

  console.log(`\nLogic:      ${logic.address}`)
  console.log(`Proxy:      ${proxy.address}`)
  console.log(`EOA sender: ${deployer.address}`)

  console.log(`\nfirst, we need to initialize the Proxy contract...`)
  console.log("calling \"Logic.initialize(1, 2)...\"")
  await proxyAsLogic.initialize(2)
  console.log(`...Proxy initialized`)

  console.log(`\nProxy.someVariable before: ${await proxyAsLogic.someVariable()}`)
  console.log("calling \"Logic.setVariable(42)...\"")
  await proxyAsLogic.setVariable(42, { value: ethers.utils.parseEther("1") });
  console.log(`Proxy.someVariable after: ${await proxyAsLogic.someVariable()}`)

  console.log(`\nLogic.getThisAddress: ${await proxyAsLogic.getThisAddress()} is the address of the Proxy contract`)

  console.log(`\nNow deploy a new Logic contract and upgrade the Proxy to use it...`)

  const newLogic = await Logic.deploy()
  await newLogic.deployed()

  console.log(`Logic address before: ${await proxyAsLogic.getLogicAddress()}`)
  console.log(`Calling proxyAsLogic.upgrade("${newLogic.address}")...`)
  await proxyAsLogic.upgrade(newLogic.address)
  console.log(`Logic address after:  ${await proxyAsLogic.getLogicAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners()
  const ImmutableLogic = await ethers.getContractFactory("ImmutableLogic");
  const logic = await ImmutableLogic.deploy(42)
  await logic.deployed()

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(logic.address);

  await proxy.deployed();
  const proxyAsLogic = ImmutableLogic.attach(proxy.address)

  console.log(`\nLogic:      ${logic.address}`)
  console.log(`Proxy:      ${proxy.address}`)
  console.log(`EOA sender: ${deployer.address}`)

  console.log(`\nfirst, we need to initialize the Proxy contract...`)
  console.log("calling \"ImmutableLogic.initialize(1, 2)...\"")
  await proxyAsLogic.initialize(2, 3)
  console.log(`...Proxy initialized`)

  console.log(`\nProxy.someVariable before: ${await proxyAsLogic.someVariable()}`)
  console.log("calling \"ImmutableLogic.setVariable(42)...\"")
  await proxyAsLogic.setVariable(42, { value: ethers.utils.parseEther("1") });
  console.log(`Proxy.someVariable after: ${await proxyAsLogic.someVariable()}`)

  console.log(`\nLogic.getThisAddress: ${await proxyAsLogic.getThisAddress()} is the address of the Proxy contract`)

  console.log(`\nNow deploy a new ImmutableLogic contract and upgrade the Proxy to use it...`)

  const newLogic = await ImmutableLogic.deploy(42)
  await newLogic.deployed()

  console.log(`ImmutableLogic address before: ${await proxyAsLogic.getLogicAddress()}`)
  console.log(`Calling proxyAsLogic.upgrade("${newLogic.address}")...`)
  await proxyAsLogic.upgrade(newLogic.address)
  console.log(`ImmutableLogic address after:  ${await proxyAsLogic.getLogicAddress()}`)

  console.log("foo:", await proxyAsLogic.foo())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [deployer, collegeAccount] = await ethers.getSigners();

  console.log("----------------------------------------------------");
  console.log("Deploying contract with Ministry Admin account:", deployer.address);
  console.log("Assigning College Verifier account:", collegeAccount.address);

  const ScholarshipTracker = await ethers.getContractFactory("ScholarshipTracker");
  const scholarshipContract = await ScholarshipTracker.deploy(collegeAccount.address);

  await scholarshipContract.waitForDeployment();

  const contractAddress = await scholarshipContract.getAddress();

  console.log("----------------------------------------------------");
  console.log("SUCCESS! ScholarshipTracker deployed to:", contractAddress);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
import { ethers } from "ethers";
import ScholarshipTrackerArtifact from "./abi/ScholarshipTracker.json";

const ScholarshipTrackerABI = ScholarshipTrackerArtifact.abi;

// ---------------------------------------------------------------------------
// Provider — connects to the local Hardhat / JSON-RPC node
// ---------------------------------------------------------------------------
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;

if (!RPC_URL) {
  throw new Error("Missing NEXT_PUBLIC_RPC_URL in environment variables");
}
if (!CONTRACT_ADDRESS) {
  throw new Error("Missing CONTRACT_ADDRESS in environment variables");
}

export const provider = new ethers.JsonRpcProvider(RPC_URL);

// ---------------------------------------------------------------------------
// Wallets — each backed by a Hardhat default account private key
// ---------------------------------------------------------------------------
const MINISTRY_PK = process.env.MINISTRY_PRIVATE_KEY as string;
const COLLEGE_PK = process.env.COLLEGE_PRIVATE_KEY as string;

if (!MINISTRY_PK) {
  throw new Error("Missing MINISTRY_PRIVATE_KEY in environment variables");
}
if (!COLLEGE_PK) {
  throw new Error("Missing COLLEGE_PRIVATE_KEY in environment variables");
}

export const ministryWallet = new ethers.Wallet(MINISTRY_PK, provider);
export const collegeWallet = new ethers.Wallet(COLLEGE_PK, provider);

// ---------------------------------------------------------------------------
// Contract helper — returns a Contract instance bound to the given signer
// ---------------------------------------------------------------------------
export function getContract(wallet: ethers.Wallet): ethers.Contract {
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ScholarshipTrackerABI,
    wallet,
  );
}

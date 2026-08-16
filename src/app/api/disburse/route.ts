import { NextRequest, NextResponse } from "next/server";
import { getContract, ministryWallet } from "@/lib/web3";

/**
 * POST /api/disburse
 *
 * The ministry disburses scholarship funds to a verified student by
 * calling `disburseFunds(studentAddress)` through the ministry wallet.
 *
 * Body: { "studentAddress": "0x..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentAddress } = body;

    if (!studentAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required field: studentAddress" },
        { status: 400 },
      );
    }

    const { getAddress } = await import("ethers");
    const formattedAddress = getAddress(studentAddress.toLowerCase());
    const contract = getContract(ministryWallet);
    const tx = await contract.disburseFunds(formattedAddress);
    const receipt = await tx.wait();

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message.split("(")[0].trim() : "Unknown error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

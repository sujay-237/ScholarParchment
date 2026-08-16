import { NextRequest, NextResponse } from "next/server";
import { getContract, ministryWallet } from "@/lib/web3";
import { supabaseAdmin } from "@/lib/supabase";


/**
 * POST /api/allocate
 *
 * Body:
 * {
 *   "studentId": "STU20260001",
 *   "amount": "<wei-value-as-string>"
 * }
 *
 * Flow:
 * studentId
 *   → Supabase students table
 *   → wallet address
 *   → blockchain allocation
 *   → update scholarship_allocations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, amount } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: studentId" },
        { status: 400 },
      );
    }

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "Missing required field: amount" },
        { status: 400 },
      );
    }

    // 1. Find the student in Supabase (matching either id or student_id)
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .select("id, student_id, full_name, wallet_address")
      .or(`student_id.eq.${studentId},id.eq.${studentId}`)
      .limit(1)
      .maybeSingle();

    if (studentError || !student) {
      return NextResponse.json(
        {
          success: false,
          error: studentError?.message || "Student not found",
        },
        { status: 404 },
      );
    }

    if (!student.wallet_address) {
      return NextResponse.json(
        {
          success: false,
          error: "Student does not have a wallet address",
        },
        { status: 400 },
      );
    }

    // 2. Find the student's scholarship allocation record
    const { data: allocation, error: allocationError } = await supabaseAdmin
      .from("scholarship_allocations")
      .select("id, student_id, allocated_amount, token_symbol")
      .eq("student_id", student.id)
      .limit(1)
      .maybeSingle();

    if (allocationError) {
      return NextResponse.json(
        {
          success: false,
          error: allocationError.message,
        },
        { status: 500 },
      );
    }

    if (!allocation) {
      return NextResponse.json(
        {
          success: false,
          error: "No scholarship allocation record found for this student",
        },
        { status: 404 },
      );
    }

    // 3. Allocate funds on-chain using the ministry wallet
    const { getAddress } = await import("ethers");
    const formattedAddress = getAddress(student.wallet_address.toLowerCase());
    const contract = getContract(ministryWallet);

    const tx = await contract.allocateFunds(
      formattedAddress,
      { value: amount },
    );

    const receipt = await tx.wait();

    // 4. Update the Supabase allocation record
    const { error: updateError } = await supabaseAdmin
      .from("scholarship_allocations")
      .update({
        allocation_tx_hash: receipt.hash,
        allocation_block_number: receipt.blockNumber,
        allocation_status: "allocated",
        updated_at: new Date().toISOString(),
      })
      .eq("id", allocation.id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Blockchain allocation succeeded, but Supabase update failed: " +
            updateError.message,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        studentId: student.student_id,
        fullName: student.full_name,
        walletAddress: student.wallet_address,
      },
      allocation: {
        id: allocation.id,
        amount: allocation.allocated_amount,
        tokenSymbol: allocation.token_symbol,
      },
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err: any) {
    const message =
      err?.reason ||
      err?.shortMessage ||
      (err instanceof Error ? err.message.split("(")[0].trim() : "Unknown error");

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
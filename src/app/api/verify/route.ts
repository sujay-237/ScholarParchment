import { NextRequest, NextResponse } from "next/server";
import { getContract, collegeWallet } from "@/lib/web3";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/verify
 *
 * Body:
 * {
 *   "studentId": "STU20260001"
 * }
 *
 * Flow:
 * 1. Find student in Supabase
 * 2. Get wallet address
 * 3. Verify student on blockchain
 * 4. Update student_verifications in Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: studentId",
        },
        { status: 400 },
      );
    }

    // 1. Find student in Supabase (matching either id or student_id)
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
          error: "Student wallet address is missing",
        },
        { status: 400 },
      );
    }

    // 2. Find verification record
    const { data: verification, error: verificationError } =
      await supabaseAdmin
        .from("student_verifications")
        .select("id")
        .eq("student_id", student.id)
        .limit(1)
        .maybeSingle();

    if (verificationError) {
      return NextResponse.json(
        {
          success: false,
          error: verificationError.message,
        },
        { status: 500 },
      );
    }

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          error: "No verification record found for this student",
        },
        { status: 404 },
      );
    }

    // 3. Verify student on blockchain
    const { getAddress } = await import("ethers");
    const formattedAddress = getAddress(student.wallet_address.toLowerCase());
    const contract = getContract(collegeWallet);

    const tx = await contract.verifyStudent(formattedAddress);
    const receipt = await tx.wait();

    // 4. Update Supabase verification record
    const { error: updateError } = await supabaseAdmin
      .from("student_verifications")
      .update({
        verification_status: "verified",
        verification_tx_hash: receipt.hash,
        verified_at: new Date().toISOString(),
      })
      .eq("id", verification.id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Blockchain verification succeeded, but Supabase update failed: " +
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
      verification: {
        status: "verified",
      },
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message.split("(")[0].trim()
        : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
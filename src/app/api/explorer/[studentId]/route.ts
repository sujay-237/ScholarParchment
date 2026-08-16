import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { provider, CONTRACT_ADDRESS } from "@/lib/web3";

// Minimal ABI for read-only explorer queries
const EXPLORER_ABI = [
  "function students(address) view returns (uint256 allocatedAmount, bool isVerified, bool isPaid)",
  "event FundsAllocated(address indexed student, uint256 amount)",
  "event StudentVerified(address indexed student)",
  "event FundsDisbursed(address indexed student, uint256 amount)",
];

/**
 * GET /api/explorer/[studentId]
 *
 * Public Explorer endpoint that aggregates:
 * 1. Off-chain student profile from Supabase
 * 2. On-chain scholarship status from the local Hardhat blockchain
 *
 * Returns a unified view for the "Glass Pipe" public timeline.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    const { studentId } = params;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Missing studentId" },
        { status: 400 },
      );
    }

    // 1. Fetch off-chain profile from Supabase
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("student_id, full_name, college_name, course, wallet_address")
      .or(`student_id.eq.${studentId},id.eq.${studentId}`)
      .limit(1)
      .maybeSingle();

    if (studentError || !student) {
      return NextResponse.json(
        { success: false, error: studentError?.message || "Student not found" },
        { status: 404 },
      );
    }

    // 2. Fetch on-chain status from blockchain
    let onChainStatus = null;
    if (student.wallet_address && CONTRACT_ADDRESS) {
      try {
        const { Contract } = await import("ethers");
        const contract = new Contract(
          CONTRACT_ADDRESS,
          EXPLORER_ABI,
          provider,
        );
        const [allocatedAmount, isVerified, isPaid] = await contract.students(
          student.wallet_address,
        );
        onChainStatus = {
          allocatedAmount: allocatedAmount.toString(),
          isVerified,
          isPaid,
        };
      } catch (chainErr) {
        onChainStatus = {
          error: "Blockchain query failed",
          detail: (chainErr as Error).message,
        };
      }
    }

    // 3. Build timeline stages
    const stages = [
      {
        stage: "allocated",
        label: "Funds Allocated",
        completed:
          !!onChainStatus &&
          !(onChainStatus as Record<string, unknown>).error &&
          (onChainStatus as Record<string, unknown>).allocatedAmount !== "0",
      },
      {
        stage: "verified",
        label: "College Verified",
        completed:
          !!onChainStatus &&
          !(onChainStatus as Record<string, unknown>).error &&
          (onChainStatus as Record<string, unknown>).isVerified,
      },
      {
        stage: "disbursed",
        label: "DBT Disbursed",
        completed:
          !!onChainStatus &&
          !(onChainStatus as Record<string, unknown>).error &&
          (onChainStatus as Record<string, unknown>).isPaid,
      },
    ];

    return NextResponse.json({
      success: true,
      student: {
        studentId: student.student_id,
        fullName: student.full_name,
        collegeName: student.college_name,
        course: student.course,
        walletAddress: student.wallet_address,
      },
      blockchain: onChainStatus,
      timeline: stages,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

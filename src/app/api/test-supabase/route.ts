import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { success: false, error: "Missing studentId" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("students")
    .select("student_id, full_name, wallet_address")
    .eq("student_id", studentId)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}
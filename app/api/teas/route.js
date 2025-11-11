import { NextResponse } from "next/server";
import { TEAS } from "../../../lib/teas";

export async function GET() {
  return NextResponse.json(TEAS);
}


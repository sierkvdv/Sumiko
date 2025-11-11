import { NextResponse } from "next/server";
import { getTeaById } from "../../../../lib/teas";

export async function GET(_req, { params }) {
  const tea = getTeaById(params.id);
  if (!tea) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(tea);
}


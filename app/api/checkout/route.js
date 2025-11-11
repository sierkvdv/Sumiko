import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  // In real life: validate schema, persist order, call payment provider
  const checkoutId = `chk_${Math.random().toString(36).slice(2, 10)}`;
  return NextResponse.json({ ok: true, checkoutId, received: body });
}


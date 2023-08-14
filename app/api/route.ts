import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const response = { received: data, message: "Hello world!" };

  return NextResponse.json(response);
}

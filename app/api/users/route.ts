import { prisma } from "@utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

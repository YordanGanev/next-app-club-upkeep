import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // handle request body json
    const json = await request.json();

    const { email, name, picture, nickname, secret } = json;

    // validate
    if (secret !== process.env.AUTH0_HOOK_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // add user with valid input data
    if (email) {
      await prisma.user.create({
        data: { email, name, picture, nickname },
      });

      return NextResponse.json({
        message: `User with email: ${email} has been created successfully!`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

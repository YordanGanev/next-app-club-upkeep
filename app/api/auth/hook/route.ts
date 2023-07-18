import { prisma } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // handle request body json
    const json = await request.json();

    console.log(json);
    const { email, name, picture, nickname, secret } = json;

    // validate
    if (secret !== process.env.AUTH0_HOOK_SECRET) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
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

import { prisma } from "@utils/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(request.method, request.url);

    const { id } = params;

    const user = await prisma.user.update({
      where: { id },
      data: { unseenInvites: 0 },
      select: { id: true, unseenInvites: true },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.log(request.method, request.url);
    console.error(e);
    return new NextResponse(JSON.stringify(e), { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(request.method, request.url);

    const { id } = params;

    const user = await prisma.user.update({
      where: { id },
      data: { unseenInvites: { increment: 1 } },
      select: { id: true, unseenInvites: true },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.log(request.url);
    console.error(e);
    return new NextResponse(JSON.stringify(e), { status: 500 });
  }
}

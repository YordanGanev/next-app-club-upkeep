import { NextResponse } from "next/server";
import { prisma } from "@utils/db";

export async function POST(request: Request) {
  try {
    console.log(request.method, request.url);

    const data = await request.json();

    const { teamId, filter, search } = data;

    const users = await prisma.user.findMany({
      where: {
        email: {
          startsWith: search,
        },
        NOT: {
          OR: [
            {
              player: {
                some: {
                  Team: {
                    id: teamId,
                  },
                },
              },
            },
            {
              team: {
                some: {
                  id: teamId,
                },
              },
            },
            {
              invite: {
                some: {
                  teamId: teamId,
                },
              },
            },
          ],
        },
      },
      include: {
        player: {
          select: {
            teamId: true,
            userId: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (e) {
    console.log(request.method, request.url);
    console.error(e);
    return new NextResponse(JSON.stringify(e), { status: 500 });
  }
}

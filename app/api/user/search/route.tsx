import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { GenderType, Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    console.log(request.method, request.url);

    const data = await request.json();

    console.log(data);

    const { teamId, gender, ageGroup, search } = data;

    const today = new Date();
    const gt = new Date(today.getFullYear() - ageGroup, 0, 0);

    let filterUsers: Prisma.UserWhereInput = {
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
    };

    if (ageGroup) {
      filterUsers = {
        ...filterUsers,
        OR: [
          {
            birthdate: {
              gt,
            },
          },
          {
            birthdate: null,
          },
        ],
      };
    }

    if (gender === GenderType.MEN || gender == GenderType.WOMEN) {
      filterUsers = {
        ...filterUsers,
        gender: {
          in: [GenderType.MIXED, gender],
        },
      };
    }
    const users = await prisma.user.findMany({
      where: filterUsers,
    });

    return NextResponse.json(users);
  } catch (e) {
    console.log(request.method, request.url);
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}

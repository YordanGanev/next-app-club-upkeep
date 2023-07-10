"use server";
import { prisma } from "@utils/db";
import { getPlaceholderImage } from "@utils/common";

import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";
import { SportType } from "@prisma/client";

export async function addClub(data: FormData) {
  const session = await getSession();

  if (!session) {
    return;
  }

  const name = data.get("name") as string;

  const picture = getPlaceholderImage(name.slice(0, 2).toLowerCase());

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      club: {
        create: {
          name,
          picture,
        },
      },
    },
  });

  if (!user) {
    return;
  }
}

export async function addTeam(
  data: FormData,
  master_data: { clubId: string } | undefined
) {
  if (!master_data) return;

  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;
  const sport = data.get("sport") as SportType;
  const picture = getPlaceholderImage(name.slice(0, 2).toLowerCase());
  console.log(data);
  console.log(name, sport, picture);

  const updated = await prisma.club.update({
    where: {
      id: master_data.clubId,
    },
    data: {
      teams: {
        create: {
          name,
          sport,
          picture,
        },
      },
    },
  });

  console.log(updated);

  return;
}

"use server";
import { prisma } from "@utils/db";
import { getPlaceholderImage } from "@utils/common";

import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";

export async function addClub(data: FormData) {
  const session = await getSession();

  if (!session) {
    return "Unauthorized";
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

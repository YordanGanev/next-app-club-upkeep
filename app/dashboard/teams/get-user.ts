import { cache } from "react";
import { prisma } from "@utils/db";

export const revalidate = 1;

export const getUser = cache(async (email: string) => {
  const item = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });
  return item;
});

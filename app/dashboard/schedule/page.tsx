import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";
import { getSession } from "@auth0/nextjs-auth0";

export default async function page() {
  const session = await getSession();

  if (!session) return <h1>No session</h1>;

  const appUser = await prisma.user.findUnique({
    where: {
      email: "",
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser) return <h1>No user</h1>;

  return <h1>Schedule</h1>;
}

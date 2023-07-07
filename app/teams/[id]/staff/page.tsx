import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";

export default async function page() {
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

  console.log(appUser);

  return <h1>Staff</h1>;
}

import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";
import { getSession } from "@auth0/nextjs-auth0";

export default async function page() {
  const session = await getSession();


  
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

  return <h1>Schedule</h1>;
}

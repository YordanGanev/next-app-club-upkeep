import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";

import { getSession } from "@auth0/nextjs-auth0";

import Home from "./home-page";
import { redirect } from "next/navigation";
export default async function page() {
  const session = await getSession();

  console.warn("session", session);
  if (!session) redirect("/about");

  const appUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  // console.log(appUser);

  return <Home appUser={appUser} />;
}

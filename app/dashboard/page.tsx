import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";

import { getSession } from "@auth0/nextjs-auth0";

import Dashboard from "./dashboard";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

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

  return <Dashboard appUser={appUser} />;
}

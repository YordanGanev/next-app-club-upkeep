import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";

import Home from "./home-page";
export default async function page() {
  const appUser = await prisma.user.findUnique({
    where: {
      email: "yordanganew@gmail.com",
    },
    include: {
      invite: true,
    },
  });

  console.log(appUser);

  return <Home appUser={appUser} />;
}

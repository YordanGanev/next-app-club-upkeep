import React from "react";

import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/db";

import ListTeams from "@/components/basic/list-teams";

import Style from "./teams.module.css";
import CardStyle from "@/styles/card-layout.module.css";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";

export default async function page() {
  const session = await getSession();

  if (!session) redirect("/about");

  const appUser = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser) redirect("/about");

  const teams = await prisma.team.findMany({
    where: {
      OR: [
        {
          club: {
            ownerId: appUser.id,
          },
        },
        {
          player: {
            some: {
              userId: appUser.id,
            },
          },
        },
        {
          staff: {
            some: {
              id: appUser.id,
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          player: true,
          staff: true,
        },
      },
    },
  });

  return (
    <>
      <div className={CardStyle.wrapper}>
        {teams.length === 0 && (
          <div className={Style.info}>
            <h2>No Teams</h2>
            <p>
              You are not part of any teams. You can create a team or join an
              existing one.
            </p>
            <p>
              Check your notifications for invites or create a new team in club
              you own.
            </p>
          </div>
        )}
        <ListTeams teams={teams} />
      </div>
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

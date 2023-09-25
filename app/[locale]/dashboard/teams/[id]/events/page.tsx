import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";

import { prisma } from "@/utils/db";
import {
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
  checkUserAccess,
} from "@/utils/common";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import TeamEventsPage from "./team-events";

export default async function EventPage({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { day: number; month: number; year: number };
}) {
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
  // console.log(appUser);

  let day, month, year;
  let date: Date;

  if (searchParams?.day && searchParams?.month && searchParams?.year) {
    console.log(searchParams);
    day = searchParams.day;
    month = searchParams.month;
    year = searchParams.year;
    date = new Date(year, month, day);
  } else {
    date = new Date();
  }

  const gte = new Date(date.getFullYear(), date.getMonth(), 1);
  const lt = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  // console.log(date.toDateString(), gte, lt);

  if (isNaN(date.getTime()) || !gte || !lt) redirect("/dashboard/teams");

  const team = await prisma.team.findUnique({
    where: {
      id,
    },
    include: {
      club: {
        select: {
          ownerId: true,
        },
      },
      player: {
        select: {
          userId: true,
        },
      },
      staff: {
        select: {
          id: true,
        },
      },
      events: {
        where: {
          date: {
            gte,
            lt,
          },
        },
        include: {
          team: {
            select: {
              name: true,
              picture: true,
            },
          },
        },
      },
    },
  });
  if (!team) redirect("/dashboard/teams");

  const { club, staff, player: players } = team;

  const { access, WriteAccess } = checkUserAccess(
    appUser.id,
    club.ownerId,
    staff,
    players
  );

  if (access === null) redirect("/dashboard/teams");

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <TeamEventsPage team={team} writeAccess={WriteAccess} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

import React from "react";
import { prisma } from "@/utils/db";

import { getSession } from "@auth0/nextjs-auth0";

import SchedulePage from "./schedule-page";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams?: { day: number; month: number; year: number };
}) {
  const session = await getSession();

  if (!session) redirect("about");

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

  if (!appUser) return <h1>No user</h1>;

  let day, month, year;
  let date: Date;

  if (searchParams?.day && searchParams?.month && searchParams?.year) {
    // console.log(searchParams);
    day = searchParams.day;
    month = searchParams.month;
    year = searchParams.year;
    date = new Date(year, month, day);
  } else {
    date = new Date();
  }

  const gte = new Date(date.getFullYear(), date.getMonth(), 1);
  const lt = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const req_events = await prisma.team.findMany({
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
    select: {
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

  let events: any[] = [];

  req_events.forEach((team) => {
    events = events.concat(team.events);
  });

  return (
    <>
      <SchedulePage events={events} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

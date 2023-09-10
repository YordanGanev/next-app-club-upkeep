import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";

import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import ListTeams from "@/components/basic/list-teams";
import ListEvents from "@/components/basic/list-events";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarXmark } from "@fortawesome/free-solid-svg-icons";

import Style from "./dash.module.css";
import StyleMissing from "@/styles/missing.module.css";
import { Prisma } from "@prisma/client";

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

  if (!appUser) redirect("/about");

  /*const teams = await prisma.team.findMany({
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
    orderBy: {
      player: {
        createdAt: "desc",
      },
    },
    take: 6,
  });*/
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
      player: {
        select: {
          joinnedAt: true,
        },
        orderBy: {
          joinnedAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          player: true,
          staff: true,
        },
      },
    },
  });

  const team_ids = teams.map((team) => team.id);

  const currentDate = new Date();

  const upcomingEvents = await prisma.event.findMany({
    where: {
      teamId: {
        in: team_ids,
      },
      date: {
        gte: currentDate,
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 5,
    include: {
      team: {
        select: {
          name: true,
          picture: true,
        },
      },
    },
  });

  const teamsForSort = Prisma.validator<Prisma.TeamArgs>()({
    include: {
      _count: {
        select: {
          player: true,
          staff: true,
        },
      },
      player: {
        select: {
          joinnedAt: true,
        },
      },
    },
  });

  function recentTeams(teams: Prisma.TeamGetPayload<typeof teamsForSort>[]) {
    return teams
      .sort((a, b) => {
        if (a.player.length === 0 && b.player.length === 0) return 0;
        if (a.player.length === 0) return 1;
        if (b.player.length === 0) return -1;
        return (
          new Date(a.player[0]?.joinnedAt).getMilliseconds() -
          new Date(b.player[0]?.joinnedAt).getMilliseconds()
        );
      })
      .slice(0, 6);
  }

  return (
    <>
      <div className={`dashboard-content-wrapper ${Style.wrapper}`}>
        <section>
          <h2>Welcome, {appUser.name}!</h2>
        </section>
        <section>
          <h2>Upcoming events</h2>
          {upcomingEvents.length === 0 && (
            <div className={StyleMissing.wrapper}>
              <div>
                <FontAwesomeIcon icon={faCalendarXmark} />
              </div>
              <div>No events to attend</div>
            </div>
          )}
          {upcomingEvents.length > 0 && <ListEvents events={upcomingEvents} />}
        </section>

        <section>
          <h2>Recent teams</h2>
          {teams.length === 0 && (
            <div className={StyleMissing.wrapper}>
              <div>
                <FontAwesomeIcon icon={faCalendarXmark} />
              </div>
              <div>Not member of any team yet</div>
            </div>
          )}
          {teams.length > 0 && <ListTeams teams={recentTeams(teams)} />}
        </section>

        <NotificationsUpdate appUser={appUser} />
      </div>
    </>
  );
}

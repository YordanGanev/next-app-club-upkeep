import { prisma } from "@utils/db";
import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";

import Dashboard from "./dashboard";
import ListTeams from "@components/basic/list-teams";
import ListEvents from "@components/basic/list-events";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarXmark } from "@fortawesome/free-solid-svg-icons";

import Style from "./dash.module.css";
import StyleMissing from "@styles/missing.module.css";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getSession();

  console.log("dashboard");

  if (!session)
    return (
      <>
        <h1>No session Dashboard</h1>
        <a href="/api/auth/login">Login</a>
      </>
    );

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

  return (
    <>
      <div className={`dashboard-content-wrapper ${Style.wrapper}`}>
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
          {teams.length > 0 && <ListTeams teams={teams} />}
        </section>

        <Dashboard appUser={appUser} />
      </div>
    </>
  );
}

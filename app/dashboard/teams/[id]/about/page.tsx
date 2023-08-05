import { prisma } from "@utils/db";
import { getSession } from "@auth0/nextjs-auth0";
import { PlayerManageTeamTabs, StaffManageTeamTabs } from "@utils/common";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@components/basic/NotificationsUpdate";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) <h1>Invalid Session</h1>;

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

  if (!appUser) return <h1>User Not Found</h1>;

  const team = await prisma.team.findUnique({
    where: {
      id: params.id,
    },
    include: {
      staff: true,
      player: true,
      club: true,
    },
  });

  if (!team) return <h1>Team Not Found</h1>;

  let WriteAccess = false;
  if (team.club.ownerId === appUser.id) {
    WriteAccess = true;
  } else {
    team.staff?.forEach((member) => {
      if (member.id === appUser.id) {
        WriteAccess = true;
      }
    });
  }

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <h1>About</h1>

      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

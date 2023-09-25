import { ManageClubTabs } from "@/utils/common";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";
import { getSession } from "@auth0/nextjs-auth0";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import Profile from "@/components/basic/profile";
import ProfileInfo, {
  ProfileInfoListType,
} from "@/components/basic/ProfileInfo";

import Style from "./about.module.css";
import { AchievementType } from "@prisma/client";
import ProfileAction from "@/components/basic/ProfileAction";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) redirect("about");

  const { id } = params;

  const appUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser) redirect("about");

  const club = await prisma.club.findUnique({
    where: {
      id,
    },
    include: {
      teams: {
        include: {
          staff: {
            select: { id: true },
          },
          player: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              player: true,
            },
          },
        },
      },
      _count: {
        select: {
          teams: true,
        },
      },
    },
  });

  if (!club) redirect("dashboard/clubs");

  const owner = await prisma.user.findUnique({
    where: {
      id: club.ownerId,
    },
    select: {
      name: true,
      nickname: true,
      email: true,
      picture: true,
    },
  });

  if (!owner) redirect("dashboard/clubs");

  const achievements = await prisma.achievement.findMany({
    where: {
      team: {
        clubId: club.id,
      },
    },
    select: {
      type: true,
    },
  });

  const usersCount = await prisma.user.count({
    where: {
      OR: [
        {
          player: {
            some: {
              Team: {
                clubId: club.id,
              },
            },
          },
        },
        {
          team: {
            some: {
              clubId: club.id,
            },
          },
        },
      ],
    },
  });

  const staticPlayersCount = await prisma.player.count({
    where: {
      Team: {
        clubId: club.id,
      },
      userId: null,
    },
  });

  const medicalRecordsCount = await prisma.medical.count({
    where: {
      player: {
        Team: {
          clubId: club.id,
        },
      },
    },
  });

  const sportTypes = await prisma.team.findMany({
    where: {
      clubId: club.id,
    },
    select: {
      sport: true,
    },
    distinct: ["sport"],
  });

  const activitiesCount = await prisma.event.count({
    where: {
      team: {
        clubId: club.id,
      },
      date: {
        lt: new Date(),
      },
    },
  });

  const ownerName = owner.name === owner.email ? owner.nickname : owner.name;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const createdAt = new Date(club.createdAt).toLocaleDateString(
    "en-GB",
    options
  );
  const usersCountPlural = usersCount > 1 ? "s" : "";
  // Count achievements
  let awardsCount = 0;
  let topPlacingsCount = 0;
  achievements.forEach((achievement) => {
    switch (achievement.type) {
      case AchievementType.SPECIAL:
      case AchievementType.MVP:
        awardsCount++;
        break;
      default:
        topPlacingsCount++;
        break;
    }
  });

  const infoList: ProfileInfoListType = [
    { note: `Created at ${createdAt}`, responsive: true },
    {
      note:
        club.teams.length > 0
          ? `${club.teams.length} team${club.teams.length > 1 ? "s" : ""}`
          : "No teams yet",
    },
    {
      note:
        topPlacingsCount > 0
          ? `${topPlacingsCount} top placing${topPlacingsCount > 1 ? "s" : ""}`
          : "No top placings recorded yet",
    },
    {
      note:
        awardsCount > 0
          ? `${awardsCount} award${awardsCount > 1 ? "s" : ""}`
          : "No awards recorded yet",
    },
    {
      note:
        usersCount > 0
          ? `${usersCount} member${usersCountPlural} registrated user${usersCountPlural} `
          : "No registrated user members yet",
    },
    {
      note:
        staticPlayersCount > 0
          ? `${staticPlayersCount} static player${
              staticPlayersCount > 1 ? "s" : ""
            }`
          : "Not added static players yet",
    },
    {
      note:
        medicalRecordsCount > 0
          ? `${medicalRecordsCount} medical record${
              medicalRecordsCount > 1 ? "s" : ""
            }`
          : "No medical records yet",
    },
    {
      note:
        activitiesCount > 0
          ? `${activitiesCount} activit${
              activitiesCount > 1 ? "ies" : "y"
            } organized`
          : "No activities organized yet",
    },
  ];

  if (club._count?.teams > 0) {
    const sports = `Sports: ${sportTypes
      .map((s) => s.sport.replace("_", " ").toLowerCase())
      .join(", ")}`;
    infoList.push({ note: sports });
  }

  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <div className={`dashboard-content-wrapper `}>
        <div className={Style.wrapper}>
          <Profile
            picture={club.picture}
            title={club.name}
            subtitle={`Club`}
            description={`Created ${createdAt}`}
            responsive={true}
          />
          <Profile
            picture={owner.picture}
            title={ownerName}
            subtitle={owner.email}
            description="Owner"
          />
        </div>

        <ProfileInfo title="Club Info" list={infoList} />

        <ProfileAction about="club" id={params.id} />
      </div>
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

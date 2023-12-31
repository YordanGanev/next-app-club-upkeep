import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import { AchievementType } from "@prisma/client";

import { prisma } from "@/utils/db";
import {
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
  checkUserAccess,
} from "@/utils/common";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import Profile from "@/components/basic/profile";
import ProfileInfo, {
  ProfileInfoListType,
} from "@/components/basic/ProfileInfo";

import Style from "./team-about.module.css";
import ProfileAction from "@/components/basic/ProfileAction";

export default async function page({ params }: { params: { id: string } }) {
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

  const team = await prisma.team.findUnique({
    where: {
      id: params.id,
    },
    include: {
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
      club: {
        select: {
          ownerId: true,
          name: true,
          picture: true,
          createdAt: true,
          owner: {
            select: {
              name: true,
              nickname: true,
              picture: true,
              email: true,
            },
          },
        },
      },
      achievements: {
        select: {
          type: true,
        },
      },
      _count: {
        select: {
          events: true,
        },
      },
    },
  });

  if (!team) redirect("/dashboard/teams");

  const medicalCount = await prisma.medical.count({
    where: {
      player: {
        teamId: params.id,
      },
    },
  });

  const { access, WriteAccess } = checkUserAccess(
    appUser.id,
    team.club.ownerId,
    team.staff,
    team.player
  );

  if (access === null) redirect("/dashboard/teams");

  const ownerName =
    team.club.owner.name === team.club.owner.email
      ? team.club.owner.nickname
      : team.club.owner.name;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const createdAt = new Date(team.createdAt).toLocaleDateString(
    "en-GB",
    options
  );

  // Count achievements
  let awardsCount = 0;
  let topPlacingsCount = 0;
  team.achievements.forEach((achievement) => {
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

  let signedMembers = team.staff.length;
  team.player.forEach((player) => {
    if (player.userId !== null) signedMembers++;
  });

  const signedMembersPlural = signedMembers > 1 ? "s" : "";

  const infoList: ProfileInfoListType = [
    { note: `Created at ${createdAt}`, responsive: true },

    {
      note: `${team.gender[0]}${team.gender.slice(1).toLowerCase()} Team`,
    },
    {
      note: `Age group: ${team.ageGroup ? team.ageGroup : "any"}`,
    },
    {
      note:
        team.player.length > 0
          ? `${team.player.length} player${team.player.length > 1 ? "s" : ""}`
          : "No players yet",
    },
    {
      note:
        team.staff.length > 0
          ? `${team.staff.length} staff member${
              team.staff.length > 1 ? "s" : ""
            }`
          : "No staff members yet",
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
        signedMembers > 0
          ? `${signedMembers} member${signedMembersPlural} registrated user${signedMembersPlural}`
          : "No signed members yet",
    },
    {
      note:
        team._count.events > 0
          ? `${team._count.events} activities${
              team._count.events > 1 ? "s" : ""
            } organized`
          : "No activities organized yet",
    },
    {
      note:
        medicalCount > 0
          ? `Total ${medicalCount} medical record${medicalCount > 1 ? "s" : ""}`
          : "No medical records yet",
    },
  ];

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />

      <div className="dashboard-content-wrapper">
        <div className={Style.wrapper}>
          <Profile
            picture={team.picture}
            title={team.name}
            subtitle={`
          ${team.sport.charAt(0)}${team.sport
              .slice(1)
              .toLowerCase()
              .replace("_", " ")} Team`}
            description={`Created ${createdAt}`}
            responsive={true}
          />
          <Profile
            picture={team.club.picture}
            title={team.club.name}
            subtitle={"Team's club"}
          />
          <Profile
            picture={team.club.owner.picture}
            title={ownerName}
            subtitle={team.club.owner.email}
            description="Owner"
          />
        </div>

        <ProfileInfo title="Team Information" list={infoList} />

        {access === "owner" && <ProfileAction about="team" id={params.id} />}
      </div>

      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

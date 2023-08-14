import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/db";

import { PlayerManageTeamTabs, StaffManageTeamTabs } from "@/utils/common";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMedal, faAward, faTrophy } from "@fortawesome/free-solid-svg-icons";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import AchievementsClient from "./achievements-page";

import "@/styles/achievement-icon-color.css";
import Style from "./achievements.module.css";

export default async function page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const session = await getSession();

  if (!session) redirect("/about");

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
      staff: {
        select: {
          id: true,
        },
      },
      player: {
        select: {
          userId: true,
        },
      },
      achievements: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!team) redirect("/dashboard/teams");

  const AchievementMap = {
    FIRST_PLACE: { name: "Champion", icon: faMedal },
    SECOND_PLACE: { name: "2nd place", icon: faMedal },
    THIRD_PLACE: { name: "3rd place", icon: faMedal },
    MVP: { name: "MVP award", icon: faTrophy },
    SPECIAL: { name: "Special award", icon: faAward },
  };

  return (
    <>
      <TabNav tabs={true ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <div className={`dashboard-content-wrapper ${Style.wrapper}`}>
        {team.achievements.map((achievement) => {
          const date = new Date(achievement.date);
          const [month, year] = date
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
            .split(" ");

          return (
            <div key={achievement.id} className={Style.achievement}>
              <FontAwesomeIcon
                size="5x"
                icon={AchievementMap[achievement.type].icon}
                className={`${Style.icon} ${achievement.type}`}
              />
              <div className={Style.info}>
                <div>
                  <span className={Style.swag}>Achievement</span>
                  <span className={Style.bold}>
                    {AchievementMap[achievement.type].name}
                  </span>
                </div>
                <div>
                  <span className={Style.swag}>Competition</span>
                  <span className={Style.bold}>{achievement.competition} </span>
                </div>
                {achievement.description && (
                  <div>
                    <span className={Style.swag}>Description</span>
                    <span>{achievement.description} </span>
                  </div>
                )}
                <div className={Style.date}>
                  <span className={Style.swag}>Date</span>
                  <span>
                    <span className={Style.bold}>{year}</span>, {month}
                  </span>
                </div>
              </div>
              <div className={Style.date}>
                <div className={Style.bold}>
                  {month} {year}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AchievementsClient writeAccess={true} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

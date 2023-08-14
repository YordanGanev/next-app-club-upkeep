import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { SportType } from "@prisma/client";

import { prisma } from "@/utils/db";
import { getPlaceholderImage } from "@/utils/common";
import { addTeam } from "@/utils/actions";

import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTie,
  faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";

import WizzardButton from "@/components/basic/wizButton";
import DynamicLink from "@/components/basic/dynamic-link";
import TabNav from "@/components/layout/tabNav";

import Style from "../../clubs.module.css";
import CardStyle from "@/styles/card-layout.module.css";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";

export const metadata = {
  title: "Teams | Club",
  description: "Manage your club's teams",
};

export default async function ManageClubPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/about");

  const appUser = await prisma.user.findUnique({
    where: { email: session?.user.email as string },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser) redirect("/about");

  const club = await prisma.club.findUnique({
    where: { id: params.id },
    include: {
      teams: {
        include: {
          _count: {
            select: {
              staff: true,
              player: true,
            },
          },
        },
      },
    },
  });

  if (!club) redirect("/about");

  if (club.ownerId != appUser.id) return <h1>Invalid data</h1>;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  // Setup tabs to be displayed
  const ManageClubTabs = [
    { slug: "teams", title: "Teams" },
    { slug: "about", title: "About" },
  ];

  const sportTypeOptions = [
    { value: SportType.FOOTBALL, label: "Football" },
    { value: SportType.VOLLEYBALL, label: "Volleyball" },
    { value: SportType.BASKETBALL, label: "Basketball" },
    { value: SportType.HANDBALL, label: "Handball" },
    { value: SportType.ICE_HOKEY, label: "Ice Hokey" },
    { value: SportType.FIELD_HOKEY, label: "Field Hokey" },
    { value: SportType.RUGBY, label: "Rugby" },
    { value: SportType.OTHER, label: "Other" },
  ];

  // Form setup Object
  const form = {
    fetch: {
      url: "/api/team",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      master_data: {
        clubId: params.id,
      },
    },
    title: "Add team",
    inputs: [
      {
        type: "text",
        name: "name",
        required: true,
        placeholder: "Team Name",
      },
      {
        type: "Select",
        name: "sport",
        placeholder: "Select sport type",
        options: sportTypeOptions,
      },
    ],
    onSubmitAction: addTeam,
  };

  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <div className={CardStyle.wrapperWizButton}>
        {club?.teams?.length == 0 && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faUsersSlash} />
            </div>
            <div>No teams yet</div>
          </div>
        )}
        <div className={CardStyle.container}>
          {club?.teams?.map((team) => {
            return (
              <div className={CardStyle.card} key={team.id}>
                <DynamicLink href={`/dashboard/teams/${team.id}`}>
                  <Image
                    src={getPlaceholderImage(
                      team.name.slice(0, 2).toLowerCase()
                    )}
                    alt="defaultclubpng"
                    width="100"
                    height="100"
                  />
                  <div>
                    <h2>{team.name}</h2>
                    <div>
                      <span className={CardStyle.statsLabel}> Created </span>
                      {new Date(team.createdAt).toLocaleDateString(
                        "en-UK",
                        options
                      )}
                    </div>
                    <div>
                      <span className={CardStyle.statsLabel}> Updated </span>
                      {new Date(team.updatedAt).toLocaleDateString(
                        "en-UK",
                        options
                      )}
                    </div>
                    <div className={CardStyle.stats}>
                      <div>
                        <div className={CardStyle.icon}>
                          <FontAwesomeIcon icon={faUser} />
                          <span>{team._count.player}</span>
                        </div>
                        <span className={CardStyle.statsLabel}>Players</span>
                      </div>
                      <div>
                        <div className={CardStyle.icon}>
                          <FontAwesomeIcon icon={faUserTie} />
                          <span>{team._count.staff + 1}</span>
                        </div>
                        <span className={CardStyle.statsLabel}>{"Staff"}</span>
                      </div>
                    </div>
                  </div>
                </DynamicLink>
              </div>
            );
          })}
        </div>
      </div>

      <WizzardButton form={form} extra={null} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

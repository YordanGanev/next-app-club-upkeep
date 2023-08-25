import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { GenderType, SportType } from "@prisma/client";

import { prisma } from "@/utils/db";
import { addTeam } from "@/utils/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersSlash } from "@fortawesome/free-solid-svg-icons";

import WizzardButton from "@/components/basic/wizButton";
import TabNav from "@/components/layout/tabNav";

import Style from "../../clubs.module.css";
import CardStyle from "@/styles/card-layout.module.css";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import ListTeams from "@/components/basic/list-teams";

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

  if (club.ownerId != appUser.id) redirect("/dashboards/clubs");

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

  const genderOptions = [
    { value: GenderType.WOMEN, label: "Women" },
    { value: GenderType.MEN, label: "Men" },
    { value: GenderType.MIXED, label: "Mixed" },
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
        required: true,
      },
      {
        type: "Select",
        name: "gender",
        options: genderOptions,
        placeholder: "Select gender",
        required: true,
      },
      {
        type: "number",
        name: "age",
        placeholder: "Age group (optional)",
        min: "4",
        max: "35",
      },
    ],
    onSubmitAction: addTeam,
  };

  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <div className={CardStyle.wrapperWizButton}>
        {club.teams.length == 0 && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faUsersSlash} />
            </div>
            <div>No teams yet</div>
          </div>
        )}
        {club.teams.length > 0 && <ListTeams teams={club?.teams} />}
      </div>

      <WizzardButton form={form} extra={null} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

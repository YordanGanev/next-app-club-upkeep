import { InviteType } from "@prisma/client";

import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/db";
import { UserNotifyContextType } from "@/contexts/NotificationContext";
import {
  // UserAccess,
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
  checkUserAccess,
} from "@/utils/common";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";

import TabNav from "@/components/layout/tabNav";
import CancelInviteButton from "@/components/action/CancelInviteButton";
import RemoveStaffButton from "./remove-staff-button";
import TeamStaffClient from "./team-staff";

import Style from "../../teams.module.css";
import ListView from "@/styles/user-profile.module.css";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";

const UserAccess = {
  owner: "owner",
  staff: "staff",
  player: "player",
};
type UserAccessType = keyof typeof UserAccess;

export default async function TeamStaffPage({
  params,
}: {
  params: { id: string };
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

  const team = await prisma.team.findUnique({
    where: {
      id: params.id,
    },
    include: {
      club: {
        select: {
          id: true,
          ownerId: true,
          name: true,
          country: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      staff: {
        select: {
          id: true,
          name: true,
          email: true,
          nickname: true,
          picture: true,
        },
      },
      player: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!team) redirect("/dashboard/teams");

  const invites = await prisma.invite.findMany({
    where: { teamId: team?.id, type: InviteType.STAFF },
    include: {
      user: {
        select: {
          id: true,
          picture: true,
          name: true,
          nickname: true,
          email: true,
        },
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

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />

      <div className={`${Style.wrapper} ${Style.wizBtn}`}>
        {team?.staff?.length === 0 && invites.length === 0 && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faUserGear} />
            </div>
            <div>No staff members yet</div>
          </div>
        )}
        {team?.staff?.map((member) => {
          return (
            <div className={ListView.wrapper} key={member.email}>
              <Image
                src={member.picture}
                alt={`${member.name}-picture`}
                width="50"
                height="50"
              />
              <div>
                <div className={ListView.main}>
                  <div>
                    <p>
                      {member.name !== member.email
                        ? member.name
                        : member.nickname}
                    </p>
                    <p> {member.email} </p>
                  </div>
                  {access === UserAccess.owner && (
                    <RemoveStaffButton
                      teamId={team.id}
                      userId={member.id}
                      className="global-button border-remove"
                    >
                      Remove
                    </RemoveStaffButton>
                  )}
                  {appUser.id === member.id && (
                    <RemoveStaffButton
                      className="global-button border-remove"
                      teamId={team.id}
                      userId={member.id}
                      title="Leave Team"
                      message="You will lose access to the team."
                    >
                      Leave
                    </RemoveStaffButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {invites.map((i) => {
          return (
            <div
              className={`${ListView.wrapper} ${ListView.invite}`}
              key={`player-${i.user.email}`}
            >
              <Image
                src={i.user.picture}
                alt={`${i.user.name}-picture`}
                width="50"
                height="50"
              />
              <div>
                <div className={ListView.main}>
                  <div>
                    <p>
                      {i.user.name !== i.user.email
                        ? i.user.name
                        : i.user.nickname}
                    </p>
                    <p> {i.user.email} </p>
                  </div>
                  {WriteAccess && (
                    <CancelInviteButton
                      teamId={team.id}
                      userId={i.user.id}
                      className="global-button border-remove"
                    >
                      Cancel
                    </CancelInviteButton>
                  )}
                </div>
                <div className={ListView.content}>
                  <p> Invite pending..</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TeamStaffClient
        invites={appUser.invite}
        writeAccess={WriteAccess}
        teamId={team.id}
      />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

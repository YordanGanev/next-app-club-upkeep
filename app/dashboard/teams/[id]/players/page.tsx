import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { InviteType } from "@prisma/client";

import { UserNotifyContextType } from "@contexts/NotificationContext";
import { prisma } from "@utils/db";
import {
  UserAccess,
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
} from "@utils/common";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLargeSlash } from "@fortawesome/free-solid-svg-icons";

import RemovePlayerButton from "./del-player-button";
import CancelInviteButton from "@components/action/CancelInviteButton";
import TeamPlayersClient from "./teams-players";
import TabNav from "@components/layout/tabNav";

import Style from "../../teams.module.css";
import ListView from "@styles/user-profile.module.css";

export default async function PlayersPage({
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
      club: true,
      staff: {
        select: {
          id: true,
          picture: true,
          name: true,
          email: true,
          nickname: true,
        },
      },
      player: {
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
      },
    },
  });

  if (!team) redirect("/about");

  const invites = await prisma.invite.findMany({
    where: { teamId: team?.id },
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

  let access = UserAccess.player;
  let WriteAccess = false;

  const { club, staff, player } = team;
  if (club.ownerId === appUser.id) {
    access = UserAccess.owner;
    WriteAccess = true;
  } else {
    staff?.forEach((member) => {
      if (member.id === appUser.id) {
        access = UserAccess.staff;
        WriteAccess = true;
      }
    });
  }

  console.log(access);

  const loadOptions = async (inputValue: any) => {
    try {
      const response = await fetch("/api/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: invites.map((i) => i.user.email),
          teamid: team.id,
          search: inputValue,
        }),
      });
      const data = await response.json();
      //console.log(data);

      return data?.map((person: { email: string }) => {
        return {
          value: person.email, // id
          label: person.email,
        };
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const players = team.player;

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <div className={`${Style.wrapper} ${Style.wizBtn}`}>
        {players?.length === 0 && invites?.length === 0 && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faUserLargeSlash} />
            </div>
            <div>No players yet</div>
          </div>
        )}
        {players?.map((p) => {
          let email = "Static player";
          let name = p.name;
          let picture = p.picture as string;

          if (p.user?.email) {
            email = p.user.email;
            name = p.user.name !== p.user.email ? p.user.name : p.user.nickname;
            picture = p.user.picture;
          }

          return (
            <div className={ListView.wrapper} key={`${name}-${email}`}>
              <Image
                src={picture}
                alt={`${name}-picture`}
                width="50"
                height="50"
              />
              <div>
                <div className={ListView.main}>
                  <div>
                    <p>{name}</p>
                    <p>{email}</p>
                  </div>
                  <RemovePlayerButton
                    id={p.id}
                    className="global-button border-remove"
                  >
                    {p.user?.email ? "Remove" : "Delete"}
                  </RemovePlayerButton>
                </div>

                <div className={ListView.content}>
                  <p>
                    Joinned at{" "}
                    {new Date(p.joinnedAt).toLocaleDateString("en-UK", options)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {invites.map((i) => {
          if (i.type !== InviteType.PLAYER) return null;
          const name =
            i.user.name !== i.user.email ? i.user.name : i.user.nickname;

          return (
            <div
              className={`${ListView.wrapper} ${ListView.invite}`}
              key={`${name}-${i.user.email}`}
            >
              <Image
                src={i.user.picture}
                alt={`${name}-picture`}
                width="50"
                height="50"
              />
              <div>
                <div className={ListView.main}>
                  <div>
                    {/* todo use div instead of P? */}
                    <p>{name}</p>
                    <p>{i.user.email}</p>
                  </div>
                  {WriteAccess && (
                    <CancelInviteButton
                      teamId={team.id}
                      userId={i.userId}
                      className="global-button border-remove"
                    >
                      Cancel
                    </CancelInviteButton>
                  )}
                </div>

                <div className={ListView.content}>
                  <p>Invite pending..</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TeamPlayersClient
        appUser={appUser}
        writeAccess={WriteAccess}
        teamId={team.id}
      />
    </>
  );
}

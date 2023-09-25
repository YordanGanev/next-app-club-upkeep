import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { InviteType } from "@prisma/client";

import { addPost } from "@/utils/actions";

import { prisma } from "@/utils/db";
import {
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
  checkUserAccess,
} from "@/utils/common";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faSlash } from "@fortawesome/free-solid-svg-icons";

import CancelInviteButton from "@/components/action/CancelInviteButton";
import TabNav from "@/components/layout/tabNav";

import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import WizzardButton from "@/components/basic/wizButton";

import Style from "../../teams.module.css";
import Missing from "@/styles/missing.module.css";
import PostStyle from "./team-posts.module.css";

export default async function PlayersPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) redirect("/about");

  const { id } = params;

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
      id,
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

  if (!team) redirect("/dashboard/teams");

  const { club, staff, player: players } = team;

  const { access, WriteAccess } = checkUserAccess(
    appUser.id,
    club.ownerId,
    staff,
    players
  );

  if (access === null) redirect("/dashboard/teams");

  const form = {
    fetch: {
      master_data: { teamId: id },
    },
    title: "Add post",
    persist: true,
    submit: "Add post",
    inputs: [
      {
        type: "text",
        name: "title",
        required: true,
        placeholder: "Title",
        maxLength: "128",
      },
      {
        type: "textarea",
        name: "message",
        maxLength: "1080",
        required: true,
        rows: 5,
        placeholder: "Message",
      },
    ],
    onSubmitAction: addPost,
  };

  const posts = await prisma.post.findMany({
    where: {
      teamId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <div
        className={`dashboard-content-wrapper ${
          WriteAccess ? Style.wizBtn : ""
        }`}
      >
        {posts.length == 0 && (
          <div className={Missing.wrapper}>
            <div>
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faClipboard} />
                <FontAwesomeIcon icon={faSlash} />
              </span>
            </div>
            <div>No messages posted yet</div>
          </div>
        )}

        <div className={PostStyle.wrapper}>
          {posts.map((post) => (
            <div key={`post-${post.id}`} className={PostStyle.post}>
              <div className={PostStyle.header}>
                <h2>{post.title}</h2>
                <span>
                  {new Date(post.createdAt).toLocaleDateString(
                    "en-UK",
                    options
                  )}
                </span>
              </div>
              <div className={PostStyle.message}>
                <p>{post.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <WizzardButton form={form} extra={null} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

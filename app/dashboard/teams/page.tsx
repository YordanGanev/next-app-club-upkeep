import React from "react";

import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { prisma } from "@utils/db";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";

import TeamsClient from "./teams-client";

import Style from "./teams.module.css";
import CardStyle from "@styles/card-layout.module.css";

export default async function page() {
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

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  return (
    <>
      <div className={CardStyle.wrapper}>
        {teams.length === 0 && (
          <div className={Style.info}>
            <h2>No Teams</h2>
            <p>
              You are not part of any teams. You can create a team or join an
              existing one.
            </p>
            <p>
              Check your notifications for invites or create a new team in club
              you own.
            </p>
          </div>
        )}
        <div className={CardStyle.container}>
          {teams.map((team) => {
            console.log(team);
            return (
              <div className={CardStyle.card} key={team.id}>
                <Link href={`/dashboard/teams/${team.id}`}>
                  <Image
                    src={team.picture}
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
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <TeamsClient appUser={appUser} />
    </>
  );
}

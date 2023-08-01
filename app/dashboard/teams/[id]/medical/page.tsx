import React from "react";
import { prisma } from "@utils/db";

import { UserNotifyContextType } from "@contexts/NotificationContext";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import {
  UserAccess,
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
} from "@utils/common";
// import { deleteMedicalRecord } from "@utils/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeightScale,
  faRuler,
  faTriangleExclamation,
  faTrash,
  faBookMedical,
} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Link from "next/link";
import TabNav from "@components/layout/tabNav";
import DeleteMedicalButton from "./del-medical-button";
import TeamMedicalClient from "./team-medical";

import Style from "../../teams.module.css";
import ListView from "@styles/user-profile.module.css";

export default async function TeamMedicalPage({
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
          user: {
            select: {
              id: true,
              name: true,
              nickname: true,
              email: true,
              picture: true,
            },
          },
          id: true,
          medical: true,
          name: true,
          picture: true,
        },
      },
    },
  });

  if (!team) redirect("/about");

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

  const players = team.player;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <div className={Style.wrapper}>
        {!players.some((p) => p.medical.length > 0) && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faBookMedical} />
            </div>
            <div>No medical records yet</div>
          </div>
        )}
        {players.map((p) => {
          let picture: string;
          let name;
          let email;
          let isUser;

          if (p.user?.email && p.medical.length > 0) {
            picture = p.user.picture;
            name = p.user.name === p.user.email ? p.user.nickname : p.user.name;
            email = p.user.email;
            isUser = true;
          } else if (p.medical.length > 0) {
            picture = p.picture as string;
            name = p.name;
            email = "Static player";
            isUser = false;
          } else {
            return null;
          }

          return (
            <div className={ListView.wrapper} key={`medical-${p.id}`}>
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

                  <label
                    className={`global-button border-${
                      p.medical.length > 1 ? "normal" : "disabled"
                    }`}
                    htmlFor={`ext-${p.id}`}
                  >
                    View
                  </label>
                </div>
                <div className={ListView.content}>
                  <div className={ListView.date}>
                    <span>
                      {new Date(
                        p.medical[p.medical.length - 1]?.date
                      ).toLocaleDateString("en-UK", options)}
                      {true && (
                        <div className={`${ListView.icon} ${ListView.warn}`}>
                          <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                      )}
                    </span>
                    <span> </span>
                  </div>
                  <div className={ListView.stats}>
                    <div className={ListView.weight}>
                      <FontAwesomeIcon icon={faWeightScale} />
                      <span>
                        <span>Weight:</span>
                        <span className={"note"}>
                          {" "}
                          {p.medical[p.medical.length - 1]?.weight} kg
                        </span>
                      </span>
                    </div>
                    <div className={ListView.height}>
                      <FontAwesomeIcon icon={faRuler} />
                      <span>
                        <span>Height:</span>
                        <span className="note">
                          {" "}
                          {p.medical[p.medical.length - 1]?.height} cm
                        </span>
                      </span>
                    </div>
                  </div>

                  {p.medical.length > 1 && (
                    <>
                      <input type="checkbox" id={`ext-${p.id}`} />
                      <div className={ListView.extendRecords}>
                        <span className={ListView.extendTitle}>History</span>
                        {p.medical.map((m) => {
                          return (
                            <div key={`history-${m.id}`}>
                              <div className={ListView.medicalDate}>
                                <span>
                                  {new Date(m.date).toLocaleDateString(
                                    "en-US",
                                    options
                                  )}
                                </span>
                              </div>
                              <div className={ListView.medicalStats}>
                                <div>
                                  <span>{m.weight} kg</span>
                                  <span>{m.height} cm</span>
                                </div>
                                <DeleteMedicalButton
                                  className={`${ListView.deleteMedical} global-button border-remove`}
                                  id={m.id}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </DeleteMedicalButton>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <TeamMedicalClient
        appUser={appUser}
        writeAccess={WriteAccess}
        players={WriteAccess ? players : undefined}
        teamId={team.id}
      />
    </>
  );
}

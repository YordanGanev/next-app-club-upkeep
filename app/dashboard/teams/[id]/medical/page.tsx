import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { Prisma } from "@prisma/client";

import { prisma } from "@/utils/db";
import { addMedicalRecord } from "@/utils/actions";
import {
  PlayerManageTeamTabs,
  StaffManageTeamTabs,
  checkUserAccess,
} from "@/utils/common";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeightScale,
  faRuler,
  faTriangleExclamation,
  faTrash,
  faBookMedical,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import TabNav from "@/components/layout/tabNav";
import WizzardButton from "@/components/basic/wizButton";
import DeleteMedicalButton from "./del-medical-button";

import Style from "../../teams.module.css";
import ListView from "@/styles/user-profile.module.css";

const Player_User = Prisma.validator<Prisma.PlayerArgs>()({
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
});

type Player_User_t = Prisma.PlayerGetPayload<typeof Player_User>;

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
              birthdate: true,
            },
          },
          id: true,
          medical: {
            orderBy: {
              date: "desc",
            },
          },
          name: true,
          picture: true,
          userId: true,
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

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const form = {
    title: "Add Medical Record",
    inputs: [
      {
        type: "Select",
        name: "id",
        required: true,
        placeholder: "Select player",
        options: players?.map((p: Player_User_t) => {
          if (p.user)
            return {
              value: p.id,
              label:
                p.user.name === p.user.email ? p.user.nickname : p.user.name,
            };
          return {
            value: p.id,
            label: p.name,
          };
        }),
      },
      {
        type: "number",
        name: "weight",
        required: true,
        placeholder: "Weight kg",
      },
      {
        type: "number",
        name: "height",
        required: true,
        placeholder: "Height cm",
      },
    ],
    onSubmitAction: addMedicalRecord,
  };

  const calculateAge = (birthdate: Date, currentDate: Date) =>
    Math.floor(
      (currentDate.getTime() - birthdate.getTime()) / 31557600000 // 365+1/4 days per year to milliseconds
    );

  const today = new Date();
  const expireDate = new Date();
  expireDate.setMonth(today.getMonth() - 5);

  return (
    <>
      <TabNav tabs={WriteAccess ? StaffManageTeamTabs : PlayerManageTeamTabs} />
      <div className={`${Style.wrapper} ${WriteAccess ? Style.wizBtn : ""}`}>
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
          if (p.user?.email && p.medical.length > 0) {
            picture = p.user.picture;
            name = p.user.name === p.user.email ? p.user.nickname : p.user.name;
            email = p.user.email;
          } else if (p.medical.length > 0) {
            picture = p.picture as string;
            name = p.name;
            email = "Static player";
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
                      {new Date(p.medical[0]?.date).toLocaleDateString(
                        "en-UK",
                        options
                      )}
                      {new Date(p.medical[0]?.date) < expireDate && (
                        <div className={`${ListView.icon} ${ListView.warn}`}>
                          <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                      )}
                    </span>
                    <span> </span>
                  </div>
                  <div className={ListView.stats}>
                    <div className={ListView.age}>
                      {p.user?.birthdate && (
                        <>
                          <FontAwesomeIcon icon={faCakeCandles} />
                          <span>
                            <span>Age:</span>
                            <span className="note">{` ${calculateAge(
                              new Date(p.user?.birthdate),
                              today
                            )}`}</span>
                          </span>
                        </>
                      )}
                    </div>
                    <div className={ListView.weight}>
                      <FontAwesomeIcon icon={faWeightScale} />
                      <span>
                        <span>Weight:</span>
                        <span className={"note"}>
                          {` ${p.medical[0]?.weight} kg`}
                        </span>
                      </span>
                    </div>
                    <div className={ListView.height}>
                      <FontAwesomeIcon icon={faRuler} />
                      <span>
                        <span>Height:</span>
                        <span className="note">
                          {` ${p.medical[0]?.height} cm`}
                        </span>
                      </span>
                    </div>
                  </div>

                  {p.medical.length > 1 && (
                    <>
                      <input type="checkbox" id={`ext-${p.id}`} />
                      <div className={ListView.extendRecords}>
                        <div className={ListView.extendTitle}>
                          <span>History</span>
                        </div>
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
                              <div className={ListView.medicalRecord}>
                                <div className={ListView.medicalStats}>
                                  <div>
                                    <FontAwesomeIcon icon={faWeightScale} />
                                    <span>{m.weight} kg</span>
                                  </div>
                                  <div>
                                    <FontAwesomeIcon icon={faRuler} />
                                    <span>{m.height} cm</span>
                                  </div>
                                  <div>
                                    {p.user?.birthdate && (
                                      <>
                                        <FontAwesomeIcon icon={faCakeCandles} />
                                        <span>
                                          {`Age ${calculateAge(
                                            p.user.birthdate,
                                            new Date(m.date)
                                          )}`}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {WriteAccess && (
                                  <DeleteMedicalButton
                                    className={`${ListView.deleteMedical} global-button border-remove`}
                                    id={m.id}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </DeleteMedicalButton>
                                )}
                                {!WriteAccess && <div></div>}
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
      {WriteAccess && <WizzardButton form={form} extra={null} />}
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

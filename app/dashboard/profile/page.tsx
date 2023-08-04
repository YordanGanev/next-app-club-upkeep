import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { prisma } from "@utils/db";

import Image from "next/image";
import { redirect } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import ProfileForm from "./profile-form";

import Style from "./profile.module.css";

export default async function ServerComponent() {
  const session = await getSession();

  if (!session) redirect("/about");

  const user = session?.user;

  const appUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    include: {
      _count: {
        select: {
          team: true,
          club: true,
          player: true,
        },
      },
    },
  });

  if (!appUser) redirect("/about");

  const userOwnedClubs = await prisma.club.findMany({
    where: {
      ownerId: appUser.id,
    },
    select: {
      _count: {
        select: {
          teams: true,
        },
      },
    },
  });

  let totalTeamsOwned = 0;

  userOwnedClubs.forEach((club) => {
    totalTeamsOwned += club._count.teams;
  });

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const createdAt = new Date(appUser.createdAt).toLocaleString(
    "en-GB",
    options
  );
  const updatedAt = new Date(appUser.updatedAt).toLocaleString(
    "en-GB",
    options
  );

  const name = appUser.name === appUser.email ? appUser.nickname : appUser.name;

  return (
    <>
      <div className={`dashboard-content-wrapper`}>
        <div className={Style.profileWrapper}>
          <div className={Style.profileImage}>
            <Image
              src={appUser.picture}
              alt={`${appUser.name}-img`}
              width="96"
              height="96"
            />
          </div>
          <div className={Style.profileText}>
            <h2>{name}</h2>
            <p className={Style.email}>{appUser.email}</p>
            {appUser.birthdate !== null && (
              <div className={Style.date}>
                <p>
                  Birthdate{" "}
                  {new Date(appUser.birthdate).toLocaleDateString(
                    "en-US",
                    options
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={Style.infoWrapper}>
          <h3>User Information</h3>
          <div className={Style.info}>
            <span>
              {user.email_verified ? "Email verified" : "Email not verified"}
            </span>
            {appUser.birthdate !== null && (
              <span className={Style.date}>
                Birthdate{" "}
                {new Date(appUser.birthdate).toLocaleDateString(
                  "en-GB",
                  options
                )}
              </span>
            )}
            <span>Joinned {createdAt}</span>
            <span>Last edit {updatedAt}</span>
            <span>
              {appUser._count.club > 0
                ? `${appUser._count.club} club${
                    appUser._count.club != 1 ? "s" : ""
                  } owned`
                : "No clubs owned"}
            </span>
            <span>
              {totalTeamsOwned > 0
                ? `${totalTeamsOwned} team${
                    totalTeamsOwned != 1 ? "s" : ""
                  } owned`
                : "No teams owned"}
            </span>
            <span>
              {appUser._count.player > 0
                ? `Player in ${appUser._count.player}  team${
                    appUser._count.player != 1 ? "s" : ""
                  } `
                : "Not a player for a team"}
            </span>
            <span>
              {appUser._count.team > 0
                ? `Staff in ${appUser._count.team} team${
                    appUser._count.team != 1 ? "s" : ""
                  }`
                : "Not staff member for a team"}
            </span>
          </div>
        </div>

        <ProfileForm appUser={appUser} />
      </div>
    </>
  );
}

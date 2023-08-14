import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { prisma } from "@/utils/db";

import { redirect } from "next/navigation";

import ProfileForm from "./profile-form";

import Style from "./profile.module.css";
import Profile from "@/components/basic/profile";
import ProfileInfo, {
  ProfileInfoListType,
} from "@/components/basic/ProfileInfo";

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

  const name: string =
    appUser.name === appUser.email ? appUser.nickname : appUser.name;

  const infoList: ProfileInfoListType = [
    { note: user.email_verified ? "Email verified" : "Email not verified" },
    { note: `Joinned ${createdAt}` },
    { note: `Last edit ${updatedAt}` },
    {
      note:
        appUser._count.club > 0
          ? `${appUser._count.club} club${
              appUser._count.club != 1 ? "s" : ""
            } owned`
          : "No clubs owned",
    },
    {
      note:
        totalTeamsOwned > 0
          ? `${totalTeamsOwned} team${totalTeamsOwned != 1 ? "s" : ""} owned`
          : "No teams owned",
    },
    {
      note:
        appUser._count.player > 0
          ? `Player in ${appUser._count.player}  team${
              appUser._count.player != 1 ? "s" : ""
            } `
          : "Not a player for a team",
    },
    {
      note:
        appUser._count.team > 0
          ? `Staff in ${appUser._count.team} team${
              appUser._count.team != 1 ? "s" : ""
            }`
          : "Not staff member for a team",
    },
  ];

  if (appUser.birthdate !== null) {
    const birthdateItem = new Date(appUser.birthdate).toLocaleDateString(
      "en-GB",
      options
    );

    // Place birthdate after email verified
    infoList.splice(1, 0, {
      note: `Birthdate ${birthdateItem}`,
      responsive: true,
    });
  }

  return (
    <>
      <div className={`dashboard-content-wrapper`}>
        <div className={Style.profileWrapper}>
          <Profile
            picture={appUser.picture}
            title={name}
            subtitle={appUser.email}
            description={
              appUser.birthdate !== null
                ? `Birthdate ${new Date(appUser.birthdate).toLocaleDateString(
                    "en-US",
                    options
                  )}`
                : undefined
            }
            responsive={true}
          />
        </div>

        <ProfileInfo title="User Information" list={infoList} />

        <ProfileForm appUser={appUser} />
      </div>
    </>
  );
}

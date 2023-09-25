import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { prisma } from "@/utils/db";

import { redirect, usePathname } from "next/navigation";

import ProfileForm from "./profile-form";

import Style from "./profile.module.css";
import Profile from "@/components/basic/profile";
import ProfileInfo, {
  ProfileInfoListType,
} from "@/components/basic/ProfileInfo";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import { useTranslations } from "next-intl";

export default async function ServerComponent({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getSession();

  if (!session) redirect("/about");

  const user = session?.user;

  const appUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
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

  console.log(locale);
  if (locale !== appUser.country) {
    redirect(`/${appUser.country}/dashboard/profile`);
  }

  return (
    <ProfileContent
      appUser={appUser}
      userOwnedClubs={userOwnedClubs}
      email_verified={user.email_verified}
    />
  );
}

function ProfileContent({
  appUser,
  userOwnedClubs,
  email_verified,
}: {
  appUser: any;
  userOwnedClubs: any[];
  email_verified: boolean;
}) {
  const tUser = useTranslations("UserAbout");

  let totalTeamsOwned = 0;

  userOwnedClubs.forEach((club) => {
    totalTeamsOwned += club._count.teams;
  });

  const birthdateTxt = tUser("birthdate", {
    birthdate: new Date(appUser.birthdate),
  });
  const name: string =
    appUser.name === appUser.email ? appUser.nickname : appUser.name;

  const infoList: ProfileInfoListType = [
    { note: email_verified ? tUser("verified") : tUser("notVerified") },
    {
      note: tUser("joined", { joinDate: new Date(appUser.createdAt) }),
    },
    { note: tUser("edited", { joinDate: new Date(appUser.createdAt) }) },
    {
      note:
        appUser._count.club > 0
          ? `${
              appUser._count.club === 1
                ? tUser("club")
                : tUser("clubs", { value: appUser._count.club })
            }`
          : tUser("noClubs"),
    },
    {
      note:
        totalTeamsOwned > 0
          ? `${
              totalTeamsOwned === 1
                ? tUser("team")
                : tUser("teams", { value: totalTeamsOwned })
            }`
          : tUser("noTeams"),
    },
    {
      note:
        appUser._count.player > 0
          ? `${
              appUser._count.player === 1
                ? tUser("player")
                : tUser("players", { value: appUser._count.player })
            } }`
          : tUser("noPlayer"),
    },
    {
      note:
        appUser._count.team > 0
          ? `${
              appUser._count.team === 1
                ? tUser("staff")
                : tUser("staffs", { value: appUser._count.team })
            })}`
          : tUser("noStaff"),
    },
  ];

  if (appUser.birthdate !== null) {
    // Place birthdate after email verified
    infoList.splice(1, 0, {
      note: birthdateTxt,
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
            description={appUser.birthdate !== null ? birthdateTxt : undefined}
            responsive={true}
          />
        </div>

        <ProfileInfo title={tUser("title")} list={infoList} />

        <ProfileForm appUser={appUser} />
      </div>
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

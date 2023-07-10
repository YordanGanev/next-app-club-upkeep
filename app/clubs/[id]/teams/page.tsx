import { getSession } from "@auth0/nextjs-auth0";

import { prisma } from "@utils/db";
import { getPlaceholderImage } from "@utils/common";

import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTie,
  faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";

import TabNav from "@components/layout/tabNav";
import ClubTeams from "./club-teams";

import Style from "../../clubs.module.css";
import CardStyle from "@styles/card-layout.module.css";

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
  if (!session) return <h1>Not Found</h1>;

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

  if (!appUser) return <h1>Not Found</h1>;

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

  if (!club) return <h1>Not Found</h1>;

  if (club.ownerId != appUser.id) return <h1>Invalid data</h1>;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  // Setup tabs to be displayed
  const ManageClubTabs = [
    { slug: "teams", title: "Teams" },
    { slug: "about", title: "About" },
  ];

  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <div className={CardStyle.wrapperWizButton}>
        {club?.teams?.length == 0 && (
          <div className={Style.empty}>
            <div>
              <FontAwesomeIcon icon={faUsersSlash} />
            </div>
            <div>No teams yet</div>
          </div>
        )}
        <div className={CardStyle.container}>
          {club?.teams?.map((team) => {
            return (
              <div className={CardStyle.card} key={team.id}>
                <Link href={`/teams/${team.id}`}>
                  <Image
                    src={getPlaceholderImage(
                      team.name.slice(0, 2).toLowerCase()
                    )}
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
      <ClubTeams appUser={appUser} clubId={club.id} />
    </>
  );
}

// export const getServerSideProps = withPageAuthRequired({
//   // returnTo: '/unauthorized',

//     // console.log("clubId", clubId);

//     // access the user session if needed
//     const session = await getSession(ctx.req, ctx.res);

//     let appUser = await prisma.user.findUnique(
//       AppUserQuerySSR(session.user.email)
//     );

//     let club = await prisma.club.findUnique({
//       where: { id: clubId },
//       include: {
//         teams: {
//           include: {
//             _count: { select: { staff: true, player: true } },
//           },
//         },
//       },
//     });
//     // if ( appUser.birthdate ) // Fixes the date input w/ format "YYYY-MM-DD"
//     //   appUser.birthdate = appUser.birthdate.toISOString().substring(0, 10);
//     return {
//       props: {
//         club,
//         appUser: {
//           name: appUser.name,
//           picture: appUser.picture,
//           invite: appUser.invite,
//         },
//       },
//     };
//   },
// });

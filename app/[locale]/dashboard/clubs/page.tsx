import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/db";
import { addClub } from "@/utils/actions";

// Components
import Image from "next/image";

import WizzardButton from "@/components/basic/wizButton";
import DynamicLink from "@/components/basic/dynamic-link";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

// Style
import Style from "./clubs.module.css";
import CardStyle from "@/styles/card-layout.module.css";

export const metadata = {
  title: "Clubs",
  description: "Manage your clubs",
};

export default async function page() {
  const session = await getSession();

  if (!session) redirect("/about");

  const appUser = await prisma.user.findUnique({
    where: { email: session?.user.email as string },
    include: {
      club: {
        include: {
          _count: {
            select: {
              teams: true,
            },
          },
        },
      },
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser) redirect("/about");

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const form = {
    title: "Create Club",
    inputs: [
      {
        type: "text",
        name: "name",
        required: true,
        placeholder: "Club Name",
      },
    ],
    onSubmitAction: addClub,
  };

  return (
    <>
      <div className={`${CardStyle.wrapperWizButton} ${CardStyle.wrapper}`}>
        {appUser?.club.length === 0 && (
          <div className={Style.info}>
            <h2>No Clubs</h2>
            <p>You do not own any clubs.</p>
            <p>You can create a club and start managing your teams.</p>
          </div>
        )}
        <div className={CardStyle.container}>
          {appUser.club.map((c: any) => {
            return (
              <div className={CardStyle.card} key={c.id}>
                <DynamicLink key={"link-" + c.id} href={`clubs/${c.id}`}>
                  <Image
                    src={c.picture}
                    alt="defaultclubpng"
                    width="100"
                    height="100"
                  />
                  <div>
                    <h2>{c.name}</h2>

                    <div>
                      <span className={CardStyle.statsLabel}> Created </span>
                      {new Date(c.createdAt).toLocaleDateString(
                        "en-UK",
                        options
                      )}
                    </div>
                    <div>
                      <span className={CardStyle.statsLabel}> Updated </span>
                      {new Date(c.updatedAt).toLocaleDateString(
                        "en-UK",
                        options
                      )}
                    </div>
                    <div className={CardStyle.stats}>
                      <div>
                        <div className={CardStyle.icon}>
                          <FontAwesomeIcon icon={faPeopleGroup} />
                          <span>{c._count?.teams}</span>
                        </div>
                        <span className={CardStyle.statsLabel}>Teams</span>
                      </div>
                    </div>
                  </div>
                </DynamicLink>
              </div>
            );
          })}
        </div>
      </div>
      <WizzardButton form={form} extra={null} />
      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

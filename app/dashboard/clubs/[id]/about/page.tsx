import { ManageClubTabs } from "@/utils/common";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";
import { getSession } from "@auth0/nextjs-auth0";

import TabNav from "@/components/layout/tabNav";
import NotificationsUpdate from "@/components/basic/NotificationsUpdate";

export default async function page() {
  const session = await getSession();

  if (!session) redirect("about");

  const appUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <h1>About</h1>
      <p>{JSON.stringify(appUser)}</p>

      <NotificationsUpdate appUser={appUser} />
    </>
  );
}

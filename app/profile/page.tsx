import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { prisma } from "@utils/db";
import ProfilePage from "./profile-page";

export default async function ServerComponent() {
  const session = await getSession();
  const accessToken = await getAccessToken();
  const user = session?.user;

  console.log("session", session);
  console.log("user", user);

  const appUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (session) {
    return <ProfilePage appUser={appUser} />;
  }

  return <></>;
}

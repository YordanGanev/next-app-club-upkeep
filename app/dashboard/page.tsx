import { prisma } from "@utils/db";
import { getSession } from "@auth0/nextjs-auth0";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session)
    return (
      <>
        <h1>No session Dashboard</h1>
        <a href="/api/auth/login">Login</a>
      </>
    );

  const appUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
    include: {
      invite: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!appUser)
    return (
      <>
        <h1>No appUser found</h1>
        <a href="/api/auth/login">Login</a>
      </>
    );

  return <Dashboard appUser={appUser} />;
}

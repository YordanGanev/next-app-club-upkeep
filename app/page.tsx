import React from "react";
import { prisma } from "@utils/db";

import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";
import Link from "next/link";
export default async function page() {
  const session = await getSession();

  console.log("session", session);

  if (!session) redirect("/about");

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
        <h1>no user</h1> <a href="/api/auth/login">Login</a>
      </>
    );

  return (
    <div>
      <div>
        <h1>Next.js 13 test</h1>
        <p>Hello {appUser.name}</p>
      </div>
      <div>
        <a href="/api/auth/logout">Logout</a>
      </div>

      <div>
        <Link href="/dashboard" legacyBehavior>
          <a>Dashboard</a>
        </Link>
      </div>

      <div>
        <Link href="/about" legacyBehavior>
          <a>About</a>
        </Link>
      </div>
    </div>
  );
}

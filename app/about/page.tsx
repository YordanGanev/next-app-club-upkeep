import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

export default async function About() {
  const session = await getSession();

  return (
    <>
      <a href="/api/auth/login"> Login </a>
      <div>About</div>
      {session && (
        <>
          <div>Session</div>
          <div>{session.user.name}</div>
          <div>{session.user.email}</div>
        </>
      )}
      <Link href="/" legacyBehavior>
        <a>Home</a>
      </Link>
    </>
  );
}

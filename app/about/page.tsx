import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

export default function About() {
  // const session = getSession();
  // console.log("Session", session);

  return (
    <>
      <Link href="/api/auth/login"> Login </Link>
      <div>About</div>
      <Link href="/"> Home </Link>
    </>
  );
}

"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <div className={styles.description}>
          <h1 className={styles.title}>Next.js 13 test</h1>
          <p>Hello {user.name}</p>
        </div>
        <div>
          <Link href="/api/auth/logout">Logout</Link>
        </div>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}

"use client";

import Link from "next/link";
import { useContext } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  NotificationContext,
  NotificationUpdate,
  UserNotifyContextType,
} from "@contexts/NotificationContext";

import { PopoutContext } from "@contexts/PopoutContext";

import { User as PrismaUser, Invite as PrismaInvite } from "@prisma/client";

// TEst action client side
import ActionButton from "@components/basic/ActionButton";
import { incrementUnseenInvites } from "@/utils/actions";

export default function Home({ appUser }: { appUser: UserNotifyContextType }) {
  const { user, error, isLoading } = useUser();
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  const { setAction, filterOpts, setFilterOpts } = useContext(PopoutContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <div>
          <h1
            onClick={() => {
              setFilterOpts({
                darken: !filterOpts.darken,
                blockClick: !filterOpts.blockClick,
                blur: !filterOpts.darken,
              });
            }}
          >
            Next.js 13 test
          </h1>
          <p
            onClick={() => {
              setAction({
                title: "Confirm Action",
                message: "Confirm action",
                callback: () => {
                  console.log("callback");
                },
              });
            }}
          >
            Hello {user.name}
          </p>
        </div>
        <div>
          <Link href="/api/auth/logout">Logout</Link>
        </div>

        <div>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}

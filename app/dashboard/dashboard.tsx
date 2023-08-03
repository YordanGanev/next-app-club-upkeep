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

export default function Dashboard({
  appUser,
}: {
  appUser: UserNotifyContextType;
}) {
  const { user, error, isLoading } = useUser();
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  const { setAction, filterOpts, setFilterOpts } = useContext(PopoutContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return <></>;
  }

  return <a href="/api/auth/login">Login</a>;
}

"use client";
// pages/index.js
import { useUser } from "@auth0/nextjs-auth0/client";

import AppHeader from "./styles/AppHeader.module.css";
import Link from "next/link";
import Image from "next/image";

export default function HeadBar() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <header>
        <div className={AppHeader.wrapper}>
          <div className={AppHeader.icon}>
            <Link key="kUpkeepIcon" href="">
              <Image
                width="40"
                height="40"
                // src="/upkeep_icon.svg"
                src="/icon.png"
                alt="upkeep_icon"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  if (error) return <div>{error.message}</div>;

  // console.error("Header", notification);
  // User Is Loaded
  // Load notification
  if (user) {
    return (
      <header className={AppHeader.header}>
        <div className={AppHeader.wrapper}>
          <div>
            <div className={AppHeader.icon}>
              <Link href="/">
                <Image
                  width="40"
                  height="40"
                  // src="/upkeep_icon.svg"

                  src="/icon.png"
                  alt="upkeep_icon"
                />
              </Link>
            </div>
          </div>

          <div className={AppHeader.loginGroup}>
            <button
              onClick={(e) => {
                if (notify) handleNotificationCb(e);
              }}
              className={AppHeader.notification}
              notify={notify ? "notify" : null}
            >
              {/* {notification.visible} */}
              <i
                className={
                  notification.visible
                    ? "fa-solid fa-bell"
                    : "fa-regular fa-bell"
                }
              ></i>
              {/* <FontAwesomeIcon icon="fa-solid fa-magn/ifying-glass" /> */}
            </button>

            {/* Profile menu */}
            <button
              onClick={(e) => {
                handleProfileMenuCb(e);
              }}
              className={AppHeader.userImage}
            >
              <Image
                width="32"
                height="32"
                src={user.picture}
                alt={`@img-${user.name}`}
              />
              {/* <img src={user.picture} alt={`@img-${user.name}`} /> */}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={AppHeader.header}>
      <div className={AppHeader.wrapper}>
        <div className={AppHeader.icon}>
          <Link href="/">
            <Image
              width="40"
              height="40"
              // src="upkeep_icon.svg"
              src="/icon.png"
              alt="upkeep_icon"
            />
          </Link>
        </div>

        <div className={AppHeader.loginGroup}>
          <Link key="userlogin" href="/api/auth/login">
            Login
          </Link>

          <Link
            className={AppHeader.sign}
            key="userlogin"
            href="/api/auth/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

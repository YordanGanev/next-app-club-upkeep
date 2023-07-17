"use client";

import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFlagCheckered,
  faPeopleGroup,
  faCalendar,
  faBell,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { faBell as farBell } from "@fortawesome/free-regular-svg-icons";

import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Connecting from "@components/basic/connecting";
import { NotificationContext } from "@contexts/NotificationContext";
import { PopoutContext } from "@/contexts/PopoutContext";

import Style from "./styles/Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  const { user, error, isLoading } = useUser();

  const { notification, setNotifyState, setNotifyInvites } =
    useContext(NotificationContext);

  const { setProfileMenuState } = useContext(PopoutContext);

  const [mobileMenuHide, setMobileView] = useState(true);

  const main = pathname.split("/")[2];

  const items = [
    { slug: "clubs", icon: faFlagCheckered },
    { slug: "teams", icon: faPeopleGroup },
    { slug: "schedule", icon: faCalendar },
  ];

  const handleNotification = () => {
    if (notification.options.length === 0) return;

    setNotifyState(true);

    console.log("setNotifyState", true);
    if (!notification.new) return;

    setNotifyInvites(0);
    console.log("setNotifyInvites", 0);

    // fetch(`/api/user/${notification.options[0].userId}/invite`, {
    //   method: "DELETE",
    //   cache: "no-cache",
    // }).then(() => setNotifyInvites(0));
  };

  const addNotify = notification?.options?.length > 0;
  notification?.new;

  return (
    <>
      <div
        className={`${Style.wrapper} ${mobileMenuHide ? Style.closed : null}`}
      >
        <nav>
          <div className={Style.header}>
            <div
              className={Style.menuToggle}
              onClick={() => {
                setMobileView(!mobileMenuHide);
              }}
            >
              <i>
                <FontAwesomeIcon icon={faBars} />
              </i>
            </div>
            <Link href="/dashboard">
              <Image
                src="/icon.png"
                alt="Club Upkeep Logo"
                width="40"
                height="40"
              />
            </Link>
            <h2> Club Upkeep </h2>
          </div>
          <div className={Style.main}>
            {items.map((item) => {
              let current = false;

              if (main === item.slug) {
                current = true;
              }

              return (
                <div key={item.slug} className={Style.linkContainer}>
                  <Link
                    className={`${Style.link} ${current ? Style.select : null}`}
                    href={`/dashboard/${item.slug}`}
                  >
                    <i>
                      <FontAwesomeIcon icon={item.icon} />
                    </i>
                    <span>{item.slug}</span>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className={Style.user}>
            <div
              className={`${Style.notifications} ${
                addNotify ? Style.add : null
              }`}
            >
              <button onClick={handleNotification}>
                <i>
                  <FontAwesomeIcon
                    icon={addNotify === true ? faBell : farBell}
                  />
                  {notification?.new > 0 && (
                    <div className={Style.newNotify}>{notification?.new}</div>
                  )}
                </i>
                <span> Notifications </span>
              </button>
            </div>

            {isLoading && (
              <div className={Style.profile}>
                <Connecting message={null} />
              </div>
            )}
            {!isLoading && user && (
              <button
                className={Style.profile}
                onClick={() => setProfileMenuState(true)}
              >
                <Image
                  width="32"
                  height="32"
                  src={user.picture as any}
                  alt={`@img-${user.name}`}
                />
                <span>
                  {user.name === user.email ? user.nickname : user.name}
                </span>
                <i>
                  <FontAwesomeIcon icon={faEllipsis} />
                </i>
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";

import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Connecting from "components/basic/connecting";
import { NotificationContext } from "contexts/NotificationContext";

import Style from "./styles/Navigation.module.css";

export default function Navigation({ profileMenu }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, error, isLoading } = useUser();

  const { notification, setNotifyState, setNotifyInvites } =
    useContext(NotificationContext);

  const [mobileMenuHide, setMobileView] = useState(true);

  const main = pathname.split("/")[1];

  const items = [
    { slug: "clubs", icon: "fa-solid fa-flag-checkered" },
    { slug: "teams", icon: "fa-solid fa-people-group" },
    { slug: "schedule", icon: "fa-solid fa-calendar" },
  ];

  const handleNotification = () => {
    if (notification.options.length === 0) return;

    setNotifyState(true);

    if (!notification.new) return;

    fetch(`/api/user/${notification.options[0].userId}/invite`, {
      method: "DELETE",
    }).then(setNotifyInvites(0));
  };

  const handleProfileMenu = () => {
    profileMenu.set(!profileMenu.visible);
  };

  const addNotify = notification?.options?.length > 0;
  notification?.new;

  return (
    <>
      <div className={Style.wrapper} closed={mobileMenuHide ? "true" : null}>
        <nav>
          <div className={Style.header}>
            <div
              className={Style.menuToggle}
              onClick={() => {
                setMobileView(!mobileMenuHide);
              }}
            >
              <i
                className={
                  mobileMenuHide ? "fa-solid fa-bars" : "fa-solid fa-minus"
                }
              ></i>
            </div>
            <Link href="/home">
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
                    select={current ? "true" : null}
                    className={Style.link}
                    href={"/" + item.slug}
                  >
                    <i className={item.icon}></i>
                    <span>{item.slug}</span>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className={Style.user}>
            <div className={Style.notifications} add={addNotify ? "" : null}>
              <button onClick={handleNotification}>
                <i
                  className={`${
                    addNotify === true ? "fa-solid" : "fa-regular"
                  } fa-bell`}
                >
                  {notification?.new > 0 && (
                    <div className={Style.newNotify}>{notification?.new}</div>
                  )}
                </i>
                <span> Notifications </span>
              </button>
            </div>

            {isLoading && (
              <div className={Style.profile}>
                <Connecting />
              </div>
            )}
            {!isLoading && user && (
              <button className={Style.profile} onClick={handleProfileMenu}>
                <Image
                  width="32"
                  height="32"
                  src={user.picture}
                  alt={`@img-${user.name}`}
                />
                <span>
                  {user.name === user.email ? user.nickname : user.name}
                </span>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

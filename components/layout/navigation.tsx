"use client";

import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBars,
  faFlagCheckered,
  faPeopleGroup,
  faCalendar,
  faBell,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

import { faBell as farBell } from "@fortawesome/free-regular-svg-icons";

import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Connecting from "@/components/basic/connecting";
import { NotificationContext } from "@/contexts/NotificationContext";
import { PopoutContext } from "@/contexts/PopoutContext";

import Style from "./styles/Navigation.module.css";
import DynamicLink from "@/components/basic/dynamic-link";

export default function Navigation() {
  const pathname = usePathname();

  const { user, isLoading } = useUser();

  const { notification, setNotifyState, setNotifyInvites } =
    useContext(NotificationContext);

  const { setProfileMenuState } = useContext(PopoutContext);

  const t = useTranslations("Nav");

  const [mobileMenuHide, setMobileView] = useState(true);

  useEffect(() => {
    if (mobileMenuHide === false) setMobileView(true);
  }, [pathname]);

  const main = pathname.split("/")[2] || "";

  const items = [
    { slug: "", title: t("home"), icon: faHome },
    { slug: "clubs", title: t("clubs"), icon: faFlagCheckered },
    { slug: "teams", title: t("teams"), icon: faPeopleGroup },
    { slug: "schedule", title: t("schedule"), icon: faCalendar },
  ];

  const handleNotification = () => {
    if (notification.options.length === 0) return;

    setNotifyState(true);

    if (!notification.new) return;

    setNotifyInvites(0);

    fetch(`/api/user/${notification.options[0].userId}/invite`, {
      method: "DELETE",
      cache: "no-cache",
    });
  };

  const addNotify = notification?.options?.length > 0;

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
              <span className={`${Style.iconNotify} fa-layers`}>
                <FontAwesomeIcon icon={faBars} />
                {addNotify && notification?.new > 0 && (
                  <span
                    className={`${Style.newNotify} ${Style.iconNotify} fa-layers-counter`}
                  >
                    {notification?.new > 9 ? "9+" : notification?.new}
                  </span>
                )}
              </span>
            </div>
            <Link href="/about" prefetch={false} legacyBehavior>
              <a>
                <Image
                  src="/icon.png"
                  alt="Club Upkeep Logo"
                  width="40"
                  height="40"
                />
              </a>
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
                <DynamicLink
                  key={`${item.slug}-nav-link`}
                  href={`/dashboard/${item.slug}`}
                  className={Style.linkContainer}
                >
                  <div
                    key={item.slug}
                    className={`${Style.link} ${current ? Style.select : null}`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.title}</span>
                  </div>
                </DynamicLink>
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
                <span className={`${Style.iconNotify} fa-layers`}>
                  <FontAwesomeIcon
                    icon={addNotify === true ? faBell : farBell}
                  />
                  {addNotify && notification?.new > 0 && (
                    <span
                      className={`${Style.newNotify} ${Style.iconNotify} fa-layers-counter`}
                    >
                      {notification?.new > 9 ? "9+" : notification?.new}
                    </span>
                  )}
                </span>
                <span>{t("notifications")}</span>
              </button>
            </div>

            {isLoading && (
              <div className={`${Style.connecting} ${Style.profile}`}>
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
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

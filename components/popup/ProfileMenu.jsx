import { useUser } from "@auth0/nextjs-auth0/client";
import { useOutsideClick } from "utils/hooks";

import { Fragment, useEffect, useState } from "react";

import Link from "next/link";
import Style from "./styles/ProfileMenu.module.css";

export default function ProfileMenu({ state }) {
  const { visible, set } = state;

  const { user, isLoading } = useUser();

  let ref = useOutsideClick(() => set(false));

  return (
    <div ref={ref}>
      {user && visible && set && !isLoading && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={Style.userProfileMenu}
        >
          <div
            className={Style.close}
            onClick={(e) => {
              set(false);
            }}
          ></div>
          <div className={Style.userInfo}>
            <span>{user?.email}</span>
          </div>
          <div className={Style.userMenu}>
            <ul>
              <Link key="kProfile" href="/profile">
                <li>
                  <i className="fa-regular fa-user"></i> Profile
                </li>
              </Link>
              <Link key="kProfileSignOut" href="/api/auth/logout">
                <li>
                  <i className="fa-solid fa-right-from-bracket"></i> Sign out
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

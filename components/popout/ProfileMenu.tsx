"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useOutsideClick } from "@utils/hooks";

import { PopoutContext } from "@contexts/PopoutContext";
import { useContext } from "react";

import Link from "next/link";
import Style from "./styles/ProfileMenu.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export default function ProfileMenu() {
  const { user, isLoading } = useUser();

  const { profileMenuState, setProfileMenuState } = useContext(PopoutContext);
  let ref = useOutsideClick(() => setProfileMenuState(false));

  return (
    <div ref={ref as any}>
      {profileMenuState && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={Style.userProfileMenu}
        >
          <div
            className={Style.close}
            onClick={(e) => {
              setProfileMenuState(false);
            }}
          ></div>
          <div className={Style.userInfo}>
            {isLoading && <span>Loading user info</span>}
            {user && <span>{user?.email}</span>}
          </div>
          <div className={Style.userMenu}>
            <ul>
              <Link key="kProfile" href="/profile">
                <li>
                  <i>
                    <FontAwesomeIcon icon={faUser} />
                  </i>{" "}
                  Profile
                </li>
              </Link>
              <Link key="kProfileSignOut" href="/api/auth/logout">
                <li>
                  <i>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </i>
                  Sign out
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

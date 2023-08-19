"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useOutsideClick } from "@/utils/hooks";

import { PopoutContext } from "@/contexts/PopoutContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

import Link from "next/link";
import Style from "./styles/ProfileMenu.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faSun } from "@fortawesome/free-solid-svg-icons";
import { faUser, faMoon } from "@fortawesome/free-regular-svg-icons";

export default function ProfileMenu() {
  const { user, isLoading } = useUser();

  const { profileMenuState, setProfileMenuState } = useContext(PopoutContext);

  const { theme, setTheme } = useContext(ThemeContext);

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
          <div className={`${Style.userMenu} ${Style.settings}`}>
            <ul>
              <a
                onClick={(e) => {
                  e.preventDefault();

                  if (theme === "light") setTheme("dark");
                  else setTheme("light");

                  setProfileMenuState(false);
                }}
              >
                <li>
                  <i>
                    <FontAwesomeIcon
                      icon={theme === "light" ? faMoon : faSun}
                    />
                  </i>
                  {theme === "light" ? "Dark" : "Light"} theme
                </li>
              </a>
            </ul>
          </div>
          <div className={Style.userMenu}>
            <ul>
              <Link href="/dashboard/profile" legacyBehavior>
                <a>
                  <li>
                    <i>
                      <FontAwesomeIcon icon={faUser} />
                    </i>
                    Profile
                  </li>
                </a>
              </Link>
              <a href="/api/auth/logout">
                <li>
                  <i>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </i>
                  Sign out
                </li>
              </a>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

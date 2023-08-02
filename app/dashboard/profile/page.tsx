import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { prisma } from "@utils/db";

import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import ProfilePage from "./profile-page";
import ProfileForm from "./profile-form";

import Style from "./profile.module.css";

export default async function ServerComponent() {
  const session = await getSession();
  // const accessToken = await getAccessToken();
  const user = session?.user;
  console.log("profile");

  // console.log("session", session);
  // console.log("user", user);

  const appUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!appUser) return <></>;

  if (session) {
    return (
      <>
        <div className={`dashboard-content-wrapper`}>
          <div className={Style.profileWrapper}>
            <div className={Style.profileImage}>
              <Image
                src={appUser.picture}
                alt={`${appUser.name}-img`}
                width="96"
                height="96"
              />
            </div>
            <div>
              <h2>{appUser.name}</h2>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> {appUser.email}
              </p>
              <div className={Style.date}>
                <p>
                  Joinned {new Date(appUser.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Last edit {new Date(appUser.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <ProfileForm appUser={appUser} />
          <ProfilePage appUser={appUser} />
        </div>
      </>
    );
  }

  return <></>;
}

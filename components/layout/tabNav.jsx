import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Style from "./styles/TabHeader.module.css";

export default function TabNav({ tabs, callback }) {
  const router = useRouter();

  const currentTab = router.pathname.slice(
    router.pathname.lastIndexOf("/") + 1
  );

  return (
    <div className={Style.wrapper}>
      <div className={Style.tabs}>
        {tabs?.map((tab) => {
          return (
            <Link
              className={currentTab === tab.slug ? Style.active : ""}
              key={tab.slug}
              //   href={`/clubs/${uid}/${tab.slug}`}
              href={router.asPath.replace(
                /\/[a-zA-Z0-9?=&]+$/g,
                `/${tab.slug}`
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

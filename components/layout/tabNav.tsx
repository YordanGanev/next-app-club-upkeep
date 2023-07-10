"use client";

import Style from "./styles/TabHeader.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabType = {
  slug: string;
  title: string;
};

export default function TabNav({
  tabs,
  callback,
}: {
  tabs: TabType[];
  callback?: void;
}) {
  const pathname = usePathname();

  const basePath = pathname.slice(0, pathname.lastIndexOf("/") + 1);
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1);

  console.warn(basePath, currentTab);
  return (
    <div className={Style.wrapper}>
      <div className={Style.tabs}>
        {tabs?.map((tab: TabType) => {
          return (
            <Link
              className={currentTab === tab.slug ? Style.active : ""}
              key={tab.slug}
              //   href={`/clubs/${uid}/${tab.slug}`}
              // href={router.asPath.replace(
              //   /\/[a-zA-Z0-9?=&]+$/g,
              //   `/${tab.slug}`
              // )}
              href={basePath + tab.slug}
            >
              {tab.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

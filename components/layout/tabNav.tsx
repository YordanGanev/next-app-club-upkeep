"use client";

import Style from "./styles/TabHeader.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabType = {
  slug: string;
  title: string;
};

export default function TabNav({ tabs }: { tabs: TabType[] }) {
  const pathname = usePathname();

  const basePath = pathname.slice(0, pathname.lastIndexOf("/") + 1);
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1);

  // console.warn(basePath, currentTab);
  return (
    <div className={Style.wrapper}>
      <div className={Style.tabs}>
        {tabs?.map((tab: TabType) => {
          return (
            <Link key={tab.slug} href={basePath + tab.slug} legacyBehavior>
              <a className={currentTab === tab.slug ? Style.active : ""}>
                {tab.title}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

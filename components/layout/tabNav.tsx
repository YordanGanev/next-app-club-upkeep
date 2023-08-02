"use client";

import DynamicLink from "@components/basic/dynamic-link";
import Style from "./styles/TabHeader.module.css";

import { usePathname } from "next/navigation";

type TabType = {
  slug: string;
  title: string;
};

export default function TabNav({ tabs }: { tabs: TabType[] }) {
  const pathname = usePathname();

  const basePath = pathname.slice(0, pathname.lastIndexOf("/") + 1);
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1);

  return (
    <div className={Style.wrapper}>
      <div className={Style.tabs}>
        {tabs?.map((tab: TabType) => {
          return (
            <DynamicLink
              key={tab.slug}
              href={basePath + tab.slug}
              className={currentTab === tab.slug ? Style.active : ""}
            >
              {tab.title}
            </DynamicLink>
          );
        })}
      </div>
    </div>
  );
}

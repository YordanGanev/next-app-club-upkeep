import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Style from "./styles/TabHeader.module.css";

export default function TabHeader({ tabs, callback }) {
  const router = useRouter();

  // Switch tabs with url query
  const handleClick = (e, src) => {
    e.preventDefault();

    router.query["tab"] = src;
    router.push(
      {
        query: { ...router.query, tab: src },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (router.query.tab === undefined) {
      router.push(
        {
          query: { ...router.query, tab: tabs[0]?.slug },
        },
        undefined,
        { shallow: true }
      );
    }

    if (callback !== undefined) callback(router.query.tab);
  }, [router.query.tab]);

  if (!router.isReady) return null;
  return (
    <div className={Style.wrapper}>
      <div className={Style.tabs}>
        {tabs?.map((tab) => {
          return (
            <Link
              className={router.query?.tab === tab.slug ? Style.active : ""}
              onClick={(e) => handleClick(e, tab.slug)}
              key={tab.slug}
            >
              {tab.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

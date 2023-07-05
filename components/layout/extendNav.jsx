import Style from "./styles/ExtendNav.module.css";
import Link from "next/link";
import Head from "next/head";

import { useRouter } from "next/router";

export default function ExtendedNav() {
  let router = useRouter();

  const main = router.pathname.split("/")[1];

  let items = [
    { slug: "clubs", icon: "fa-solid fa-anchor" },
    { slug: "teams", icon: "fa-solid fa-people-group" },
    { slug: "schedule", icon: "fa-solid fa-calendar" },
  ];

  return (
    <>
      <nav className={Style.wrapper}>
        <div className={Style.main}>
          {items.map((item) => {
            let current = false;

            if (main === item.slug) {
              current = true;
            }

            return (
              <Link
                key={item.slug}
                select={current ? "true" : null}
                className={Style.link}
                href={"/" + item.slug}
              >
                <i className={item.icon}></i>
                <span>{item.slug}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

import AppHeader from "./styles/AppHeader.module.css";
import Link from "next/link";
import DynamicLink from "@/components/basic/dynamic-link";
import Image from "next/image";

export default function HeadBar({ user }: { user?: any }) {
  if (user) {
    return (
      <header className={AppHeader.header}>
        <div className={AppHeader.wrapper}>
          <div>
            <DynamicLink className={AppHeader.icon} href="/">
              <Image width="40" height="40" src="/icon.png" alt="upkeep_icon" />
            </DynamicLink>
          </div>

          <div>
            {/* Profile menu */}
            <DynamicLink href="/dashboard/profile" className={AppHeader.user}>
              <span>@{user.nickname}</span>
              <div className={AppHeader.userImage}>
                <Image
                  width="32"
                  height="32"
                  src={user.picture}
                  alt={`@img-${user.name}`}
                />
              </div>
            </DynamicLink>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={AppHeader.header}>
      <div className={AppHeader.wrapper}>
        <div className={AppHeader.icon}>
          <DynamicLink href="/">
            <Image width="40" height="40" src="/icon.png" alt="upkeep_icon" />
          </DynamicLink>
        </div>

        <div className={AppHeader.loginGroup}>
          <a href="/api/auth/login">Login</a>

          <a className={AppHeader.sign} href="/api/auth/signup">
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}

import AppHeader from "./styles/AppHeader.module.css";
import Link from "next/link";
import Image from "next/image";

export default function HeadBar({ user }: { user?: any }) {
  if (user) {
    return (
      <header className={AppHeader.header}>
        <div className={AppHeader.wrapper}>
          <div>
            <div className={AppHeader.icon}>
              <Link href="/" legacyBehavior>
                <Image
                  width="40"
                  height="40"
                  src="/icon.png"
                  alt="upkeep_icon"
                />
              </Link>
            </div>
          </div>

          <div>
            {/* Profile menu */}
            <Link href="/dashboard/profile" legacyBehavior>
              <a className={AppHeader.user}>
                <span>@{user.nickname}</span>
                <div className={AppHeader.userImage}>
                  <Image
                    width="32"
                    height="32"
                    src={user.picture}
                    alt={`@img-${user.name}`}
                  />
                </div>
              </a>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={AppHeader.header}>
      <div className={AppHeader.wrapper}>
        <div className={AppHeader.icon}>
          <Link href="/" legacyBehavior>
            <Image width="40" height="40" src="/icon.png" alt="upkeep_icon" />
          </Link>
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

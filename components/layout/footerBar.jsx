import StyleFooter from "./styles/AppFooter.module.css";
import Link from "next/link";

export default function FooterBar() {
  return (
    <footer className={StyleFooter.wrapper}>
      <span>
        <Link className="" href="/about" target="_blank">
          Club Upkeep
        </Link>
        2023 © Copyright
      </span>
    </footer>
  );
}

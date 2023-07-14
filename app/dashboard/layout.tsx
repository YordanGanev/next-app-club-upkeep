import React from "react";

import NotificationProvider from "@contexts/NotificationContext";
import PopoutContextProvider from "@/contexts/PopoutContext";

import Navigation from "@components/layout/navigation";
import PopoutHandler from "@components/popout/PopoutHandler";

import Style from "@styles/dashboard-layout.module.css";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <PopoutContextProvider>
        <div className={Style.wrapper}>
          <div className={Style.data}>
            <Navigation />
            <main className={Style.main}>{children}</main>
          </div>
        </div>
        <PopoutHandler />
      </PopoutContextProvider>
    </NotificationProvider>
  );
}

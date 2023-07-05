// "use client";
// import ProfileMenu from "./ProfileMenu";
// import NotificationsMenu from "./NotificationsMenu";
// import PopupForm from "./PopupForm";
import ConfirmAction from "./ConfirmAction";
import WindowFilter from "./WindowFilter";

export default function PopoutHandler() {
  return (
    <>
      {/* Cover the screen for outside of menu clicks */}
      <WindowFilter />
      {/* <ProfileMenu state={profileMenu} /> */}
      {/* <NotificationsMenu /> */}
      {/* <PopupForm form={form} /> */}
      <ConfirmAction />
    </>
  );
}

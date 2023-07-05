import Style from "./styles/PopupHandler.module.css";
import ProfileMenu from "./ProfileMenu";
import NotificationsMenu from "./NotificationsMenu";
import PopupForm from "./PopupForm";
import ConfirmAction from "./ConfirmAction";

import { useContext } from "react";
import { ConfirmActionContext } from "contexts/ConfirmActionContext";

export default function PopupHandler({ opt, profileMenu, form }) {
  const { confirmAction } = useContext(ConfirmActionContext);

  return (
    <>
      {/* Cover the screen for outside of menu clicks */}
      <div
        className={Style.wrapper}
        blockclicks={opt?.blockClicks || confirmAction.visible ? "true" : null}
        blur={opt?.blur || confirmAction.visible ? "true" : null}
        darken={opt?.darken || confirmAction.visible ? "true" : null}
      />
      <ProfileMenu state={profileMenu} />
      <NotificationsMenu />
      <PopupForm form={form} />
      <ConfirmAction />
    </>
  );
}

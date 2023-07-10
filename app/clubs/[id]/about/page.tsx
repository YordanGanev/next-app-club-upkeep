import TabNav from "@/components/layout/tabNav";

import { ManageClubTabs } from "@/utils/common";

export default function page() {
  return (
    <>
      <TabNav tabs={ManageClubTabs} />
      <h1>About</h1>
    </>
  );
}

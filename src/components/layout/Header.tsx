import { mainNavigation } from "@/config/navigation";
import { getHeaderNavViewModel } from "@/viewmodels/navigation.viewmodel";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

export async function Header() {
  const { items, contact } = await getHeaderNavViewModel();

  return (
    <>
      <AnnouncementBar />
      <HeaderBar items={items} contact={contact} mobileItems={mainNavigation} />
    </>
  );
}

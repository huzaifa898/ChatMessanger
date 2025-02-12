import Sidebar from "@/components/sidebar/Sidebar";
import DesktopSideBar from "@/components/sidebar/DesktopSidebar";
export default async function UsersLayout({
    children
  }: {
    children: React.ReactNode;
  }) {
    return(
        <Sidebar>
        <div className="h-full">
            <DesktopSideBar/>
            <main className="lg:pl-20 h-full">
            {children}
            </main>
        </div>
        </Sidebar>
    )
  }
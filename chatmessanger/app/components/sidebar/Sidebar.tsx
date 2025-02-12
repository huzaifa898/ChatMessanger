import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import MobileFooter from "@/components/sidebar/MobileFooter"
async function Sidebar({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <DesktopSidebar/>
      <MobileFooter/>
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;
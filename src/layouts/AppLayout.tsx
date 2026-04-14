import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/njm/AppSidebar";
import { BrandProvider } from "@/context/BrandContext";
import { AgencyProvider } from "@/context/AgencyContext";
import { CommandPalette } from "@/components/njm/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import natureBg from "@/assets/nature-bg.jpg";

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <AgencyProvider>
      <BrandProvider>
        <div className="relative flex h-screen w-full overflow-hidden">
          {/* Nature background */}
          <img
            src={natureBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-sky-100/30 dark:from-black/40 dark:via-black/30 dark:to-slate-900/50" />

          {/* App shell */}
          <div className="relative z-10 flex h-full w-full">
            <AppSidebar />
            <div className={`flex flex-1 overflow-hidden ${isMobile ? "ml-0" : ""}`}>
              <Outlet />
            </div>
          </div>
          <CommandPalette />
        </div>
      </BrandProvider>
    </AgencyProvider>
  );
}

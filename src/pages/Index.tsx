import { useState } from "react";
import { AppSidebar } from "@/components/njm/AppSidebar";
import { AgencyHubView } from "@/components/njm/AgencyHubView";
import { CEOWorkspaceView } from "@/components/njm/CEOWorkspaceView";
import { PMWorkspaceView } from "@/components/njm/PMWorkspaceView";
import { DocumentDrawer } from "@/components/njm/DocumentDrawer";
import natureBg from "@/assets/nature-bg.jpg";

type View = "agency" | "ceo" | "pm";

const Index = () => {
  const [activeView, setActiveView] = useState<View>("agency");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ id: string; name: string; description: string } | null>(null);

  const handleBrandSelect = (_brandId: string) => {
    setActiveView("ceo");
  };

  const handleOpenDocument = (doc: { id: string; name: string; description: string }) => {
    setActiveDoc(doc);
    setDrawerOpen(true);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Nature background */}
      <img
        src={natureBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-sky-100/30" />

      {/* App shell */}
      <div className="relative z-10 flex h-full w-full">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex flex-1 overflow-hidden">
          {activeView === "agency" && <AgencyHubView onBrandSelect={handleBrandSelect} />}
          {activeView === "ceo" && <CEOWorkspaceView />}
          {activeView === "pm" && <PMWorkspaceView onOpenDocument={handleOpenDocument} />}
        </div>

        <DocumentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} document={activeDoc} />
      </div>
    </div>
  );
};

export default Index;

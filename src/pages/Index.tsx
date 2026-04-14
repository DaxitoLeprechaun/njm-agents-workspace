import { useState } from "react";
import { AppSidebar } from "@/components/njm/AppSidebar";
import { AgencyHubView } from "@/components/njm/AgencyHubView";
import { CEOWorkspaceView } from "@/components/njm/CEOWorkspaceView";
import { PMWorkspaceView } from "@/components/njm/PMWorkspaceView";
import { DocumentDrawer } from "@/components/njm/DocumentDrawer";

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
    <div className="flex h-screen w-full overflow-hidden bg-surface-0">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 overflow-hidden">
        {activeView === "agency" && <AgencyHubView onBrandSelect={handleBrandSelect} />}
        {activeView === "ceo" && <CEOWorkspaceView />}
        {activeView === "pm" && <PMWorkspaceView onOpenDocument={handleOpenDocument} />}
      </div>

      <DocumentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} document={activeDoc} />
    </div>
  );
};

export default Index;

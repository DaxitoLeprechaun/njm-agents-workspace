import { useAgency } from "@/context/AgencyContext";
import { AgencyHubView } from "@/components/njm/AgencyHubView";
import { DayCeroView } from "@/components/njm/DayCeroView";

const Index = () => {
  const { isSetupComplete } = useAgency();
  return isSetupComplete ? <AgencyHubView /> : <DayCeroView />;
};

export default Index;

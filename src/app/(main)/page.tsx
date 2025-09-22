import SymptomChecker from "../components/symptom-checker";
import { StatsBar } from "../components/stats-bar";
import { FeaturesSection } from "../components/features-section";
import { EmergencyHotlines } from "../components/emergency-hotlines";

export default function Home() {
  return (
    <div className="flex-1">
      <SymptomChecker />
      <StatsBar />
      <FeaturesSection />
      <EmergencyHotlines />
    </div>
  );
}

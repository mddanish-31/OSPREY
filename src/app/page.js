import { Hero } from "./components/Hero";
import WhyOsprey from "./components/WhyOsprey";
import HowOspreyWorks from "./components/HowOspreyWorks";
import SatelliteIntelligence from "./components/SatelliteIntelligence";

/**
 * OSPREY — Maritime Intelligence Landing Page
 *
 * Section 1: Oceanic Intelligence / Liquid Glass Hero UI
 * Section 2: Why OSPREY? (Problem → Solution pipeline)
 * Section 3: How OSPREY Works (10-Stage Explainable Maritime Intelligence Workflow)
 * Section 4: Satellite Intelligence (Sentinel-1 SAR & Sentinel-2 Optical Cross-Check)
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <WhyOsprey />
      <HowOspreyWorks />
      <SatelliteIntelligence />
    </main>
  );
}

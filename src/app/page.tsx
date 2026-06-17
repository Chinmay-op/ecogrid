import { Header } from "@/components/Header";
import { HeroScroll } from "@/components/HeroScroll";
import { StageCanvas } from "@/components/StageCanvas";
import { LayersScroll } from "@/components/LayersScroll";
import { ScrollHijacker } from "@/components/ScrollHijacker";
import { RoadmapSections } from "@/components/RoadmapSections";

export default function Home() {
  return (
    <main>
      <ScrollHijacker />
      <Header />
      <StageCanvas />
      <HeroScroll />
      <LayersScroll />
      <RoadmapSections />
    </main>
  );
}

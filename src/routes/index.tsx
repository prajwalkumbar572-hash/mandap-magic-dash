import { createFileRoute } from "@tanstack/react-router";
import { GameCanvas } from "@/components/game/GameCanvas";
import { HUD } from "@/components/game/HUD";

export const Route = createFileRoute("/")({
  ssr: false, // WebGL canvas must never render on the server
  head: () => ({
    meta: [
      { title: "Bappa Mandap Challenge — Ganesh Chaturthi 3D Game" },
      {
        name: "description",
        content:
          "Decorate a Ganesh Chaturthi mandap in 60 seconds! Place flowers, diyas, rangoli and garlands, complete challenges and earn Bappa's blessing in this festive 3D browser game.",
      },
      { property: "og:title", content: "Bappa Mandap Challenge — Ganesh Chaturthi 3D Game" },
      {
        property: "og:description",
        content:
          "A 60-second festive decorating game: adorn the mandap, complete challenges and fill Bappa's Blessing Meter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1c0f0a]">
      <GameCanvas />
      <HUD />
    </div>
  );
}

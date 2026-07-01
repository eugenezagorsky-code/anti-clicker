"use client";

import { Suspense } from "react";
import { CommandDashboard } from "@/components/dashboard/CommandDashboard";
import { DevPhaseBootstrap } from "@/components/dev/DevPhaseBootstrap";
import { RegistryOfShame } from "@/components/gameover/RegistryOfShame";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { useGame } from "@/context/GameContext";

function HomePageContent() {
  const { gameState, state } = useGame();

  if (gameState === "ONBOARDING") {
    return <WelcomeScreen />;
  }

  if (state.phase === "gameOver") {
    return <RegistryOfShame />;
  }

  return <CommandDashboard />;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <DevPhaseBootstrap />
      <HomePageContent />
    </Suspense>
  );
}

import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // este pacote precisa estar instalado
import { loadFull } from "tsparticles";


const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // Carrega o preset slim (mais leve e compatível)
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: { value: "#121212" },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: { repulse: { distance: 120, duration: 0.4 } },
        },
        particles: {
          number: { value: 70 },
          color: { value: "#ff0000" },
          links: { enable: true, color: "#ff0000", distance: 150 },
          move: { enable: true, speed: 2 },
          opacity: { value: 0.5 },
          size: { value: 3 },
        },
        detectRetina: true,
      }}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default ParticlesBackground;

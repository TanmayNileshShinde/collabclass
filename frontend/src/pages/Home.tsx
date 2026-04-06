import { useEffect, useState } from "react";
import MeetingTypeList from "@/components/MeetingTypeList";

// Animated SVG wave layer
const OceanWaves = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: "120px" }}
    >
      <path
        d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,40 1440,60 L1440,120 L0,120 Z"
        fill="rgba(0,100,180,0.08)"
        style={{
          animation: "waveMove 8s ease-in-out infinite",
        }}
      />
      <path
        d="M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,65 C1320,50 1400,80 1440,75 L1440,120 L0,120 Z"
        fill="rgba(0,150,220,0.06)"
        style={{
          animation: "waveMove 12s ease-in-out infinite reverse",
        }}
      />
    </svg>

    <style>{`
      @keyframes waveMove {
        0%, 100% { d: path("M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,40 1440,60 L1440,120 L0,120 Z"); }
        50% { d: path("M0,40 C180,70 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1380,30 1440,45 L1440,120 L0,120 Z"); }
      }
      @keyframes drift {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
        33% { transform: translateY(-12px) translateX(6px); opacity: 1; }
        66% { transform: translateY(-6px) translateX(-4px); opacity: 0.8; }
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400%); }
      }
      @keyframes depthPulse {
        0%, 100% { opacity: 0.15; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(1.05); }
      }
      @keyframes glitchShift {
        0%, 90%, 100% { clip-path: inset(0 0 100% 0); opacity: 0; }
        91% { clip-path: inset(20% 0 60% 0); opacity: 0.4; transform: translateX(-3px); }
        93% { clip-path: inset(50% 0 30% 0); opacity: 0.3; transform: translateX(3px); }
        95% { clip-path: inset(10% 0 80% 0); opacity: 0.4; transform: translateX(0); }
      }
      @keyframes floatBubble {
        0% { transform: translateY(0) scale(1); opacity: 0.7; }
        50% { transform: translateY(-40px) scale(1.1); opacity: 1; }
        100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
      }
      @keyframes shimmerText {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `}</style>
  </div>
);

// Floating bubble particles
const Bubbles = () => {
  const bubbles = [
    { size: 6, left: "12%", delay: "0s", duration: "6s", bottom: "10%" },
    { size: 4, left: "25%", delay: "1.5s", duration: "8s", bottom: "5%" },
    { size: 8, left: "45%", delay: "3s", duration: "7s", bottom: "15%" },
    { size: 3, left: "62%", delay: "0.8s", duration: "9s", bottom: "8%" },
    { size: 5, left: "78%", delay: "2.2s", duration: "6.5s", bottom: "12%" },
    { size: 7, left: "88%", delay: "4s", duration: "7.5s", bottom: "6%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: b.bottom,
            background: `radial-gradient(circle at 30% 30%, rgba(150,220,255,0.9), rgba(0,150,220,0.3))`,
            border: "1px solid rgba(0,200,255,0.4)",
            boxShadow: "0 0 6px rgba(0,200,255,0.4)",
            animation: `floatBubble ${b.duration} ${b.delay} ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Scanline overlay for depth
const Scanlines = () => (
  <div
    className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,1) 2px, rgba(0,200,255,1) 3px)",
      backgroundSize: "100% 3px",
    }}
  />
);

// Glitch duplicate of the time text
const GlitchLayer = ({ time }: { time: string }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    aria-hidden
    style={{
      font: "inherit",
      color: "rgba(0,229,255,0.6)",
      animation: "glitchShift 7s linear infinite",
    }}
  >
    <span
      className="text-5xl font-extrabold lg:text-8xl tracking-tight"
      style={{ position: "absolute", bottom: "3rem", left: "3rem" }}
    >
      {time}
    </span>
  </div>
);

// Depth sonar ring
const SonarRing = () => (
  <div className="absolute top-8 right-8 pointer-events-none">
    <div
      className="w-20 h-20 rounded-full border flex items-center justify-center"
      style={{
        borderColor: "rgba(0,180,255,0.2)",
        background: "rgba(0,20,50,0.4)",
        backdropFilter: "blur(4px)",
      }}
    >
      {[14, 9, 5].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size * 4,
            height: size * 4,
            borderColor: `rgba(0,200,255,${0.15 + i * 0.08})`,
            animation: `depthPulse ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      {/* Sweep line */}
      <div
        className="absolute w-px h-8 origin-bottom"
        style={{
          background: "linear-gradient(to top, rgba(0,229,255,0.8), transparent)",
          transformOrigin: "bottom center",
          bottom: "50%",
          left: "50%",
          marginLeft: "-0.5px",
          animation: "spin 4s linear infinite",
        }}
      />
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: "#00e5ff",
          boxShadow: "0 0 8px rgba(0,229,255,1)",
        }}
      />
    </div>
  </div>
);

// Depth meter on the left
const DepthMeter = () => {
  const [depth, setDepth] = useState(247);
  useEffect(() => {
    const id = setInterval(() => {
      setDepth((d) => d + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none"
      style={{ opacity: 0.6 }}
    >
      <div className="w-px h-16 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.6))" }} />
      <div
        className="text-[9px] font-mono tracking-widest px-2 py-1 rounded"
        style={{
          color: "rgba(0,229,255,0.8)",
          background: "rgba(0,20,50,0.5)",
          border: "1px solid rgba(0,180,255,0.2)",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          letterSpacing: "0.15em",
        }}
      >
        {depth}m
      </div>
      <div className="w-px h-16 rounded-full" style={{ background: "linear-gradient(to top, transparent, rgba(0,200,255,0.6))" }} />
    </div>
  );
};

const Home = () => {
  const now = new Date();
  const [time, setTime] = useState(
    now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full flex flex-col gap-8 text-white transition-all duration-300">
      <div
        className="h-[320px] w-full rounded-[24px] relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #020b18 0%, #041526 40%, #062040 100%)",
          border: "1px solid rgba(0,180,255,0.14)",
          boxShadow: "0 0 60px rgba(0,100,180,0.18), inset 0 1px 0 rgba(0,200,255,0.08)",
          transition: "box-shadow 0.5s ease, transform 0.5s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 80px rgba(0,150,220,0.35), 0 20px 60px rgba(0,80,160,0.3), inset 0 1px 0 rgba(0,200,255,0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 60px rgba(0,100,180,0.18), inset 0 1px 0 rgba(0,200,255,0.08)";
        }}
      >
        {/* Base gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 0%, rgba(0,120,200,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 100%, rgba(0,60,120,0.28) 0%, transparent 50%)",
          }}
        />

        {/* Hover shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,180,255,0.07) 0%, transparent 50%, rgba(0,100,220,0.09) 100%)",
          }}
        />

        {/* Grid caustics */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(0,150,255,0.04) 80px, rgba(0,150,255,0.04) 81px), repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(0,150,255,0.03) 120px, rgba(0,150,255,0.03) 121px)",
          }}
        />

        <Scanlines />
        <OceanWaves />
        <Bubbles />
        <SonarRing />
        <DepthMeter />

        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(2,11,24,0.75) 0%, transparent 55%)",
          }}
        />

        <GlitchLayer time={time} />

        <div className="flex h-full flex-col justify-between max-md:px-6 max-md:py-10 lg:p-12 relative z-10">
          {/* Status badge */}
          <div
            className="max-w-[280px] rounded-xl py-3 px-6 text-center text-sm font-medium backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 cursor-default"
            style={{
              background: "rgba(0,30,60,0.7)",
              border: "1px solid rgba(0,180,255,0.2)",
              boxShadow:
                "0 0 20px rgba(0,100,200,0.15), inset 0 1px 0 rgba(0,200,255,0.1)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: "#00e5ff",
                  boxShadow: "0 0 8px rgba(0,229,255,0.8)",
                }}
              />
              <span style={{ color: "rgba(180,230,255,0.95)" }}>
                No Upcoming Meeting
              </span>
            </div>
          </div>

          {/* Time + date */}
          <div className="flex flex-col gap-2">
            {/* Coords label */}
            <div
              className="text-[10px] font-mono tracking-[0.3em] mb-1"
              style={{ color: "rgba(0,200,255,0.45)" }}
            >
              ◈ CoOLLABCLASS SERVICE · LIVE
            </div>

            <h1
              className="text-5xl font-extrabold lg:text-8xl tracking-tight drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] select-none"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #7dd3fc 35%, #0ea5e9 65%, #0369a1 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(14,165,233,0.5))",
                animation: "shimmerText 4s linear infinite",
              }}
            >
              {time}
            </h1>

            <p
              className="text-lg font-medium lg:text-xl tracking-wide"
              style={{ color: "rgba(147,210,255,0.85)" }}
            >
              {date}
            </p>
          </div>
        </div>

        {/* Decorative glows */}
        <div
          className="absolute top-4 right-4 w-20 h-20 rounded-full blur-2xl animate-pulse"
          style={{ background: "rgba(0,150,255,0.15)" }}
        />
        <div
          className="absolute bottom-8 left-8 w-32 h-32 rounded-full blur-3xl animate-pulse"
          style={{
            background: "rgba(0,100,200,0.12)",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full blur-xl animate-pulse"
          style={{
            background: "rgba(0,200,255,0.1)",
            animationDelay: "2s",
          }}
        />

        {/* Edge glows */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,180,255,0.5), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,150,255,0.25), transparent)",
          }}
        />

        {/* Corner accent marks */}
        {[
          { top: 12, left: 12 },
          { top: 12, right: 12 },
          { bottom: 12, left: 12 },
          { bottom: 12, right: 12 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 pointer-events-none"
            style={{
              ...pos,
              borderTop: i < 2 ? "1px solid rgba(0,200,255,0.35)" : undefined,
              borderBottom: i >= 2 ? "1px solid rgba(0,200,255,0.35)" : undefined,
              borderLeft: i % 2 === 0 ? "1px solid rgba(0,200,255,0.35)" : undefined,
              borderRight: i % 2 !== 0 ? "1px solid rgba(0,200,255,0.35)" : undefined,
            }}
          />
        ))}
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
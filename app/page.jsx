'use client';

import React, { useState, useEffect, useContext, createContext } from "react";

const COLORS = {
  primary: "#A27C48",
  beige: "#DDD6CE",
  accent: "#C74C4C",
  leaf: "#8FBC8F",
  ink: "#2A2A2A"
};

// Neutral steam (white)
const STEAM_SOLID = "rgba(255,255,255,1)";
const STEAM_FADE  = "rgba(255,255,255,0)";

const formatPrice = (cents) => `€ ${(cents / 100).toFixed(2)}`;

const Api = {
  async fetchTeas() {
    const res = await fetch("/api/teas", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch teas");
    return res.json();
  },
  async fetchTeaById(id) {
    const res = await fetch(`/api/teas/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Tea not found");
    return res.json();
  },
  async startCheckout(payload) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Checkout failed");
    return res.json();
  },
  async subscribe(email) {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) return { ok: false };
    return res.json();
  }
};

const CartCtx = createContext(null);

function useCart() {
  return useContext(CartCtx);
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sumiko_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("sumiko_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (tea, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === tea.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: tea.id, name: tea.name, priceCents: tea.priceCents, image: tea.image, qty }];
    });
  };
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);

  const subtotal = items.reduce((s, it) => s + it.priceCents * it.qty, 0);
  const shippingCents = subtotal > 5000 || items.length === 0 ? 0 : 495;
  const total = subtotal + shippingCents;

  const value = { items, add, remove, setQty, clear, subtotal, shippingCents, total };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

function SiteLayout({ children }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen" style={{ background: COLORS.beige, color: COLORS.ink }}>
      <TopBar onOpenCart={() => setOpen(true)} cartCount={cart.items.reduce((n,i)=>n+i.qty,0)} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function TopBar({ onOpenCart, cartCount }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#F3EFE6]/70 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6">
        <div className="flex items-center gap-3"><LogoWordmark /></div>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
          <a href="/story" className="hover:opacity-80">Story</a>
          <a href="#teas" className="hover:opacity-80">Teas</a>
          <a href="#ritual" className="hover:opacity-80">Ritual</a>
          <a href="#journal" className="hover:opacity-80">Journal</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
        </nav>
        <button onClick={onOpenCart} className="ml-auto md:ml-0 relative rounded-full border px-3 py-1.5 text-sm hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
          Cart
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function Enso() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" aria-label="Sumiko logo" className="shrink-0">
      <circle cx="50" cy="50" r="40" fill="none" stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeDasharray="10 14" strokeOpacity="0.35"/>
    </svg>
  );
}

function LogoWordmark() {
  return (
    <svg width="240" height="64" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" aria-label="Sumiko">
      <g>
        <path d="M53 74c12-10 20-25 18-38-2-13-13-19-23-16-10 3-15 14-13 24 2 10 9 21 18 30z" stroke={COLORS.primary} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 65c-4-8-6-15-5-21 1-6 5-10 9-11" stroke={COLORS.primary} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <text x="95" y="42" style={{ fontFamily: "Georgia, serif", fontSize: 34, letterSpacing: "1.5px", fill: COLORS.primary }}>SUMIKO</text>
      <text x="95" y="60" style={{ fontFamily: "Georgia, serif", fontSize: 12, fill: "#6B6258" }}>Let the leaves speak</text>
    </svg>
  );
}

function Hero({ onScrollToTeas }) {
  const [plumes, setPlumes] = React.useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [activeVideo, setActiveVideo] = React.useState(0); // 0 or 1 for double buffering
  const videoRefs = [React.useRef(null), React.useRef(null)];
  const backgroundVideoRef = React.useRef(null);
  
  const videos = [
    '/videos/Sumiko_Hero_001.mp4',
    '/videos/Sumiko_Hero_002.mp4',
    '/videos/Sumiko_Hero_003.mp4',
    '/videos/Sumiko_Hero_004.mp4'
  ];

  const backgroundVideo = '/videos/Sumiko_BKGRND_Loop.mp4';

  React.useEffect(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    // More plumes for constant coverage
    const count = 10;
    const baseLefts = Array.from({ length: count }, (_, i) => 4 + (92 / (count - 1)) * i);
    const generated = baseLefts.map((left, i) => {
      const jitter = rand(-4, 4);
      const width = rand(200, 280);
      const height = rand(240, 320);
      // Shorter duration for more frequent cycles, but with overlap
      const duration = rand(9, 12);
      // Stagger delays more evenly to ensure constant coverage
      const baseDelay = -(duration / count) * i;
      const delay = baseDelay + rand(-1, 1);
      return {
        left: Math.max(1, Math.min(98, left + jitter)),
        width,
        height,
        drift: rand(-30, 30),
        scale: rand(0.92, 1.1),
        rotate: rand(-3, 3),
        duration,
        delay
      };
    });
    setPlumes(generated);
  }, []);

  // Handle video end and switch - iOS compatible
  React.useEffect(() => {
    const currentVideo = videoRefs[activeVideo].current;
    if (!currentVideo) return;

    const handleVideoEnd = () => {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      const nextVideo = videoRefs[1 - activeVideo].current;
      
      // Switch to next video immediately (it should be preloaded)
      setActiveVideo(1 - activeVideo);
      setCurrentVideoIndex(nextIndex);
      
      if (nextVideo) {
        nextVideo.setAttribute('playsinline', 'true');
        nextVideo.setAttribute('webkit-playsinline', 'true');
        nextVideo.currentTime = 0;
        if (nextVideo.readyState >= 2) {
          nextVideo.play().catch(() => {});
        } else {
          nextVideo.addEventListener('canplaythrough', () => {
            nextVideo.play().catch(() => {});
          }, { once: true });
        }
      }
    };

    currentVideo.addEventListener('ended', handleVideoEnd);
    return () => currentVideo.removeEventListener('ended', handleVideoEnd);
  }, [currentVideoIndex, activeVideo, videos.length]);

  // Ensure current video plays and preload next - iOS compatible
  React.useEffect(() => {
    const currentVideo = videoRefs[activeVideo].current;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = videoRefs[1 - activeVideo].current;

    if (currentVideo) {
      // Set iOS attributes
      currentVideo.setAttribute('playsinline', 'true');
      currentVideo.setAttribute('webkit-playsinline', 'true');
      
      if (currentVideo.readyState >= 2) {
        currentVideo.play().catch(() => {});
      } else {
        const playWhenReady = () => {
          currentVideo.play().catch(() => {});
        };
        currentVideo.addEventListener('canplaythrough', playWhenReady, { once: true });
      }
    }

    // Preload next video with iOS attributes
    if (nextVideo) {
      nextVideo.setAttribute('playsinline', 'true');
      nextVideo.setAttribute('webkit-playsinline', 'true');
      nextVideo.load();
    }
  }, [currentVideoIndex, activeVideo]);

  // Start background loop video - force play on iOS
  React.useEffect(() => {
    const bgVideo = backgroundVideoRef.current;
    if (bgVideo) {
      // Force play on iOS
      bgVideo.setAttribute('playsinline', 'true');
      bgVideo.setAttribute('webkit-playsinline', 'true');
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay fails, try again after user interaction
          const tryPlay = () => {
            bgVideo.play().catch(() => {});
            document.removeEventListener('touchstart', tryPlay);
            document.removeEventListener('click', tryPlay);
          };
          document.addEventListener('touchstart', tryPlay, { once: true });
          document.addEventListener('click', tryPlay, { once: true });
        });
      }
    }
  }, []);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#F3EFE6] p-8 md:p-12 shadow-lg">
      <style>{`
        /* Make steam more visible and add gentle sway */
        @keyframes steamRiseA { 0%{transform:translateY(24px) translateX(-8px) scale(1);opacity:0} 30%{opacity:.55} 100%{transform:translateY(-90px) translateX(-10px) scale(1.1);opacity:0} }
        @keyframes steamRiseB { 0%{transform:translateY(30px) translateX(6px) scale(1);opacity:0} 35%{opacity:.45} 100%{transform:translateY(-80px) translateX(10px) scale(1.08);opacity:0} }
        @keyframes steamRiseC { 0%{transform:translateY(20px) translateX(0px) scale(1);opacity:0} 35%{opacity:.5} 100%{transform:translateY(-95px) translateX(4px) scale(1.12);opacity:0} }
        @keyframes breathe { 0%,100%{opacity:.85} 50%{opacity:1} }
        @keyframes sway { 0%,100%{ transform: translateX(-50%) rotate(-1deg);} 50%{ transform: translateX(-50%) rotate(1deg);} }
        /* Stronger steam with horizontal drift + persistent opacity */
        @keyframes steamUpA { 
          0%{ transform: translate(-50%, 28px) scale(1); opacity: .95; } 
          25%{ transform: translate(-48%, -20px) scale(1.05); opacity: .95; }
          50%{ transform: translate(-52%, -80px) scale(1.12); opacity: .9; }
          75%{ transform: translate(-49%, -140px) scale(1.16); opacity: .75; }
          100%{ transform: translate(-50%, -200px) scale(1.2); opacity: .6; } 
        }
        @keyframes steamUpB { 
          0%{ transform: translate(-50%, 30px) scale(1); opacity: .94; } 
          25%{ transform: translate(-52%, -10px) scale(1.04); opacity: .94; }
          50%{ transform: translate(-48%, -70px) scale(1.1); opacity: .88; }
          75%{ transform: translate(-51%, -130px) scale(1.15); opacity: .72; }
          100%{ transform: translate(-50%, -190px) scale(1.18); opacity: .58; } 
        }
        @keyframes steamUpC { 
          0%{ transform: translate(-50%, 24px) scale(1); opacity: .92; } 
          25%{ transform: translate(-49%, -14px) scale(1.03); opacity: .92; }
          50%{ transform: translate(-51%, -75px) scale(1.08); opacity: .86; }
          75%{ transform: translate(-50%, -135px) scale(1.14); opacity: .7; }
          100%{ transform: translate(-50%, -185px) scale(1.16); opacity: .55; } 
        }

        /* New: organic wisps that rise, drift, rotate, and fade */
        @keyframes wispRise {
          0%   { transform: translate(var(--x0,0), 36px)  scale(var(--sx,1))            rotate(var(--r0,0deg)); opacity: 0; }
          10%  { transform: translate(var(--x0,0), 10px)  scale(calc(var(--sx,1) * 1))  rotate(var(--r0,0deg)); opacity: .4; }
          50%  { transform: translate(calc(var(--x0,0) + var(--drift,30px)), -100px) scale(calc(var(--sx,1) * 1.06)) rotate(calc(var(--r0,0deg) + var(--spin,14deg))); opacity: .75; }
          90%  { transform: translate(calc(var(--x0,0) + var(--drift,30px)), -210px) scale(calc(var(--sx,1) * 1.1))  rotate(calc(var(--r0,0deg) + var(--spin,18deg))); opacity: .6; }
          100% { transform: translate(calc(var(--x0,0) + var(--drift,30px)), -240px) scale(calc(var(--sx,1) * 1.12)) rotate(calc(var(--r0,0deg) + var(--spin,22deg))); opacity: 0; }
        }
        .wisp {
          position: absolute;
          bottom: 0;
          border-radius: 9999px;
          background: radial-gradient(60% 80% at 50% 100%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%);
          filter: url(#steamNoise) blur(6px) contrast(140%) brightness(115%);
          animation: wispRise var(--dur,8s) linear infinite;
          animation-delay: var(--delay,0s);
          will-change: transform, opacity;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* Broad cloud plumes - constant coverage with smoother transitions, starting from below viewport */
        @keyframes plumeRise {
          0% { transform: translate(var(--px,0), -100px) scale(calc(var(--ps,1) * .92)) rotate(var(--pr,0deg)); opacity: .2; }
          10% { transform: translate(var(--px,0), -80px) scale(calc(var(--ps,1) * .94)) rotate(var(--pr,0deg)); opacity: .4; }
          25% { transform: translate(var(--px,0), -40px)  scale(calc(var(--ps,1) * .96)) rotate(var(--pr,0deg)); opacity: .55; }
          50% { transform: translate(calc(var(--px,0) + var(--pdrift,30px)), -140px) scale(calc(var(--ps,1) * 1.02)) rotate(calc(var(--pr,0deg) + 2deg)); opacity: .75; }
          75% { transform: translate(calc(var(--px,0) + var(--pdrift,30px)), -260px) scale(calc(var(--ps,1) * 1.06)) rotate(calc(var(--pr,0deg) + 4deg)); opacity: .65; }
          90% { transform: translate(calc(var(--px,0) + var(--pdrift,30px)), -340px) scale(calc(var(--ps,1) * 1.09)) rotate(calc(var(--pr,0deg) + 5deg)); opacity: .4; }
          100% { transform: translate(calc(var(--px,0) + var(--pdrift,30px)), -400px) scale(calc(var(--ps,1) * 1.12)) rotate(calc(var(--pr,0deg) + 6deg)); opacity: .1; }
        }
        .plume {
          position: absolute;
          bottom: 0;
          border-radius: 60% 55% 50% 60% / 65% 60% 50% 55%;
          background: radial-gradient(60% 90% at 50% 80%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%);
          filter: url(#steamNoise) blur(14px) contrast(130%) brightness(118%);
          transform-origin: 50% 100%;
          animation: plumeRise var(--pdur,11.5s) linear infinite both;
          animation-delay: var(--pdelay,0s);
          will-change: transform, opacity;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0;
        }
        /* Hide video controls on iOS */
        video::-webkit-media-controls {
          display: none !important;
        }
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
      `}</style>

      {/* Hero background videos - double buffering for seamless transitions */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        {/* Background loop video */}
        <video
          ref={backgroundVideoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        
        {/* Foreground rotating videos */}
        {videoRefs.map((ref, i) => {
          const videoIndex = i === activeVideo ? currentVideoIndex : (currentVideoIndex + 1) % videos.length;
          return (
            <video
              key={i}
              ref={ref}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                i === activeVideo ? 'z-10 opacity-60' : 'z-0 opacity-0'
              }`}
              muted
              loop={false}
              playsInline
              autoPlay
              preload="auto"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src={videos[videoIndex]} type="video/mp4" />
            </video>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F3EFE6]/40 to-[#F3EFE6]/80 z-20" />
      </div>

      {/* SVG noise filter for realistic steam distortion */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
        <filter id="steamNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7">
            <animate attributeName="baseFrequency" dur="24s" values="0.008 0.012;0.012 0.018;0.008 0.012" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="16">
            <animate attributeName="scale" dur="20s" values="12;18;12" repeatCount="indefinite" />
          </feDisplacementMap>
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </svg>

      {/* Steam – animated clouds (white, with noise distortion) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 z-[2] overflow-hidden" style={{ WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,0.35) 24px, rgba(0,0,0,1) 64px)" }}>
        {/* subtle dark band for contrast */}
        <div className="absolute inset-x-0 bottom-0 h-52" style={{ background: "radial-gradient(120% 100% at 50% 100%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 70%)", filter: "blur(12px)" }} />
        {/* base white mist with noise (lighter to avoid initial blotches) */}
        <div className="absolute inset-x-0 bottom-0 h-36" style={{ background: `radial-gradient(120% 100% at 50% 100%, rgba(255,255,255,0.35) 0%, ${STEAM_FADE} 70%)`, filter: "url(#steamNoise) blur(10px) contrast(120%) brightness(115%)", mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,0.4) 20px, rgba(0,0,0,1) 60px)" }} />

        {/* broad cloud plumes across the width with randomized offsets per load */}
        {plumes.map((p, i) => (
          <div
            key={i}
            className="plume"
            style={{
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              '--px': '0px',
              '--pdrift': `${p.drift}px`,
              '--ps': p.scale,
              '--pr': `${p.rotate}deg`,
              '--pdur': `${p.duration}s`,
              '--pdelay': `${p.delay}s`
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-0" style={{ animation: "breathe 12s ease-in-out infinite", boxShadow: "inset 0 0 220px rgba(0,0,0,0.14)" }} />

      <div className="max-w-3xl relative z-[3]">
        <h1 className="font-serif text-4xl md:text-5xl leading-tight" style={{ color: COLORS.ink }}>
          Tea as a pause.{" "}
          <span className="text-[color:var(--primary)]" style={{ color: COLORS.primary }}>
            Let the leaves speak.
          </span>
        </h1>
        <p className="mt-4 text-neutral-700">
          Carefully sourced Chinese teas curated in Japan. Poured slowly, shared warmly — like visiting a friend’s living room.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onScrollToTeas} className="px-4 py-2 rounded-xl text-white font-medium hover:opacity-90" style={{ background: COLORS.primary }}>
            Explore Teas
          </button>
          <a href="/story" className="px-4 py-2 rounded-xl border font-medium hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>Our Story</h2>
          <p className="mt-2 text-neutral-700">
            Born between Chinese tea lineages and Japanese stillness, Sumiko shares real tea the way it’s felt — not performed.
            Slow, human, and warm.
          </p>
        </div>
        <div>
          <a href="/story" className="px-4 py-2 rounded-xl border font-medium hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            Read the full story
          </a>
        </div>
      </div>
    </section>
  );
}

function Teas({ onOpenDetail }) {
  const [teas, setTeas] = useState([]);
  const cart = useCart();
  useEffect(() => { Api.fetchTeas().then(setTeas).catch(()=>setTeas([])); }, []);

  return (
    <section id="teas" className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>Teas</h2>
        <div className="flex gap-2 text-sm">
          <select className="border rounded-md px-2 py-1 bg-white">
            <option>All types</option>
            <option>Green</option>
            <option>Oolong</option>
            <option>Dark</option>
            <option>Scented</option>
          </select>
          <select className="border rounded-md px-2 py-1 bg-white">
            <option>Sort: Featured</option>
            <option>Sort: Price (low → high)</option>
            <option>Sort: Price (high → low)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teas.map((t) => (
          <TeaCard key={t.id} tea={t} onOpenDetail={() => onOpenDetail(t.id)} onAdd={() => cart.add(t, 1)} />
        ))}
      </div>
    </section>
  );
}

function TeaCard({ tea, onOpenDetail, onAdd }) {
  const [justAdded, setJustAdded] = React.useState(false);
  const handleAdd = () => {
    onAdd();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow hover:shadow-lg transition">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={tea.image} alt={tea.name} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg" style={{ color: COLORS.ink }}>{tea.name}</h3>
        <p className="text-sm text-neutral-600">{tea.type} · {tea.region}</p>
        <p className="mt-1 text-sm text-neutral-700">{tea.tasting}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[15px] font-medium" style={{ color: COLORS.primary }}>{formatPrice(tea.priceCents)}</span>
          <div className="flex gap-2">
            <button onClick={onOpenDetail} className="px-3 py-1.5 rounded-lg text-sm text-white" style={{ background: COLORS.primary }}>Details</button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg text-sm border transition-all hover:bg-black/5 hover:border-transparent hover:text-white active:scale-[.97]"
              style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: justAdded ? COLORS.primary : 'transparent' }}
            >
              {justAdded ? 'Added ✓' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Ritual() {
  return (
    <section id="ritual" className="mt-12 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>Ritual (Brewing)</h2>
        <ol className="mt-3 list-decimal pl-6 text-neutral-700 space-y-1">
          <li>Measure leaves (by gram) and warm your vessel.</li>
          <li>Heat water appropriate to the tea type.</li>
          <li>Bloom briefly; pour slowly; breathe.</li>
          <li>Taste; adjust time; reinfuse.</li>
        </ol>
        <p className="mt-3 text-sm text-neutral-600">Multiple infusions reveal layers. Let the leaves speak.</p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h3 className="font-serif text-xl" style={{ color: COLORS.accent }}>Tools</h3>
        <ul className="list-disc pl-5 text-neutral-700 space-y-1 mt-2">
          <li>Scale, kettle with temp control, gaiwan or small pot, fairness cup, cups.</li>
          <li>Optional: tea tray, filter, timer.</li>
        </ul>
      </div>
    </section>
  );
}

function Journal() {
  const posts = [
    { id: 1, title: "Why we don’t rush tea", date: "2025-11-01" },
    { id: 2, title: "Visiting a small farm in Fujian", date: "2025-11-07" }
  ];
  return (
    <section id="journal" className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>Journal</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <article key={p.id} className="rounded-xl border p-4 hover:bg-black/5 transition">
              <div className="text-sm text-neutral-500">{p.date}</div>
              <h3 className="font-medium text-neutral-800">{p.title}</h3>
              <button className="mt-2 text-sm underline" aria-label={`Read ${p.title}`}>
                Read →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await Api.subscribe(email);
    setOk(!!res?.ok);
  };

  return (
    <section id="contact" className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>Stay in touch</h2>
          <p className="mt-2 text-neutral-700">We write slowly. When we have something worth saying.</p>
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border px-3 py-2" required />
          <button type="submit" className="rounded-lg px-4 py-2 text-white" style={{ background: COLORS.primary }}>
            Join
          </button>
        </form>
        {ok && <div className="text-sm text-green-700">Subscribed. Thank you.</div>}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 py-10 text-center text-sm text-neutral-600">
      © {new Date().getFullYear()} Sumiko — Let the leaves speak.
    </footer>
  );
}

function ProductModal({ open, teaId, onClose }) {
  const [tea, setTea] = useState(null);
  const cart = useCart();
  useEffect(() => {
    if (!open || !teaId) return;
    Api.fetchTeaById(teaId).then(setTea).catch(()=>setTea(null));
  }, [open, teaId]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        {tea ? (
          <>
            <div className="aspect-video overflow-hidden">
              <img src={tea.image} alt={tea.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-serif text-2xl" style={{ color: COLORS.ink }}>{tea.name}</h3>
              <div className="text-sm text-neutral-600">{tea.type} · {tea.region}</div>
              <p className="mt-2 text-neutral-700">{tea.tasting}</p>
              <p className="text-sm text-neutral-600">{tea.notes}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium" style={{ color: COLORS.primary }}>{formatPrice(tea.priceCents)}</span>
                <button onClick={() => cart.add(tea, 1)} className="px-4 py-2 rounded-lg text-white" style={{ background: COLORS.primary }}>Add to cart</button>
              </div>
              <div className="mt-4 text-right">
                <button onClick={onClose} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>Close</button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8">Loading…</div>
        )}
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose }) {
  const cart = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" aria-modal role="dialog">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="w-full max-w-md bg-white h-full shadow-xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl" style={{ color: COLORS.primary }}>Your Cart</h3>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </div>
        {cart.items.length === 0 ? (
          <p className="mt-6 text-neutral-600">Your cart is empty.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {cart.items.map((it) => (
              <div key={it.id} className="flex gap-3 border rounded-lg p-3">
                <img src={it.image} alt="" className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-800">{it.name}</div>
                  <div className="text-sm text-neutral-600">{formatPrice(it.priceCents)}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <label>Qty</label>
                    <input type="number" min={1} value={it.qty} onChange={(e)=>cart.setQty(it.id, parseInt(e.target.value||"1",10))} className="w-16 border rounded px-2 py-1" />
                    <button onClick={()=>cart.remove(it.id)} className="ml-auto text-red-600 underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{cart.shippingCents===0?"Free":formatPrice(cart.shippingCents)}</span></div>
              <div className="flex justify-between font-medium mt-1" style={{ color: COLORS.primary }}><span>Total</span><span>{formatPrice(cart.total)}</span></div>
            </div>
            <button onClick={()=>setCheckoutOpen(true)} className="w-full rounded-lg py-2 text-white" style={{ background: COLORS.primary }}>Checkout</button>
          </div>
        )}
        {checkoutOpen && <CheckoutModal onClose={()=>setCheckoutOpen(false)} />}
      </aside>
    </div>
  );
}

function CheckoutModal({ onClose }) {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { items: cart.items, totals: { subtotal: cart.subtotal, shipping: cart.shippingCents, total: cart.total }, customer: Object.fromEntries(new FormData(e.target).entries()) };
    const res = await Api.startCheckout(payload).catch(()=>({ ok: false }));
    setOk(res?.ok);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-xl" style={{ color: COLORS.primary }}>Checkout</h4>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="firstName" placeholder="First name" className="border rounded px-3 py-2" required />
          <input name="lastName" placeholder="Last name" className="border rounded px-3 py-2" required />
          <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2 md:col-span-2" required />
          <input name="address" placeholder="Address" className="border rounded px-3 py-2 md:col-span-2" required />
          <input name="city" placeholder="City" className="border rounded px-3 py-2" required />
          <input name="postal" placeholder="Postal code" className="border rounded px-3 py-2" required />
          <textarea name="notes" placeholder="Notes (optional)" className="border rounded px-3 py-2 md:col-span-2" rows={3} />
          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <div className="text-sm text-neutral-700">Amount due: <span className="font-medium" style={{ color: COLORS.primary }}>{formatPrice(cart.total)}</span></div>
            <button disabled={loading} className="rounded-lg px-4 py-2 text-white" style={{ background: COLORS.primary }}>{loading?"Processing…":"Pay now (stub)"}</button>
          </div>
        </form>
        {ok && <div className="mt-3 text-green-700 text-sm">Order created (server stub). Replace with real gateway.</div>}
      </div>
    </div>
  );
}

export default function App() {
  const teasRef = React.useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTeaId, setActiveTeaId] = useState(null);

  const onOpenDetail = (id) => {
    setActiveTeaId(id);
    setModalOpen(true);
  };

  return (
    <CartProvider>
      <SiteLayout>
        <Hero onScrollToTeas={() => teasRef.current?.scrollIntoView({ behavior: "smooth" })} />
        <div ref={teasRef}><Teas onOpenDetail={onOpenDetail} /></div>
        <Ritual />
        <Journal />
        <StoryTeaser />
        <Contact />

        <ProductModal open={modalOpen} teaId={activeTeaId} onClose={() => setModalOpen(false)} />
      </SiteLayout>
    </CartProvider>
  );
}

if (typeof window !== "undefined") {
  console.assert(formatPrice(1995) === "€ 19.95", "formatPrice failed");
}


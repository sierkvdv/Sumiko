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
const LanguageCtx = createContext(null);

function useCart() {
  return useContext(CartCtx);
}

function useLanguage() {
  return useContext(LanguageCtx);
}

const translations = {
  en: {
    heroTitle: "Tea as a pause.",
    heroSubtitle: "Let the leaves speak.",
    heroDescription: "Carefully sourced Chinese teas curated in Japan. Poured slowly, shared warmly — like visiting a friend's living room.",
    exploreTeas: "Explore Teas",
    ourStory: "Our Story",
    story: "Story",
    teas: "Teas",
    ritual: "Ritual",
    journal: "Journal",
    contact: "Contact",
    cart: "Cart",
    readFullStory: "Read the full story",
    storyDescription: "Born between Chinese tea lineages and Japanese stillness, Sumiko shares real tea the way it's felt — not performed. Slow, human, and warm.",
    allTypes: "All types",
    green: "Green",
    oolong: "Oolong",
    dark: "Dark",
    scented: "Scented",
    sortFeatured: "Sort: Featured",
    sortPriceLow: "Sort: Price (low → high)",
    sortPriceHigh: "Sort: Price (high → low)",
    details: "Details",
    add: "Add",
    added: "Added ✓",
    ritualBrewing: "Ritual (Brewing)",
    ritualStep1: "Measure leaves (by gram) and warm your vessel.",
    ritualStep2: "Heat water appropriate to the tea type.",
    ritualStep3: "Bloom briefly; pour slowly; breathe.",
    ritualStep4: "Taste; adjust time; reinfuse.",
    ritualNote: "Multiple infusions reveal layers. Let the leaves speak.",
    tools: "Tools",
    toolsList1: "Scale, kettle with temp control, gaiwan or small pot, fairness cup, cups.",
    toolsList2: "Optional: tea tray, filter, timer.",
    stayInTouch: "Stay in touch",
    stayInTouchDesc: "We write slowly. When we have something worth saying.",
    join: "Join",
    subscribed: "Subscribed. Thank you.",
    yourCart: "Your Cart",
    close: "Close",
    cartEmpty: "Your cart is empty.",
    qty: "Qty",
    remove: "Remove",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    checkout: "Checkout",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    address: "Address",
    city: "City",
    postalCode: "Postal code",
    notes: "Notes (optional)",
    amountDue: "Amount due:",
    payNow: "Pay now (stub)",
    processing: "Processing…",
    orderCreated: "Order created (server stub). Replace with real gateway.",
    addToCart: "Add to cart",
    loading: "Loading…",
    read: "Read →",
    teasData: {
      longjing: {
        name: "Longjing (Dragon Well)",
        type: "Green Tea",
        region: "Zhejiang, China",
        tasting: "Nutty, chestnut, fresh.",
        notes: "Hand-picked, pan-fired to a gentle sweetness."
      },
      tieguanyin: {
        name: "Tieguanyin",
        type: "Oolong",
        region: "Anxi, Fujian",
        tasting: "Floral, creamy, orchid hints.",
        notes: "Semi-oxidized; suitable for multiple infusions."
      },
      puerh: {
        name: "Pu-erh",
        type: "Fermented Dark Tea",
        region: "Yunnan",
        tasting: "Earthy, round, sweet finish.",
        notes: "Improves with age; ideal after a meal."
      },
      "jasmine-pearls": {
        name: "Jasmine Pearls",
        type: "Scented Green",
        region: "Fujian",
        tasting: "Delicate jasmine aroma.",
        notes: "Hand-rolled leaves scented with jasmine blossoms."
      }
    }
  },
  nl: {
    heroTitle: "Thee als een pauze.",
    heroSubtitle: "Laat de bladeren spreken.",
    heroDescription: "Met zorg geselecteerde Chinese theeën, samengesteld in Japan. Langzaam geschonken, warm gedeeld — alsof je de woonkamer van een vriend bezoekt.",
    exploreTeas: "Bekijk Theeën",
    ourStory: "Ons Verhaal",
    story: "Verhaal",
    teas: "Theeën",
    ritual: "Ritueel",
    journal: "Dagboek",
    contact: "Contact",
    cart: "Winkelwagen",
    readFullStory: "Lees het volledige verhaal",
    storyDescription: "Geboren tussen Chinese thee tradities en Japanse rust, deelt Sumiko echte thee zoals het gevoeld wordt — niet opgevoerd. Langzaam, menselijk en warm.",
    allTypes: "Alle soorten",
    green: "Groen",
    oolong: "Oolong",
    dark: "Donker",
    scented: "Gearomatiseerd",
    sortFeatured: "Sorteer: Aanbevolen",
    sortPriceLow: "Sorteer: Prijs (laag → hoog)",
    sortPriceHigh: "Sorteer: Prijs (hoog → laag)",
    details: "Details",
    add: "Toevoegen",
    added: "Toegevoegd ✓",
    ritualBrewing: "Ritueel (Zetten)",
    ritualStep1: "Meet de bladeren (in gram) en warm je vat op.",
    ritualStep2: "Verwarm water geschikt voor het thee type.",
    ritualStep3: "Laat kort bloeien; schenk langzaam; adem.",
    ritualStep4: "Proef; pas de tijd aan; opnieuw infuseren.",
    ritualNote: "Meerdere infusies onthullen lagen. Laat de bladeren spreken.",
    tools: "Gereedschappen",
    toolsList1: "Weegschaal, waterkoker met temperatuur, gaiwan of kleine pot, verdeelkom, kopjes.",
    toolsList2: "Optioneel: thee dienblad, filter, timer.",
    stayInTouch: "Blijf op de hoogte",
    stayInTouchDesc: "We schrijven langzaam. Als we iets de moeite waard hebben om te zeggen.",
    join: "Aanmelden",
    subscribed: "Aangemeld. Dank je wel.",
    yourCart: "Je Winkelwagen",
    close: "Sluiten",
    cartEmpty: "Je winkelwagen is leeg.",
    qty: "Aantal",
    remove: "Verwijderen",
    subtotal: "Subtotaal",
    shipping: "Verzending",
    free: "Gratis",
    total: "Totaal",
    checkout: "Afrekenen",
    firstName: "Voornaam",
    lastName: "Achternaam",
    email: "E-mail",
    address: "Adres",
    city: "Stad",
    postalCode: "Postcode",
    notes: "Opmerkingen (optioneel)",
    amountDue: "Te betalen:",
    payNow: "Nu betalen (test)",
    processing: "Verwerken…",
    orderCreated: "Bestelling aangemaakt (server test). Vervang met echte gateway.",
    addToCart: "Toevoegen aan winkelwagen",
    loading: "Laden…",
    read: "Lees →",
    teasData: {
      longjing: {
        name: "Longjing (Dragon Well)",
        type: "Groene Thee",
        region: "Zhejiang, China",
        tasting: "Notig, kastanje, vers.",
        notes: "Handgeplukt, in de pan gebakken tot een zachte zoetheid."
      },
      tieguanyin: {
        name: "Tieguanyin",
        type: "Oolong",
        region: "Anxi, Fujian",
        tasting: "Bloemig, romig, orchidee hints.",
        notes: "Half geoxideerd; geschikt voor meerdere infusies."
      },
      puerh: {
        name: "Pu-erh",
        type: "Gefermenteerde Donkere Thee",
        region: "Yunnan",
        tasting: "Aards, rond, zoete afdronk.",
        notes: "Verbeterd met de leeftijd; ideaal na een maaltijd."
      },
      "jasmine-pearls": {
        name: "Jasmijn Parels",
        type: "Gearomatiseerde Groene",
        region: "Fujian",
        tasting: "Delicaat jasmijn aroma.",
        notes: "Handgerolde bladeren gegeurd met jasmijn bloesems."
      }
    }
  },
  ja: {
    heroTitle: "茶は休憩。",
    heroSubtitle: "葉に語らせよう。",
    heroDescription: "中国の茶を厳選し、日本で仕上げた。ゆっくりと注ぎ、温かく共有する — 友人のリビングルームを訪れるように。",
    exploreTeas: "茶を見る",
    ourStory: "私たちの物語",
    story: "物語",
    teas: "茶",
    ritual: "儀式",
    journal: "日記",
    contact: "連絡先",
    cart: "カート",
    readFullStory: "全文を読む",
    storyDescription: "中国の茶の系譜と日本の静けさの間に生まれた、すみこは感じられるままに本当の茶を共有する — 演じられるのではなく。ゆっくりと、人間らしく、温かく。",
    allTypes: "すべての種類",
    green: "緑茶",
    oolong: "烏龍茶",
    dark: "黒茶",
    scented: "香り付き",
    sortFeatured: "並び替え: おすすめ",
    sortPriceLow: "並び替え: 価格（安い→高い）",
    sortPriceHigh: "並び替え: 価格（高い→安い）",
    details: "詳細",
    add: "追加",
    added: "追加済み ✓",
    ritualBrewing: "儀式（淹れ方）",
    ritualStep1: "茶葉を計量（グラム単位）し、茶器を温める。",
    ritualStep2: "茶の種類に適した温度で湯を沸かす。",
    ritualStep3: "短く蒸らし；ゆっくり注ぐ；呼吸する。",
    ritualStep4: "味わう；時間を調整する；再抽出する。",
    ritualNote: "複数回の抽出が層を明かす。葉に語らせよう。",
    tools: "道具",
    toolsList1: "秤、温度調整付きやかん、蓋碗または小さな急須、公道杯、茶杯。",
    toolsList2: "任意：茶盤、フィルター、タイマー。",
    stayInTouch: "お問い合わせ",
    stayInTouchDesc: "ゆっくりと書きます。言う価値のあることがあるときに。",
    join: "登録",
    subscribed: "登録ありがとうございます。",
    yourCart: "カート",
    close: "閉じる",
    cartEmpty: "カートは空です。",
    qty: "数量",
    remove: "削除",
    subtotal: "小計",
    shipping: "送料",
    free: "無料",
    total: "合計",
    checkout: "レジへ",
    firstName: "名",
    lastName: "姓",
    email: "メール",
    address: "住所",
    city: "市区町村",
    postalCode: "郵便番号",
    notes: "備考（任意）",
    amountDue: "支払額:",
    payNow: "今すぐ支払う（テスト）",
    processing: "処理中…",
    orderCreated: "注文を作成しました（サーバーテスト）。実際のゲートウェイに置き換えてください。",
    addToCart: "カートに追加",
    loading: "読み込み中…",
    read: "読む →",
    teasData: {
      longjing: {
        name: "龍井（ドラゴンウェル）",
        type: "緑茶",
        region: "浙江省、中国",
        tasting: "ナッツ、栗、フレッシュ。",
        notes: "手摘み、パン焼きで優しい甘みに。"
      },
      tieguanyin: {
        name: "鉄観音",
        type: "烏龍茶",
        region: "安渓、福建",
        tasting: "花のような、クリーミー、蘭のヒント。",
        notes: "半酸化；複数回の抽出に適している。"
      },
      puerh: {
        name: "プーアール",
        type: "発酵黒茶",
        region: "雲南",
        tasting: "土っぽい、丸み、甘い余韻。",
        notes: "年齢とともに向上；食後に理想的。"
      },
      "jasmine-pearls": {
        name: "茉莉花珠茶",
        type: "香り付き緑茶",
        region: "福建",
        tasting: "繊細な茉莉花の香り。",
        notes: "手で巻いた葉を茉莉花の花で香り付け。"
      }
    }
  }
};

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

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sumiko_language");
      if (saved && (saved === 'en' || saved === 'nl' || saved === 'ja')) {
        setLanguage(saved);
      }
    } catch {}
  }, []);
  
  useEffect(() => {
    try { localStorage.setItem("sumiko_language", language); } catch {}
  }, [language]);

  const t = translations[language] || translations.en;
  const value = { language, setLanguage, t };
  return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

function SiteLayout({ children }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const backgroundVideoRef = React.useRef(null);
  const backgroundVideo = '/videos/Sumiko_BKGRND_Loop.mp4';

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
    <>
      {/* Full-page background loop video - MUST be first */}
      <video
        ref={backgroundVideoRef}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0,
          objectFit: 'cover',
          backgroundColor: 'transparent'
        }}
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
      
      {/* Semi-transparent overlay */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 1,
          backgroundColor: 'rgba(221, 214, 206, 0.5)',
          pointerEvents: 'none'
        }} 
      />
      
      {/* Content container */}
      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 10, color: COLORS.ink }}>
        <TopBar onOpenCart={() => setOpen(true)} cartCount={cart.items.reduce((n,i)=>n+i.qty,0)} />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <Footer />
        <CartDrawer open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}

function TopBar({ onOpenCart, cartCount }) {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#F3EFE6]/70 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6">
        <div className="flex items-center gap-3"><LogoWordmark /></div>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
          <a href="/story" className="hover:opacity-80">{t.story}</a>
          <a href="#teas" className="hover:opacity-80">{t.teas}</a>
          <a href="#ritual" className="hover:opacity-80">{t.ritual}</a>
          <a href="#journal" className="hover:opacity-80">{t.journal}</a>
          <a href="#contact" className="hover:opacity-80">{t.contact}</a>
        </nav>
        <div className="flex items-center gap-3">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-white"
            style={{ borderColor: COLORS.primary }}
          >
            <option value="en">EN</option>
            <option value="nl">NL</option>
            <option value="ja">JP</option>
          </select>
          <button onClick={onOpenCart} className="relative rounded-full border px-3 py-1.5 text-sm hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            {t.cart}
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Enso() {
  return <LogoIcon />;
}

function LogoWordmark() {
  return (
    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img 
        src="/photos/Sumiko_Logo_only_txt_NO_BKGRND.png" 
        alt="Sumiko" 
        className="h-6 md:h-8 w-auto object-contain"
      />
      <img 
        src="/photos/Sumiko_Logo_NO_BKGRND.png" 
        alt="" 
        className="h-6 md:h-8 w-auto object-contain"
      />
    </a>
  );
}

function LogoIcon() {
  return (
    <img 
      src="/photos/Sumiko_Logo_NO_BKGRND.png" 
      alt="Sumiko" 
      className="h-8 w-8 object-contain"
    />
  );
}

function HeroContent({ onScrollToTeas }) {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-3xl relative z-[3]">
      <h1 className="font-serif text-4xl md:text-5xl leading-tight" style={{ color: COLORS.ink }}>
        {t.heroTitle}{" "}
        <span className="text-[color:var(--primary)]" style={{ color: COLORS.primary }}>
          {t.heroSubtitle}
        </span>
      </h1>
      <p className="mt-4 text-neutral-700">
        {t.heroDescription}
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={onScrollToTeas} className="px-4 py-2 rounded-xl text-white font-medium hover:opacity-90" style={{ background: COLORS.primary }}>
          {t.exploreTeas}
        </button>
        <a href="/story" className="px-4 py-2 rounded-xl border font-medium hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
          {t.ourStory}
        </a>
      </div>
    </div>
  );
}

function Hero({ onScrollToTeas }) {
  const [plumes, setPlumes] = React.useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [activeVideo, setActiveVideo] = React.useState(0); // 0 or 1 for double buffering
  const videoRefs = [React.useRef(null), React.useRef(null)];
  
  const videos = [
    '/videos/Sumiko_Hero_001.mp4',
    '/videos/Sumiko_Hero_002.mp4',
    '/videos/Sumiko_Hero_003.mp4',
    '/videos/Sumiko_Hero_004.mp4'
  ];

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

  // Ensure current video plays and preload next - iOS compatible with user interaction
  React.useEffect(() => {
    const currentVideo = videoRefs[activeVideo].current;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = videoRefs[1 - activeVideo].current;

    if (currentVideo) {
      // Set iOS attributes
      currentVideo.setAttribute('playsinline', 'true');
      currentVideo.setAttribute('webkit-playsinline', 'true');
      currentVideo.setAttribute('x5-playsinline', 'true');
      currentVideo.muted = true;
      currentVideo.volume = 0;
      currentVideo.controls = false;
      
      // Force play - iOS requires user interaction, so try on first user interaction
      const attemptPlay = () => {
        if (currentVideo.paused) {
          currentVideo.play().catch(() => {});
        }
      };
      
      // Try immediately if ready
      if (currentVideo.readyState >= 2) {
        attemptPlay();
      } else {
        currentVideo.addEventListener('canplaythrough', attemptPlay, { once: true });
        currentVideo.addEventListener('loadeddata', attemptPlay, { once: true });
      }
      
      // Also try on any user interaction (like background video does)
      const tryPlayOnInteraction = () => {
        attemptPlay();
        document.removeEventListener('touchstart', tryPlayOnInteraction);
        document.removeEventListener('click', tryPlayOnInteraction);
      };
      document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
      document.addEventListener('click', tryPlayOnInteraction, { once: true });
    }

    // Preload next video
    if (nextVideo) {
      nextVideo.setAttribute('playsinline', 'true');
      nextVideo.setAttribute('webkit-playsinline', 'true');
      nextVideo.setAttribute('x5-playsinline', 'true');
      nextVideo.muted = true;
      nextVideo.controls = false;
      nextVideo.load();
    }
  }, [currentVideoIndex, activeVideo]);
  
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
        /* Hide video controls on iOS - comprehensive */
        video::-webkit-media-controls {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        video::-webkit-media-controls-enclosure {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        video::-webkit-media-controls-panel {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        video::-webkit-media-controls-play-button {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          -webkit-appearance: none !important;
        }
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          -webkit-appearance: none !important;
        }
        video[controls]::-webkit-media-controls {
          display: none !important;
        }
      `}</style>

      {/* Hero foreground videos - double buffering for seamless transitions */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
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
              controlsList="nodownload nofullscreen noplaybackrate"
              disablePictureInPicture
              disableRemotePlayback
              webkit-playsinline="true"
              x5-playsinline="true"
              style={{ 
                pointerEvents: 'none',
                WebkitAppearance: 'none'
              }}
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

      <HeroContent onScrollToTeas={onScrollToTeas} />
    </section>
  );
}

function StoryTeaser() {
  const { t } = useLanguage();
  
  return (
    <section className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>{t.ourStory}</h2>
          <p className="mt-2 text-neutral-700">
            {t.storyDescription}
          </p>
        </div>
        <div>
          <a href="/story" className="px-4 py-2 rounded-xl border font-medium hover:bg-black/5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
            {t.readFullStory}
          </a>
        </div>
      </div>
    </section>
  );
}

function Teas({ onOpenDetail }) {
  const [teas, setTeas] = useState([]);
  const cart = useCart();
  const { t } = useLanguage();
  useEffect(() => { Api.fetchTeas().then(setTeas).catch(()=>setTeas([])); }, []);

  // Translate teas based on current language
  const translatedTeas = teas.map(tea => {
    const teaTranslations = t.teasData?.[tea.id];
    if (teaTranslations) {
      return {
        ...tea,
        name: teaTranslations.name,
        type: teaTranslations.type,
        region: teaTranslations.region,
        tasting: teaTranslations.tasting,
        notes: teaTranslations.notes
      };
    }
    return tea;
  });

  return (
    <section id="teas" className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>{t.teas}</h2>
        <div className="flex gap-2 text-sm">
          <select className="border rounded-md px-2 py-1 bg-white">
            <option>{t.allTypes}</option>
            <option>{t.green}</option>
            <option>{t.oolong}</option>
            <option>{t.dark}</option>
            <option>{t.scented}</option>
          </select>
          <select className="border rounded-md px-2 py-1 bg-white">
            <option>{t.sortFeatured}</option>
            <option>{t.sortPriceLow}</option>
            <option>{t.sortPriceHigh}</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {translatedTeas.map((tea) => (
          <TeaCard key={tea.id} tea={tea} onOpenDetail={() => onOpenDetail(tea.id)} onAdd={() => cart.add(tea, 1)} />
        ))}
      </div>
    </section>
  );
}

function TeaCard({ tea, onOpenDetail, onAdd }) {
  const [justAdded, setJustAdded] = React.useState(false);
  const { t } = useLanguage();
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
            <button onClick={onOpenDetail} className="px-3 py-1.5 rounded-lg text-sm text-white" style={{ background: COLORS.primary }}>{t.details}</button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg text-sm border transition-all hover:bg-black/5 hover:border-transparent hover:text-white active:scale-[.97]"
              style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: justAdded ? COLORS.primary : 'transparent' }}
            >
              {justAdded ? t.added : t.add}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Ritual() {
  const { t } = useLanguage();
  
  return (
    <section id="ritual" className="mt-12 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>{t.ritualBrewing}</h2>
        <ol className="mt-3 list-decimal pl-6 text-neutral-700 space-y-1">
          <li>{t.ritualStep1}</li>
          <li>{t.ritualStep2}</li>
          <li>{t.ritualStep3}</li>
          <li>{t.ritualStep4}</li>
        </ol>
        <p className="mt-3 text-sm text-neutral-600">{t.ritualNote}</p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h3 className="font-serif text-xl" style={{ color: COLORS.accent }}>{t.tools}</h3>
        <ul className="list-disc pl-5 text-neutral-700 space-y-1 mt-2">
          <li>{t.toolsList1}</li>
          <li>{t.toolsList2}</li>
        </ul>
      </div>
    </section>
  );
}

function Journal() {
  const { t } = useLanguage();
  const posts = [
    { id: 1, title: "Why we don't rush tea", date: "2025-11-01" },
    { id: 2, title: "Visiting a small farm in Fujian", date: "2025-11-07" }
  ];
  return (
    <section id="journal" className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow">
        <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>{t.journal}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <article key={p.id} className="rounded-xl border p-4 hover:bg-black/5 transition">
              <div className="text-sm text-neutral-500">{p.date}</div>
              <h3 className="font-medium text-neutral-800">{p.title}</h3>
              <button className="mt-2 text-sm underline" aria-label={`Read ${p.title}`}>
                {t.read}
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
  const { t } = useLanguage();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await Api.subscribe(email);
    setOk(!!res?.ok);
  };

  return (
    <section id="contact" className="mt-12">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-serif text-2xl" style={{ color: COLORS.primary }}>{t.stayInTouch}</h2>
          <p className="mt-2 text-neutral-700">{t.stayInTouchDesc}</p>
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} className="w-full rounded-lg border px-3 py-2" required />
          <button type="submit" className="rounded-lg px-4 py-2 text-white" style={{ background: COLORS.primary }}>
            {t.join}
          </button>
        </form>
        {ok && <div className="text-sm text-green-700">{t.subscribed}</div>}
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-16 py-10 border-t border-black/5">
      <div className="flex flex-col items-center gap-4 text-center text-sm text-neutral-600">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="/photos/Sumiko_Logo_txt_NO_BKGRND.png" 
            alt="Sumiko" 
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>
        <p>© {new Date().getFullYear()} Sumiko — {t.heroSubtitle}</p>
      </div>
    </footer>
  );
}

function ProductModal({ open, teaId, onClose }) {
  const [tea, setTea] = useState(null);
  const cart = useCart();
  const { t } = useLanguage();
  useEffect(() => {
    if (!open || !teaId) return;
    Api.fetchTeaById(teaId).then(setTea).catch(()=>setTea(null));
  }, [open, teaId]);
  if (!open) return null;

  // Translate tea data
  const translatedTea = tea ? (() => {
    const teaTranslations = t.teasData?.[tea.id];
    if (teaTranslations) {
      return {
        ...tea,
        name: teaTranslations.name,
        type: teaTranslations.type,
        region: teaTranslations.region,
        tasting: teaTranslations.tasting,
        notes: teaTranslations.notes
      };
    }
    return tea;
  })() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        {translatedTea ? (
          <>
            <div className="aspect-video overflow-hidden">
              <img src={translatedTea.image} alt={translatedTea.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-serif text-2xl" style={{ color: COLORS.ink }}>{translatedTea.name}</h3>
              <div className="text-sm text-neutral-600">{translatedTea.type} · {translatedTea.region}</div>
              <p className="mt-2 text-neutral-700">{translatedTea.tasting}</p>
              <p className="text-sm text-neutral-600">{translatedTea.notes}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium" style={{ color: COLORS.primary }}>{formatPrice(translatedTea.priceCents)}</span>
                <button onClick={() => cart.add(translatedTea, 1)} className="px-4 py-2 rounded-lg text-white" style={{ background: COLORS.primary }}>{t.addToCart}</button>
              </div>
              <div className="mt-4 text-right">
                <button onClick={onClose} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>{t.close}</button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8">{t.loading}</div>
        )}
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose }) {
  const cart = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { t } = useLanguage();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" aria-modal role="dialog">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="w-full max-w-md bg-white h-full shadow-xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl" style={{ color: COLORS.primary }}>{t.yourCart}</h3>
          <button onClick={onClose} className="text-sm underline">{t.close}</button>
        </div>
        {cart.items.length === 0 ? (
          <p className="mt-6 text-neutral-600">{t.cartEmpty}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {cart.items.map((it) => (
              <div key={it.id} className="flex gap-3 border rounded-lg p-3">
                <img src={it.image} alt="" className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-800">{it.name}</div>
                  <div className="text-sm text-neutral-600">{formatPrice(it.priceCents)}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <label>{t.qty}</label>
                    <input type="number" min={1} value={it.qty} onChange={(e)=>cart.setQty(it.id, parseInt(e.target.value||"1",10))} className="w-16 border rounded px-2 py-1" />
                    <button onClick={()=>cart.remove(it.id)} className="ml-auto text-red-600 underline">{t.remove}</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 text-sm">
              <div className="flex justify-between"><span>{t.subtotal}</span><span>{formatPrice(cart.subtotal)}</span></div>
              <div className="flex justify-between"><span>{t.shipping}</span><span>{cart.shippingCents===0?t.free:formatPrice(cart.shippingCents)}</span></div>
              <div className="flex justify-between font-medium mt-1" style={{ color: COLORS.primary }}><span>{t.total}</span><span>{formatPrice(cart.total)}</span></div>
            </div>
            <button onClick={()=>setCheckoutOpen(true)} className="w-full rounded-lg py-2 text-white" style={{ background: COLORS.primary }}>{t.checkout}</button>
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
  const { t } = useLanguage();

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
          <h4 className="font-serif text-xl" style={{ color: COLORS.primary }}>{t.checkout}</h4>
          <button onClick={onClose} className="text-sm underline">{t.close}</button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="firstName" placeholder={t.firstName} className="border rounded px-3 py-2" required />
          <input name="lastName" placeholder={t.lastName} className="border rounded px-3 py-2" required />
          <input name="email" type="email" placeholder={t.email} className="border rounded px-3 py-2 md:col-span-2" required />
          <input name="address" placeholder={t.address} className="border rounded px-3 py-2 md:col-span-2" required />
          <input name="city" placeholder={t.city} className="border rounded px-3 py-2" required />
          <input name="postal" placeholder={t.postalCode} className="border rounded px-3 py-2" required />
          <textarea name="notes" placeholder={t.notes} className="border rounded px-3 py-2 md:col-span-2" rows={3} />
          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <div className="text-sm text-neutral-700">{t.amountDue} <span className="font-medium" style={{ color: COLORS.primary }}>{formatPrice(cart.total)}</span></div>
            <button disabled={loading} className="rounded-lg px-4 py-2 text-white" style={{ background: COLORS.primary }}>{loading?t.processing:t.payNow}</button>
          </div>
        </form>
        {ok && <div className="mt-3 text-green-700 text-sm">{t.orderCreated}</div>}
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
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

if (typeof window !== "undefined") {
  console.assert(formatPrice(1995) === "€ 19.95", "formatPrice failed");
}


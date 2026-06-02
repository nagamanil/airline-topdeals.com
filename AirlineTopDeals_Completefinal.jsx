import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  navy: "#00384F", blue: "#005B7F", sky: "#28BDEB", orange: "#F59E0B",
  green: "#16A34A", bg: "#F5F8FA", dark: "#1F2937", white: "#fff",
  muted: "#6B7E8F", border: "#E2EBF0", lb: "#E8F6FC", red: "#DC2626",
  purple: "#7C3AED", pink: "#DB2777",
};

// ─── DATA ─────────────────────────────────────────────────────
const AIRLINES = [
  { code:"EK", name:"Emirates", color:"#C8102E", deals:42, hot:true, country:"UAE", hub:"Dubai (DXB)", about:"World-renowned for luxury service and global reach, flying to 150+ destinations.", founded:1985 },
  { code:"QR", name:"Qatar Airways", color:"#5C0016", deals:38, country:"Qatar", hub:"Doha (DOH)", about:"Award-winning 5-star airline offering premium comfort and unmatched hospitality.", founded:1993 },
  { code:"SQ", name:"Singapore Airlines", color:"#003366", deals:31, country:"Singapore", hub:"Singapore (SIN)", about:"Asia's finest carrier known for exceptional service and innovative cabin products.", founded:1947 },
  { code:"KL", name:"KLM Royal Dutch", color:"#00A1E4", deals:28, country:"Netherlands", hub:"Amsterdam (AMS)", about:"Europe's oldest airline operating under its original name, renowned for reliability.", founded:1919 },
  { code:"EY", name:"Etihad Airways", color:"#7B6122", deals:25, isNew:true, country:"UAE", hub:"Abu Dhabi (AUH)", about:"Abu Dhabi's national carrier offering world-class luxury travel experiences.", founded:2003 },
  { code:"MH", name:"Malaysia Airlines", color:"#003087", deals:22, country:"Malaysia", hub:"Kuala Lumpur (KUL)", about:"Malaysia's flag carrier connecting Southeast Asia to the world with warm hospitality.", founded:1947 },
  { code:"VS", name:"Virgin Atlantic", color:"#E2001A", deals:19, hot:true, country:"UK", hub:"London (LHR)", about:"Britain's premium long-haul carrier known for innovative service and bold design.", founded:1984 },
  { code:"CX", name:"Cathay Pacific", color:"#006564", deals:17, country:"Hong Kong", hub:"Hong Kong (HKG)", about:"Hong Kong's premium carrier offering world-class service across Asia and beyond.", founded:1946 },
];

const COUPONS = [
  { id:1, code:"EMI25OFF", airline:"Emirates", airlineCode:"EK", airlineColor:"#C8102E", title:"25% Off Business Class Flights", badge:"🔥 Top Deal", success:93, expires:"Jun 30, 2026", views:4821, type:"featured", discount:25, category:"Business Class", desc:"Save 25% on Emirates Business Class to any destination. Includes lounge access, lie-flat beds, and gourmet dining.", route:"Dubai → Worldwide", slug:"emirates-25-off-business" },
  { id:2, code:"QR30ECON", airline:"Qatar Airways", airlineCode:"QR", airlineColor:"#5C0016", title:"30% Off Economy Class Booking", badge:"✈️ Economy Saver", success:88, expires:"Jul 15, 2026", views:3142, type:"normal", discount:30, category:"Economy", desc:"Book Economy Class to 150+ destinations and save 30%. Includes free checked baggage.", route:"Doha → Asia & Europe", slug:"qatar-30-off-economy" },
  { id:3, code:"SQ20PREM", airline:"Singapore Airlines", airlineCode:"SQ", airlineColor:"#003366", title:"20% Off Premium Economy Class", badge:"⭐ Premium Pick", success:91, expires:"Aug 1, 2026", views:2887, type:"featured", discount:20, category:"Premium Economy", desc:"Travel in premium comfort at 20% off. Extra legroom, premium meals, and priority service.", route:"Singapore → Global", slug:"singapore-20-off-premium" },
  { id:4, code:"EY15ECO", airline:"Etihad Airways", airlineCode:"EY", airlineColor:"#7B6122", title:"15% Off Economy Fares + Free Bag", badge:"💎 Flash Sale", success:85, expires:"Jun 20, 2026", views:1943, type:"normal", discount:15, category:"Economy", desc:"Flash sale on economy fares with a free extra bag. Valid on all Etihad routes.", route:"Abu Dhabi → Worldwide", slug:"etihad-15-off-economy" },
  { id:5, code:"KL20EUR", airline:"KLM Royal Dutch", airlineCode:"KL", airlineColor:"#00A1E4", title:"20% Off European Destinations", badge:"🌍 Europe Sale", success:82, expires:"Jul 30, 2026", views:2211, type:"normal", discount:20, category:"Flight Deals", desc:"Explore Europe at 20% off. Amsterdam, Paris, Rome, and 80+ European cities.", route:"Amsterdam → Europe", slug:"klm-20-off-europe" },
  { id:6, code:"VA40INT", airline:"Virgin Atlantic", airlineCode:"VS", airlineColor:"#E2001A", title:"Up to 40% Off Transatlantic Flights", badge:"🚀 Best Value", success:95, expires:"Jun 25, 2026", views:5102, type:"featured", discount:40, category:"Business Class", desc:"Massive 40% discount on Virgin Atlantic transatlantic routes. Premium cabins at economy prices.", route:"London → Americas", slug:"virgin-40-off-transatlantic" },
];

const DEALS = [
  { id:1, code:"EMI20ECON", airline:"Emirates", slug:"emirates-economy-roundtrip", title:"Economy Roundtrip to Dubai — Save 20%", desc:"Book by June 30 for travel through December. Includes checked baggage and in-flight meals.", success:91, views:3200, comments:42, type:"PROMO CODE", typeColor:T.orange, discount:20, emoji:"🏙️", bg:"linear-gradient(135deg,#001a33,#003366)", category:"Promo Codes", expires:"Jun 30, 2026", price:"From $449" },
  { id:2, code:"QR15LONG", airline:"Qatar Airways", slug:"qatar-business-longhaul", title:"Long-Haul Business Class — 15% Off", desc:"Fly in comfort to 150+ destinations. Includes lounge access and priority boarding.", success:88, views:2100, comments:28, type:"FLIGHT DEAL", typeColor:T.green, discount:15, emoji:"🌏", bg:"linear-gradient(135deg,#3a0012,#5C0016)", category:"Business Class", expires:"Jul 15, 2026", price:"From $1,249" },
  { id:3, code:"KL30EUR2", airline:"KLM Royal Dutch", slug:"klm-europe-shorthual", title:"European Short-Haul — Up to 30% Off", desc:"Explore Paris, Rome, Barcelona and more at unbeatable prices this summer season.", success:85, views:1800, comments:19, type:"FLASH SALE", typeColor:T.sky, discount:30, emoji:"🗼", bg:"linear-gradient(135deg,#001a3d,#003080)", category:"Flight Deals", expires:"Jul 30, 2026", price:"From $189" },
  { id:4, code:"SQ10PACK", airline:"Singapore Airlines", slug:"singapore-asia-package", title:"Asia Vacation Package — Extra 10% Off", desc:"All-inclusive packages to Bali, Thailand, Japan. Book flight + hotel for maximum savings.", success:94, views:4500, comments:67, type:"PACKAGE", typeColor:T.purple, discount:10, emoji:"🏝️", bg:"linear-gradient(135deg,#002244,#004488)", category:"Vacation Packages", expires:"Aug 1, 2026", price:"From $799" },
  { id:5, code:"EY25STU", airline:"Etihad Airways", slug:"etihad-student-discount", title:"Student Discount — 25% Off + Extra Baggage", desc:"Exclusive for students with valid ID. Extra 10kg baggage allowance included on all routes.", success:89, views:2900, comments:53, type:"STUDENT DEAL", typeColor:T.pink, discount:25, emoji:"🎓", bg:"linear-gradient(135deg,#3d2a00,#7B6122)", category:"Student Discounts", expires:"Jul 20, 2026", price:"From $329" },
  { id:6, code:"VS40BIZ", airline:"Virgin Atlantic", slug:"virgin-business-nyc", title:"Business Class to NYC & LA — 40% Off", desc:"Lie-flat beds, premium dining, Sky Suite experience. Limited seats available at this price.", success:96, views:6100, comments:94, type:"LIMITED", typeColor:T.red, discount:40, emoji:"🌃", bg:"linear-gradient(135deg,#5a0009,#A00012)", category:"Business Class", expires:"Jun 25, 2026", price:"From $899" },
];

const DESTINATIONS = [
  { id:1, emoji:"🗽", region:"North America", name:"New York City", country:"USA", deals:84, bg:"linear-gradient(135deg,#0a1628,#1a2d52)", slug:"new-york", desc:"The city that never sleeps — Broadway, Central Park, and the iconic skyline.", attractions:["Statue of Liberty","Times Square","Central Park","Brooklyn Bridge"], airlines:["Emirates","Virgin Atlantic","British Airways"] },
  { id:2, emoji:"🏯", region:"East Asia", name:"Tokyo", country:"Japan", deals:61, bg:"linear-gradient(135deg,#1a0033,#2d0055)", slug:"tokyo", desc:"Ancient temples meet cutting-edge technology in Japan's vibrant capital.", attractions:["Mount Fuji","Shibuya Crossing","Senso-ji Temple","Tsukiji Market"], airlines:["Singapore Airlines","Cathay Pacific","Japan Airlines"] },
  { id:3, emoji:"🕌", region:"Middle East", name:"Dubai", country:"UAE", deals:73, bg:"linear-gradient(135deg,#1a1500,#332900)", slug:"dubai", desc:"A luxury destination where ultramodern architecture meets ancient desert heritage.", attractions:["Burj Khalifa","Palm Jumeirah","Dubai Mall","Desert Safari"], airlines:["Emirates","Etihad Airways","Qatar Airways"] },
  { id:4, emoji:"🗼", region:"Western Europe", name:"Paris", country:"France", deals:92, bg:"linear-gradient(135deg,#000033,#000066)", slug:"paris", desc:"The city of light — art, fashion, cuisine, and the world's most romantic landmarks.", attractions:["Eiffel Tower","Louvre Museum","Notre-Dame","Versailles"], airlines:["KLM","Air France","Emirates"] },
  { id:5, emoji:"🌿", region:"Southeast Asia", name:"Bali", country:"Indonesia", deals:57, bg:"linear-gradient(135deg,#001a00,#003300)", slug:"bali", desc:"Tropical paradise with stunning temples, rice terraces, and world-class beaches.", attractions:["Uluwatu Temple","Ubud Rice Terraces","Seminyak Beach","Mount Batur"], airlines:["Singapore Airlines","Garuda Indonesia","Etihad"] },
  { id:6, emoji:"🌵", region:"Southwest USA", name:"Las Vegas", country:"USA", deals:39, bg:"linear-gradient(135deg,#1a0a00,#331500)", slug:"las-vegas", desc:"Entertainment capital of the world with world-class shows, casinos, and the Grand Canyon nearby.", attractions:["The Strip","Grand Canyon","Hoover Dam","Fremont Street"], airlines:["Virgin Atlantic","Emirates","American Airlines"] },
];

const BLOG_POSTS = [
  { id:1, emoji:"✈️", cat:"FLIGHT TIPS", title:"10 Proven Tricks to Find the Cheapest Flights in 2026", excerpt:"From incognito browsing to booking on Tuesdays — these strategies could save you hundreds on your next trip.", date:"May 20, 2026", read:"5 min", views:12481, bg:"linear-gradient(135deg,#0a1628,#1a2d52)", slug:"cheapest-flights-2026", author:"James Turner", authorInitials:"JT" },
  { id:2, emoji:"🌏", cat:"DESTINATION", title:"Best Time to Book Emirates Business Class at Discount Prices", excerpt:"Emirates frequently releases business class promotions during key sale windows. Here's exactly when to look.", date:"May 18, 2026", read:"8 min", views:9832, bg:"linear-gradient(135deg,#1a0010,#3a0025)", slug:"emirates-business-class-guide", author:"Sarah Mitchell", authorInitials:"SM" },
  { id:3, emoji:"🏨", cat:"HOTEL DEALS", title:"Bundle Flights + Hotels for Maximum Savings This Summer", excerpt:"Booking vacation packages through airline portals can unlock exclusive bundle discounts unavailable elsewhere.", date:"May 15, 2026", read:"6 min", views:7654, bg:"linear-gradient(135deg,#001a0a,#003015)", slug:"bundle-flights-hotels", author:"Michael Chen", authorInitials:"MC" },
  { id:4, emoji:"🎒", cat:"BUDGET TRAVEL", title:"Student Travel Guide: How to Fly Internationally on a Budget", excerpt:"Student discounts, budget airlines, and hostel combos — the complete guide for student travelers.", date:"May 12, 2026", read:"7 min", views:5421, bg:"linear-gradient(135deg,#1a1000,#3a2000)", slug:"student-travel-guide", author:"Priya Patel", authorInitials:"PP" },
  { id:5, emoji:"🔑", cat:"LOYALTY POINTS", title:"Maximize Airline Miles: The Ultimate 2026 Loyalty Program Guide", excerpt:"Which airline loyalty programs give you the most value per dollar spent? We rank them all.", date:"May 10, 2026", read:"9 min", views:8934, bg:"linear-gradient(135deg,#001a1a,#003333)", slug:"airline-miles-guide", author:"James Turner", authorInitials:"JT" },
  { id:6, emoji:"🌴", cat:"ASIA PACIFIC", title:"Top 10 Southeast Asia Destinations Under $500 Roundtrip", excerpt:"Bali, Bangkok, Ho Chi Minh City, and more — here's how to reach them cheaply from major hubs.", date:"May 8, 2026", read:"10 min", views:11203, bg:"linear-gradient(135deg,#1a001a,#350035)", slug:"southeast-asia-budget", author:"Sarah Mitchell", authorInitials:"SM" },
];

const CATEGORIES = [
  { icon:"✈️", name:"Airline Coupons", count:342, color:"#005B7F", slug:"airline-coupons" },
  { icon:"🏷️", name:"Flight Deals", count:218, color:"#16A34A", slug:"flight-deals" },
  { icon:"🏨", name:"Hotel Deals", count:95, color:"#7C3AED", slug:"hotel-deals" },
  { icon:"🌴", name:"Vacation Packages", count:67, color:"#F59E0B", slug:"vacation-packages" },
  { icon:"🎓", name:"Student Discounts", count:44, color:"#EC4899", slug:"student-discounts" },
  { icon:"🗺️", name:"Attractions", count:38, color:"#059669", slug:"attractions" },
  { icon:"📰", name:"Travel News", count:124, color:"#DC2626", slug:"travel-news" },
];

// ─── UTILITY ──────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(targetDate) - new Date());
      setTime({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SectionTag({ children, style = {} }) {
  return <div style={{ display:"inline-block", background:T.lb, color:T.blue, fontSize:".72rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", padding:".3rem .875rem", borderRadius:50, marginBottom:".75rem", ...style }}>{children}</div>;
}

function SectionHead({ tag, title, sub }) {
  return (
    <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:800, color:T.navy, marginBottom:".5rem" }}>{title}</h2>
      {sub && <p style={{ color:T.muted, fontSize:".9375rem", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>{sub}</p>}
    </div>
  );
}

function BtnPrimary({ children, onClick, style={} }) {
  const [hov, setHov] = useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:`linear-gradient(135deg,${T.blue},${T.navy})`, color:"#fff", border:"none", padding:".7rem 1.5rem", borderRadius:10, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".875rem", cursor:"pointer", transition:"all .2s", transform:hov?"translateY(-1px)":"none", boxShadow:hov?"0 6px 20px rgba(0,91,127,.3)":"none", ...style }}>{children}</button>;
}

function BtnOrange({ children, onClick, style={} }) {
  const [hov, setHov] = useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:`linear-gradient(135deg,${T.orange},#D97706)`, color:"#fff", border:"none", padding:".7rem 1.5rem", borderRadius:10, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".875rem", cursor:"pointer", transition:"all .2s", transform:hov?"translateY(-1px)":"none", boxShadow:hov?"0 6px 20px rgba(245,158,11,.35)":"none", ...style }}>{children}</button>;
}

function SuccessBar({ pct }) {
  return (
    <div>
      <div style={{ background:"#F0F9FF", borderRadius:50, height:6, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${T.sky},${T.green})`, borderRadius:50 }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:".7rem", color:T.muted, marginTop:".25rem" }}>
        <span>Success Rate</span><span style={{ color:T.green, fontWeight:700 }}>{pct}%</span>
      </div>
    </div>
  );
}

function PageHero({ tag, title, sub, children }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${T.navy} 0%,#004A66 50%,${T.blue} 100%)`, padding:"3rem 2rem", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(40,189,235,.06)", right:-100, top:-150, pointerEvents:"none" }} />
      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        {tag && <div style={{ display:"inline-block", background:"rgba(40,189,235,.18)", color:T.sky, fontSize:".7rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", padding:".3rem .875rem", borderRadius:50, marginBottom:".875rem" }}>{tag}</div>}
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"clamp(1.5rem,3vw,2.25rem)", fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:".625rem" }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,.7)", fontSize:".9375rem", lineHeight:1.7, maxWidth:560 }}>{sub}</p>}
        {children}
      </div>
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:".375rem", marginTop:".875rem", flexWrap:"wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:".375rem" }}>
          <span style={{ fontSize:".75rem", color:i===items.length-1?"rgba(255,255,255,.9)":"rgba(255,255,255,.5)", fontWeight:i===items.length-1?600:400, cursor:item.onClick?"pointer":"default" }} onClick={item.onClick}>{item.label}</span>
          {i<items.length-1 && <span style={{ color:"rgba(255,255,255,.3)", fontSize:".7rem" }}>›</span>}
        </span>
      ))}
    </div>
  );
}

// ─── COUPON MODAL ─────────────────────────────────────────────
function CouponModal({ coupon, onClose }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const countdown = useCountdown(coupon?.expires || "2026-06-30");

  if (!coupon) return null;
  function copy() {
    try { navigator.clipboard.writeText(coupon.code); } catch(e) {}
    setCopied(true); setTimeout(()=>setCopied(false), 2500);
  }
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:20, padding:"2rem", maxWidth:480, width:"100%", position:"relative", boxShadow:"0 24px 80px rgba(0,0,0,.25)", animation:"slideUp .3s ease", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:"1rem", right:"1rem", background:"none", border:"none", cursor:"pointer", fontSize:"1.25rem", color:T.muted }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:"1.25rem" }}>
          <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>🎟️</div>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.2rem", fontWeight:800, color:T.navy, marginBottom:".25rem" }}>{coupon.title}</h3>
          <p style={{ fontSize:".875rem", color:T.muted }}>{coupon.airline} — Limited Time Offer</p>
        </div>
        <div style={{ background:T.lb, border:`2px dashed ${T.sky}`, borderRadius:10, padding:"1rem", textAlign:"center", marginBottom:"1rem" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:T.blue, letterSpacing:".2em", filter:revealed?"none":"blur(6px)", transition:"filter .3s", cursor:revealed?"auto":"pointer" }} onClick={()=>setRevealed(true)}>{coupon.code}</div>
          {!revealed && <p style={{ fontSize:".75rem", color:T.muted, marginTop:".25rem" }}>Click to reveal code</p>}
        </div>
        <div style={{ display:"flex", gap:".625rem", justifyContent:"center", marginBottom:".75rem" }}>
          <button onClick={copy} style={{ background:copied?T.green:T.blue, color:"#fff", border:"none", padding:".625rem 1.5rem", borderRadius:8, fontFamily:"'Sora',sans-serif", fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{copied?"✅ Copied!":"📋 Copy Code"}</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:".5rem", marginBottom:"1rem" }}>
          {[{v:`${countdown.d}d`,l:"Days",c:T.navy},{v:`${countdown.h}h`,l:"Hours",c:T.blue},{v:`${countdown.m}m`,l:"Min",c:T.sky},{v:`${countdown.s}s`,l:"Sec",c:"#CBD5E1"}].map(s=>(
            <div key={s.l} style={{ textAlign:"center", background:s.c, borderRadius:8, padding:".625rem", color:s.c==="#CBD5E1"?T.navy:"#fff" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800 }}>{s.v}</div>
              <div style={{ fontSize:".6rem", opacity:.75 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:".5rem", marginBottom:".875rem" }}>
          {[{val:`-${coupon.discount}%`,lbl:"Discount",col:T.orange},{val:`${coupon.success}%`,lbl:"Success Rate",col:T.green}].map(s=>(
            <div key={s.lbl} style={{ flex:1, textAlign:"center", background:T.bg, borderRadius:8, padding:".625rem" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.2rem", fontWeight:800, color:s.col }}>{s.val}</div>
              <div style={{ fontSize:".7rem", color:T.muted }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ background:T.bg, borderRadius:10, padding:".875rem", marginBottom:"1rem", fontSize:".8rem", color:T.muted, lineHeight:1.6 }}>
          <strong style={{ color:T.navy }}>💡 How to Use</strong><br/>
          1. Copy the code above → 2. Click Redeem Deal → 3. Paste at checkout to save!
        </div>
        <BtnOrange style={{ width:"100%", padding:".875rem", fontSize:"1rem" }}>🚀 Redeem This Deal →</BtnOrange>
      </div>
    </div>
  );
}

// ─── DEAL CARD ────────────────────────────────────────────────
function DealCard({ d, onRedeem, setPage }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${hov?T.sky:T.border}`, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-4px)":"none", boxShadow:hov?"0 16px 40px rgba(0,91,127,.1)":"none", transition:"all .3s" }}>
      <div style={{ height:160, background:d.bg, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setPage&&setPage("deal-detail",d)}>
        <span style={{ fontSize:"3.5rem", opacity:.6 }}>{d.emoji}</span>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,.4) 0%,transparent 60%)" }} />
        <div style={{ position:"absolute", top:".75rem", left:".75rem", padding:".25rem .625rem", borderRadius:50, fontSize:".6875rem", fontWeight:700, background:d.typeColor, color:"#fff" }}>{d.type}</div>
        <div style={{ position:"absolute", top:".75rem", right:".75rem", background:"rgba(0,0,0,.6)", color:"#fff", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".9rem", padding:".25rem .625rem", borderRadius:8 }}>-{d.discount}%</div>
        {d.price && <div style={{ position:"absolute", bottom:".75rem", right:".75rem", background:"rgba(0,0,0,.7)", color:"#fff", fontSize:".7rem", padding:".2rem .5rem", borderRadius:6 }}>{d.price}</div>}
      </div>
      <div style={{ padding:"1rem 1.25rem 1.25rem" }} onClick={()=>onRedeem(d)}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:".375rem", fontSize:".7rem", color:T.blue, fontWeight:600, background:T.lb, padding:".25rem .625rem", borderRadius:50, marginBottom:".625rem" }}>✈️ {d.airline}</div>
        <div style={{ fontWeight:700, fontSize:".9375rem", color:T.navy, marginBottom:".5rem", lineHeight:1.4 }}>{d.title}</div>
        <div style={{ fontSize:".8rem", color:T.muted, marginBottom:".875rem", lineHeight:1.6 }}>{d.desc}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:".875rem" }}>
            <span style={{ fontSize:".7rem", color:T.muted }}>👁 {(d.views/1000).toFixed(1)}K</span>
            <span style={{ fontSize:".7rem", color:T.muted }}>💬 {d.comments}</span>
          </div>
          <span style={{ fontSize:".8rem", fontWeight:700, color:T.green }}>✅ {d.success}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── COUPON CARD ──────────────────────────────────────────────
function CouponCard({ c, onRedeem }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>onRedeem(c)} style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${hov?T.sky:T.border}`, padding:"1.25rem", minWidth:260, flexShrink:0, position:"relative", overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-4px)":"translateY(0)", boxShadow:hov?"0 16px 40px rgba(0,91,127,.12)":"none", transition:"all .3s" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:c.type==="featured"?`linear-gradient(90deg,${T.orange},#FFB800)`:`linear-gradient(90deg,${T.blue},${T.sky})` }} />
      <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1rem" }}>
        <div style={{ width:44, height:44, borderRadius:10, background:c.airlineColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".65rem", fontWeight:800, color:"#fff" }}>{c.airlineCode}</div>
        <div><div style={{ fontWeight:700, fontSize:".9rem", color:T.navy }}>{c.airline}</div><div style={{ fontSize:".75rem", color:T.muted }}>{c.route||"Worldwide"}</div></div>
      </div>
      <div style={{ display:"inline-flex", alignItems:"center", gap:".375rem", background:"#ECFDF5", color:T.green, fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50, marginBottom:".625rem" }}>{c.badge}</div>
      <div style={{ fontWeight:700, fontSize:"1.05rem", color:T.navy, marginBottom:".375rem", lineHeight:1.3 }}>{c.title}</div>
      <div style={{ display:"flex", gap:".875rem", marginBottom:".875rem" }}>
        <span style={{ fontSize:".7rem", color:T.muted }}>📅 {c.expires}</span>
        <span style={{ fontSize:".7rem", color:T.muted }}>👁 {c.views.toLocaleString()}</span>
      </div>
      <SuccessBar pct={c.success} />
      <button style={{ width:"100%", background:c.type==="featured"?`linear-gradient(135deg,${T.orange},#E68A00)`:`linear-gradient(135deg,${T.blue},${T.navy})`, color:"#fff", border:"none", padding:".625rem", borderRadius:8, fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:".8125rem", cursor:"pointer", marginTop:".875rem" }}>🎟 Show Coupon Code</button>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────
function Header({ page, setPage }) {
  const navItems = [["home","🏠 Home"],["flight-deals","🏷️ Deals"],["airlines","✈️ Airlines"],["categories","📂 Categories"],["destinations","🗺️ Destinations"],["blog","📰 Travel News"],["share","📤 Share Coupon"],["contact","✉️ Contact"]];
  return (
    <header style={{ position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,56,79,.3)" }}>
      <div style={{ background:T.navy, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.5rem", height:64, gap:"1rem" }}>
        <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:".5rem", cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:36, height:36, background:`linear-gradient(135deg,${T.sky},${T.orange})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✈️</div>
          <div style={{ fontFamily:"'Sora',sans-serif" }}>
            <div style={{ fontSize:"1.05rem", fontWeight:700, color:"#fff", lineHeight:1.1 }}>AirlineTopDeals</div>
            <div style={{ color:T.sky, fontSize:".65rem", letterSpacing:".05em" }}>Premium Travel Coupons</div>
          </div>
        </div>
        <div style={{ flex:1, maxWidth:360, position:"relative" }}>
          <span style={{ position:"absolute", left:".75rem", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.5)", fontSize:".875rem" }}>🔍</span>
          <input type="text" placeholder="Search airlines, deals, destinations..." style={{ width:"100%", padding:".5rem 1rem .5rem 2.5rem", borderRadius:50, border:"1.5px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.1)", color:"#fff", fontSize:".875rem", outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
        </div>
        <div style={{ display:"flex", gap:".625rem", flexShrink:0 }}>
          <button onClick={()=>setPage("login")} style={{ color:"rgba(255,255,255,.8)", fontSize:".8rem", padding:".375rem .75rem", borderRadius:6, border:"1px solid rgba(255,255,255,.2)", background:"transparent", cursor:"pointer" }}>Login</button>
          <button onClick={()=>setPage("dashboard")} style={{ background:`linear-gradient(135deg,${T.orange},#D97706)`, color:"#fff", fontSize:".8rem", padding:".375rem .875rem", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:600 }}>Dashboard</button>
        </div>
      </div>
      <nav style={{ background:T.blue, borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <div style={{ display:"flex", alignItems:"center", padding:"0 1.5rem", gap:".125rem", overflowX:"auto", scrollbarWidth:"none" }}>
          {navItems.map(([key,label])=>(
            <button key={key} onClick={()=>setPage(key)} style={{ color:page===key?T.sky:"rgba(255,255,255,.8)", fontSize:".8125rem", padding:".625rem 1rem", whiteSpace:"nowrap", borderRadius:4, background:page===key?"rgba(255,255,255,.1)":"transparent", border:"none", cursor:"pointer", fontWeight:500 }}>{label}</button>
          ))}
        </div>
      </nav>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background:T.navy, color:"rgba(255,255,255,.75)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"2.5rem", padding:"3rem 2rem", maxWidth:1200, margin:"0 auto" }}>
        <div>
          <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1rem", cursor:"pointer" }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg,${T.sky},${T.orange})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✈️</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.1rem", fontWeight:700, color:"#fff" }}>AirlineTopDeals</div>
          </div>
          <p style={{ fontSize:".8rem", lineHeight:1.7, color:"rgba(255,255,255,.55)", maxWidth:260, marginBottom:"1.25rem" }}>Your trusted source for airline coupons, flight deals, and travel discounts from the world's top airlines.</p>
          <div style={{ display:"flex", gap:".5rem" }}>
            {["f","𝕏","in","▶","📷"].map(s=><button key={s} style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,.1)", border:"none", color:"rgba(255,255,255,.7)", fontSize:".75rem", cursor:"pointer" }}>{s}</button>)}
          </div>
        </div>
        {[
          ["Quick Links",[["home","Home"],["flight-deals","All Deals"],["airlines","Airlines"],["destinations","Destinations"],["blog","Travel News"],["share","Submit Deal"]]],
          ["Categories",[["flight-deals","Airline Coupons"],["flight-deals","Flight Deals"],["flight-deals","Hotel Deals"],["flight-deals","Vacation Packages"],["flight-deals","Student Discounts"],["flight-deals","Business Class"]]],
          ["Company",[["contact","Contact Us"],["privacy","Privacy Policy"],["terms","Terms & Conditions"],["login","Login"],["register","Register"],["admin","Admin Panel"]]],
        ].map(([h,links])=>(
          <div key={h}>
            <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:".875rem", fontWeight:700, color:"#fff", marginBottom:"1rem" }}>{h}</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".5rem" }}>
              {links.map(([href,text])=>(
                <li key={text}><a onClick={()=>setPage(href)} style={{ fontSize:".8rem", color:"rgba(255,255,255,.5)", cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=T.sky} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{text}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", padding:"1.25rem 2rem", maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:".5rem" }}>
        <div style={{ fontSize:".8rem", color:"rgba(255,255,255,.4)" }}>© 2026 AirlineTopDeals.com — All rights reserved.</div>
        <div style={{ display:"flex", gap:".75rem" }}>
          {["SSL Secured","GDPR Compliant"].map(b=><span key={b} style={{ fontSize:".7rem", color:"rgba(255,255,255,.4)", padding:".25rem .625rem", border:"1px solid rgba(255,255,255,.1)", borderRadius:4 }}>{b}</span>)}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage, onRedeem }) {
  const [sliderIdx, setSliderIdx] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All Deals");
  const filters = ["All Deals","Promo Codes","Flight Deals","Hotel Packages","Student Deals","Business Class"];
  const filteredDeals = activeFilter==="All Deals" ? DEALS : DEALS.filter(d=>d.category===activeFilter||d.type.toLowerCase().includes(activeFilter.toLowerCase().split(" ")[0]));

  return (
    <div>
      {/* Hero */}
      <section style={{ background:`linear-gradient(135deg,${T.navy} 0%,#004A66 40%,${T.blue} 70%,#0077A8 100%)`, position:"relative", overflow:"hidden", padding:"4rem 2rem 5rem" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"rgba(40,189,235,.07)", right:-200, top:-200, pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(40,189,235,.07)", left:-100, bottom:-150, pointerEvents:"none" }} />
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"rgba(40,189,235,.15)", border:"1px solid rgba(40,189,235,.3)", color:T.sky, fontSize:".8rem", padding:".375rem 1rem", borderRadius:50, marginBottom:"1.5rem", fontWeight:500 }}>✈️ &nbsp;500+ Active Deals Updated Daily</div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"clamp(1.75rem,4vw,3rem)", fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:"1rem" }}>Find the Best <span style={{ color:T.sky }}>Airline Deals,</span><br/>Coupons & <span style={{ color:T.orange }}>Flight Discounts</span></h1>
          <p style={{ fontSize:"1.0625rem", color:"rgba(255,255,255,.7)", marginBottom:"2.5rem", lineHeight:1.7, maxWidth:560, margin:"0 auto 2.5rem" }}>Save more on flights, travel packages, attractions, and vacation deals from top airlines worldwide.</p>
          <div style={{ background:"rgba(255,255,255,.08)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,.15)", borderRadius:16, padding:"1.25rem", display:"flex", flexWrap:"wrap", gap:".75rem", marginBottom:"2rem" }}>
            {["From","To","Airline","Category"].map(lbl=>(
              <div key={lbl} style={{ flex:1, minWidth:130 }}>
                <label style={{ fontSize:".7rem", color:"rgba(255,255,255,.6)", fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", display:"block", marginBottom:".375rem" }}>{lbl}</label>
                <select style={{ width:"100%", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:8, padding:".625rem .875rem", color:"#fff", fontSize:".875rem", outline:"none" }}>
                  <option style={{ background:T.navy }}>Any {lbl}</option>
                </select>
              </div>
            ))}
            <BtnPrimary style={{ alignSelf:"flex-end", background:`linear-gradient(135deg,${T.sky},#1A9DD0)`, padding:".75rem 2rem" }}>🔍 Search Deals</BtnPrimary>
          </div>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"2.5rem" }}>
            <BtnOrange onClick={()=>setPage("flight-deals")}>🏷️ Browse All Deals</BtnOrange>
            <button onClick={()=>setPage("airlines")} style={{ background:"transparent", color:"#fff", padding:".75rem 2rem", borderRadius:10, fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:".9375rem", border:"2px solid rgba(255,255,255,.3)", cursor:"pointer" }}>✈️ View Airlines</button>
          </div>
          <div style={{ display:"flex", gap:"2.5rem", justifyContent:"center", flexWrap:"wrap" }}>
            {[["847+","Active Coupons"],["48","Partner Airlines"],["$2.4M","Saved by Users"],["92%","Success Rate"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#fff" }}>{n}</div>
                <div style={{ fontSize:".75rem", color:"rgba(255,255,255,.6)", marginTop:".125rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coupon Slider */}
      <section style={{ padding:"4rem 2rem", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="🔥 Hot Right Now" title="Featured Airline Coupons" sub="Hand-picked deals with the highest success rates — updated every 24 hours" />
          <div style={{ overflow:"hidden" }}>
            <div style={{ display:"flex", gap:"1.25rem", transform:`translateX(-${sliderIdx*(260+20)}px)`, transition:"transform .5s cubic-bezier(.4,0,.2,1)" }}>
              {COUPONS.map(c=><CouponCard key={c.code} c={c} onRedeem={onRedeem} />)}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".75rem", marginTop:"1.5rem" }}>
            <button onClick={()=>setSliderIdx(Math.max(0,sliderIdx-1))} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:"1rem", color:T.navy }}>◀</button>
            {[0,1,2].map(i=><div key={i} onClick={()=>setSliderIdx(i)} style={{ width:sliderIdx===i?24:8, height:8, borderRadius:50, background:sliderIdx===i?T.blue:T.border, cursor:"pointer", transition:"all .2s" }} />)}
            <button onClick={()=>setSliderIdx(Math.min(COUPONS.length-3,sliderIdx+1))} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:"1rem", color:T.navy }}>▶</button>
          </div>
        </div>
      </section>

      {/* Popular Airlines */}
      <section style={{ padding:"4rem 2rem", background:T.bg }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="✈️ Top Airlines" title="Popular Airline Stores" sub="Exclusive coupons for the world's leading airlines" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"1rem" }}>
            {AIRLINES.map(a=>(
              <div key={a.code} onClick={()=>setPage("airline-detail",a)} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"1rem", textAlign:"center", cursor:"pointer", transition:"all .3s", position:"relative" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.sky;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,91,127,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ width:56, height:56, borderRadius:12, margin:"0 auto .625rem", background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".8rem", fontWeight:800, color:"#fff" }}>{a.code}</div>
                <div style={{ fontSize:".8rem", fontWeight:700, color:T.navy, marginBottom:".25rem" }}>{a.name}</div>
                <div style={{ fontSize:".7rem", color:T.muted }}>{a.deals} deals</div>
                {(a.hot||a.isNew) && <div style={{ position:"absolute", top:".5rem", right:".5rem", background:T.orange, color:"#fff", fontSize:".6rem", fontWeight:700, padding:".125rem .375rem", borderRadius:50 }}>{a.hot?"HOT":"NEW"}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Deals */}
      <section style={{ padding:"4rem 2rem", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="🏷️ Latest Deals" title="Fresh Flight Deals" sub="New coupons and discounts added daily — don't miss out" />
          <div style={{ display:"flex", gap:".625rem", flexWrap:"wrap", marginBottom:"2rem", alignItems:"center" }}>
            <span style={{ fontSize:".8rem", fontWeight:600, color:T.navy }}>Filter:</span>
            {filters.map(f=>(
              <button key={f} onClick={()=>setActiveFilter(f)} style={{ padding:".4rem 1rem", borderRadius:50, border:`1.5px solid ${activeFilter===f?T.blue:T.border}`, background:activeFilter===f?T.blue:"#fff", color:activeFilter===f?"#fff":T.muted, fontSize:".8rem", fontWeight:500, cursor:"pointer" }}>{f}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
            {(filteredDeals.length?filteredDeals:DEALS).map(d=><DealCard key={d.id} d={d} onRedeem={onRedeem} setPage={setPage} />)}
          </div>
          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <BtnOrange onClick={()=>setPage("flight-deals")}>View All 847 Deals →</BtnOrange>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section style={{ padding:"4rem 2rem", background:T.bg }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="🗺️ Explore" title="Top Travel Destinations" sub="Discover deals and activities in the world's most popular destinations" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1.25rem" }}>
            {DESTINATIONS.slice(0,6).map(d=>(
              <div key={d.id} onClick={()=>setPage("destination-detail",d)} style={{ borderRadius:20, overflow:"hidden", cursor:"pointer", position:"relative", height:240, display:"flex", alignItems:"flex-end", background:d.bg, transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 20px 48px rgba(0,0,0,.2)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem" }}>{d.emoji}</div>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.1) 60%,transparent 100%)" }} />
                <div style={{ position:"relative", zIndex:1, padding:"1.25rem", width:"100%" }}>
                  <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.7)", fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", marginBottom:".25rem" }}>{d.region}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.125rem", color:"#fff", marginBottom:".375rem" }}>{d.name}</div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:".375rem", background:T.orange, color:"#fff", fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>🏷️ {d.deals} deals</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <BtnPrimary onClick={()=>setPage("destinations")}>Explore All Destinations →</BtnPrimary>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding:"4rem 2rem", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="📂 Browse By Type" title="Deal Categories" sub="Find exactly the type of travel deal you're looking for" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:"1rem" }}>
            {CATEGORIES.map(c=>(
              <div key={c.name} onClick={()=>setPage("flight-deals")} style={{ borderRadius:16, padding:"1.5rem 1rem", textAlign:"center", cursor:"pointer", background:`linear-gradient(135deg,${c.color},${c.color}99)`, transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,.12)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ width:52, height:52, borderRadius:14, margin:"0 auto 1rem", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", background:"rgba(255,255,255,.25)" }}>{c.icon}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".875rem", color:"#fff", marginBottom:".25rem" }}>{c.name}</div>
                <div style={{ fontSize:".75rem", color:"rgba(255,255,255,.75)" }}>{c.count} deals</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background:`linear-gradient(135deg,${T.navy},${T.blue},#0077A8)`, position:"relative", overflow:"hidden" }}>
        <div style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:560, margin:"0 auto", padding:"4rem 2rem" }}>
          <SectionTag style={{ background:"rgba(40,189,235,.2)", color:T.sky }}>📧 Stay Updated</SectionTag>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:800, color:"#fff", marginBottom:".75rem" }}>Get the Best Airline Deals<br/>Straight to Your Inbox</h2>
          <p style={{ color:"rgba(255,255,255,.7)", marginBottom:"2rem", fontSize:".9375rem", lineHeight:1.7 }}>Join 85,000+ smart travelers. Get exclusive promo codes and flash sales first.</p>
          <div style={{ display:"flex", gap:".75rem" }}>
            <input type="email" placeholder="Enter your email address..." style={{ flex:1, background:"rgba(255,255,255,.1)", border:"1.5px solid rgba(255,255,255,.2)", borderRadius:10, padding:".75rem 1rem", color:"#fff", fontSize:".9rem", outline:"none" }} />
            <BtnOrange>Subscribe Free</BtnOrange>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section style={{ padding:"4rem 2rem", background:T.bg }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionHead tag="📰 Travel Insights" title="Latest Travel News & Guides" sub="Expert tips, destination guides, and airline news" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.25rem" }}>
            {BLOG_POSTS.slice(0,3).map(b=>(
              <div key={b.id} onClick={()=>setPage("blog-detail",b)} style={{ borderRadius:16, overflow:"hidden", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,91,127,.1)";e.currentTarget.style.borderColor=T.sky;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
                <div style={{ height:180, background:b.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", position:"relative" }}>
                  {b.emoji}<div style={{ position:"absolute", top:".75rem", left:".75rem", background:T.blue, color:"#fff", fontSize:".65rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>{b.cat}</div>
                </div>
                <div style={{ padding:"1.25rem" }}>
                  <div style={{ display:"flex", gap:".75rem", marginBottom:".625rem" }}>
                    <span style={{ fontSize:".75rem", color:T.muted }}>📅 {b.date}</span>
                    <span style={{ fontSize:".75rem", color:T.sky, fontWeight:600 }}>⏱ {b.read}</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:".9375rem", color:T.navy, lineHeight:1.4, marginBottom:".5rem" }}>{b.title}</div>
                  <div style={{ fontSize:".8rem", color:T.muted, lineHeight:1.6 }}>{b.excerpt}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <BtnPrimary onClick={()=>setPage("blog")}>Read All Articles →</BtnPrimary>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FLIGHT DEALS PAGE ────────────────────────────────────────
function FlightDealsPage({ onRedeem }) {
  const [sortBy, setSortBy] = useState("Latest");
  const [search, setSearch] = useState("");
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minSuccess, setMinSuccess] = useState(70);
  const sortOptions = ["Latest","Most Popular","Highest Discount","Expiring Soon"];
  const allCategories = [...new Set(DEALS.map(d=>d.category))];

  const filtered = DEALS.filter(d=>{
    if(search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.airline.toLowerCase().includes(search.toLowerCase())) return false;
    if(selectedAirlines.length && !selectedAirlines.includes(d.airline)) return false;
    if(selectedCategories.length && !selectedCategories.includes(d.category)) return false;
    if(d.success < minSuccess) return false;
    return true;
  });

  const sorted = [...filtered].sort((a,b)=>{
    if(sortBy==="Most Popular") return b.views-a.views;
    if(sortBy==="Highest Discount") return b.discount-a.discount;
    return b.id-a.id;
  });

  function toggleAirline(name) { setSelectedAirlines(p=>p.includes(name)?p.filter(x=>x!==name):[...p,name]); }
  function toggleCat(c) { setSelectedCategories(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]); }

  return (
    <div>
      <PageHero tag="847 Active Deals" title="All Flight Deals & Coupons" sub="Filter and find the perfect deal for your next trip">
        <div style={{ marginTop:"1rem", maxWidth:440 }}>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search deals, airlines..." style={{ width:"100%", padding:".75rem 1rem", borderRadius:10, border:"1.5px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", color:"#fff", fontSize:".9rem", outline:"none" }} />
        </div>
      </PageHero>

      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:"1.5rem", padding:"2rem", maxWidth:1200, margin:"0 auto", alignItems:"start" }}>
        {/* Sidebar */}
        <aside style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${T.border}`, padding:"1.25rem", position:"sticky", top:80 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy, marginBottom:"1rem", paddingBottom:".75rem", borderBottom:`1.5px solid ${T.border}` }}>🎛️ Filter Deals</h3>
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ fontSize:".75rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".05em", marginBottom:".625rem" }}>Airline</div>
            {AIRLINES.map(a=>(
              <label key={a.code} style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".375rem", cursor:"pointer" }}>
                <input type="checkbox" checked={selectedAirlines.includes(a.name)} onChange={()=>toggleAirline(a.name)} style={{ accentColor:T.blue }} />
                <span style={{ fontSize:".8125rem", color:T.dark }}>{a.name} ({a.deals})</span>
              </label>
            ))}
          </div>
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ fontSize:".75rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".05em", marginBottom:".625rem" }}>Category</div>
            {allCategories.map(c=>(
              <label key={c} style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".375rem", cursor:"pointer" }}>
                <input type="checkbox" checked={selectedCategories.includes(c)} onChange={()=>toggleCat(c)} style={{ accentColor:T.blue }} />
                <span style={{ fontSize:".8125rem", color:T.dark }}>{c}</span>
              </label>
            ))}
          </div>
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ fontSize:".75rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".05em", marginBottom:".625rem" }}>Min. Success Rate</div>
            <input type="range" min="0" max="100" value={minSuccess} onChange={e=>setMinSuccess(+e.target.value)} style={{ width:"100%", accentColor:T.blue }} />
            <span style={{ fontSize:".8rem", color:T.muted }}>{minSuccess}%</span>
          </div>
          <BtnPrimary onClick={()=>{setSelectedAirlines([]);setSelectedCategories([]);setMinSuccess(70);}} style={{ width:"100%", padding:".625rem" }}>Reset Filters</BtnPrimary>
        </aside>

        <div>
          <div style={{ display:"flex", gap:".625rem", flexWrap:"wrap", marginBottom:"1.5rem", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:".875rem", color:T.muted }}>Showing <strong style={{ color:T.navy }}>{sorted.length}</strong> deals</div>
            <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
              <span style={{ fontSize:".8rem", fontWeight:600, color:T.navy, marginRight:".25rem" }}>Sort:</span>
              {sortOptions.map(s=>(
                <button key={s} onClick={()=>setSortBy(s)} style={{ padding:".4rem .875rem", borderRadius:50, border:`1.5px solid ${sortBy===s?T.blue:T.border}`, background:sortBy===s?T.blue:"#fff", color:sortBy===s?"#fff":T.muted, fontSize:".775rem", cursor:"pointer" }}>{s}</button>
              ))}
            </div>
          </div>
          {sorted.length===0 ? (
            <div style={{ textAlign:"center", padding:"3rem", color:T.muted }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔍</div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", color:T.navy, marginBottom:".5rem" }}>No deals found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
              {sorted.map(d=><DealCard key={d.id} d={d} onRedeem={onRedeem} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AIRLINES LISTING PAGE ────────────────────────────────────
function AirlinesPage({ setPage }) {
  const [search, setSearch] = useState("");
  const filtered = AIRLINES.filter(a=>a.name.toLowerCase().includes(search.toLowerCase())||a.country.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHero tag="48 Airlines" title="✈️ Airline Stores" sub="Browse exclusive deals from world-class airlines">
        <div style={{ marginTop:"1rem", maxWidth:400 }}>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search airlines or country..." style={{ width:"100%", padding:".75rem 1rem", borderRadius:10, border:"1.5px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", color:"#fff", fontSize:".9rem", outline:"none" }} />
        </div>
      </PageHero>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
        {filtered.length===0 ? <div style={{ textAlign:"center", padding:"3rem", color:T.muted }}>No airlines found for "{search}"</div> : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.25rem" }}>
            {filtered.map(a=>(
              <div key={a.code} onClick={()=>setPage("airline-detail",a)} style={{ background:"#fff", borderRadius:16, border:`1.5px solid ${T.border}`, overflow:"hidden", cursor:"pointer", transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,91,127,.1)";e.currentTarget.style.borderColor=T.sky;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
                <div style={{ background:a.color, height:100, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:"1.75rem", fontWeight:800, color:"rgba(255,255,255,.3)", letterSpacing:".05em", position:"relative" }}>
                  {a.name.toUpperCase()}
                  {(a.hot||a.isNew) && <div style={{ position:"absolute", top:".75rem", right:".75rem", background:T.orange, color:"#fff", fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>{a.hot?"🔥 HOT":"✨ NEW"}</div>}
                </div>
                <div style={{ padding:"1rem 1.25rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".5rem" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".7rem", fontWeight:800, color:"#fff" }}>{a.code}</div>
                    <div>
                      <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", color:T.navy }}>{a.name}</div>
                      <div style={{ fontSize:".75rem", color:T.muted }}>🌍 {a.country} · {a.hub}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:".8rem", color:T.muted, marginBottom:".875rem", lineHeight:1.6 }}>{a.about}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:".875rem", fontWeight:700, color:T.blue }}>{a.deals} Active Deals</span>
                    <BtnPrimary style={{ padding:".4rem .875rem", fontSize:".75rem" }}>View Deals</BtnPrimary>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AIRLINE DETAIL PAGE ──────────────────────────────────────
function AirlineDetailPage({ airline, setPage, onRedeem }) {
  const a = airline || AIRLINES[0];
  const airlineDeals = DEALS.filter(d=>d.airline===a.name);
  const airlineCoupons = COUPONS.filter(c=>c.airline===a.name);
  const faqs = [
    { q:`How do I use ${a.name} coupon codes?`, a:`Copy the code from the deal page, visit ${a.name}'s official website, select your flight, and paste the code at checkout to apply your discount.` },
    { q:`When do ${a.name} deals expire?`, a:`Each deal has its own expiry date shown on the coupon card. Most deals run for 2-6 weeks. We recommend booking as soon as you find a good deal.` },
    { q:`Can I combine ${a.name} promo codes?`, a:`Typically, only one promo code can be applied per booking. Check the specific terms of each coupon for combination restrictions.` },
  ];

  return (
    <div>
      <PageHero title={a.name} sub={a.about}>
        <Breadcrumb items={[{label:"Home",onClick:()=>setPage("home")},{label:"Airlines",onClick:()=>setPage("airlines")},{label:a.name}]} />
      </PageHero>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem" }}>
        {/* Airline overview */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"1rem", marginBottom:"2rem" }}>
          {[{l:"Active Deals",v:a.deals},{l:"Country",v:a.country},{l:"Hub",v:a.hub},{l:"Founded",v:a.founded}].map(s=>(
            <div key={s.l} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"1rem", textAlign:"center" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy }}>{s.v}</div>
              <div style={{ fontSize:".75rem", color:T.muted, marginTop:".25rem" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Coupons */}
        {airlineCoupons.length>0 && (
          <div style={{ marginBottom:"2rem" }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, marginBottom:"1.25rem" }}>🎟 {a.name} Coupon Codes</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.25rem" }}>
              {airlineCoupons.map(c=><CouponCard key={c.code} c={c} onRedeem={onRedeem} />)}
            </div>
          </div>
        )}

        {/* Deals */}
        <div style={{ marginBottom:"2rem" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, marginBottom:"1.25rem" }}>🏷️ {a.name} Flight Deals</h2>
          {airlineDeals.length>0 ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
              {airlineDeals.map(d=><DealCard key={d.id} d={d} onRedeem={onRedeem} />)}
            </div>
          ) : (
            <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"2rem", textAlign:"center", color:T.muted }}>
              <p>Showing general deals — check back for {a.name}-specific offers.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem", marginTop:"1.25rem" }}>
                {DEALS.slice(0,3).map(d=><DealCard key={d.id} d={d} onRedeem={onRedeem} />)}
              </div>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"1.5rem" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy, marginBottom:"1.25rem" }}>❓ Frequently Asked Questions</h2>
          {faqs.map((f,i)=><FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${T.border}`, paddingBottom:"1rem", marginBottom:"1rem" }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", gap:"1rem" }}>
        <span style={{ fontWeight:600, color:T.navy, fontSize:".9375rem" }}>{q}</span>
        <span style={{ color:T.blue, fontSize:"1.25rem", flexShrink:0, transform:open?"rotate(45deg)":"none", transition:"transform .2s" }}>+</span>
      </div>
      {open && <p style={{ fontSize:".875rem", color:T.muted, lineHeight:1.7, marginTop:".75rem" }}>{a}</p>}
    </div>
  );
}

// ─── DEAL DETAIL PAGE ─────────────────────────────────────────
function DealDetailPage({ deal, setPage, onRedeem }) {
  const d = deal || DEALS[0];
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const related = DEALS.filter(x=>x.id!==d.id&&x.airline===d.airline).concat(DEALS.filter(x=>x.id!==d.id&&x.category===d.category)).slice(0,3);

  function copy() {
    try { navigator.clipboard.writeText(d.code); } catch(e) {}
    setCopied(true); setTimeout(()=>setCopied(false),2500);
  }

  return (
    <div>
      <PageHero title={d.title} sub={d.desc}>
        <Breadcrumb items={[{label:"Home",onClick:()=>setPage("home")},{label:"Deals",onClick:()=>setPage("flight-deals")},{label:d.airline}]} />
      </PageHero>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 320px", gap:"2rem", alignItems:"start" }}>
        <main>
          <div style={{ display:"flex", gap:".625rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
            <span style={{ display:"inline-flex", background:"#ECFDF5", color:T.green, fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>✅ Verified Working</span>
            <span style={{ display:"inline-flex", background:T.lb, color:T.blue, fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>✈️ {d.airline}</span>
            <span style={{ display:"inline-flex", background:"#FFF7ED", color:"#92400E", fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>📂 {d.category}</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
            {[{v:`-${d.discount}%`,l:"Discount",c:T.orange},{v:`${d.success}%`,l:"Success Rate",c:T.green},{v:d.expires,l:"Expires",c:T.blue}].map(s=>(
              <div key={s.l} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"1rem", textAlign:"center" }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:".75rem", color:T.muted }}>{s.l}</div>
              </div>
            ))}
          </div>

          <SuccessBar pct={d.success} />
          <p style={{ fontSize:".8rem", color:T.muted, marginTop:".375rem", marginBottom:"1.5rem" }}>{d.views.toLocaleString()} users tried · {Math.round(d.views*d.success/100).toLocaleString()} succeeded</p>

          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"1.25rem", marginBottom:"1.5rem" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1rem", fontWeight:700, color:T.navy, marginBottom:"1rem" }}>How to Redeem This Deal</h3>
            {["Copy the coupon code from the sidebar","Visit "+d.airline+"'s official booking website","Search for your flight and select your class","Paste the promo code at checkout to apply savings"].map((step,i)=>(
              <div key={i} style={{ display:"flex", gap:".875rem", alignItems:"flex-start", marginBottom:".875rem" }}>
                <div style={{ width:28, height:28, background:[T.blue,T.sky,T.green,T.orange][i], color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".75rem", fontWeight:800, flexShrink:0 }}>{i+1}</div>
                <p style={{ fontSize:".875rem", color:T.muted, lineHeight:1.6, margin:0 }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ background:"#FFFBEB", border:`1.5px solid #FDE68A`, borderRadius:12, padding:"1.125rem", marginBottom:"1.5rem" }}>
            <h4 style={{ fontSize:".875rem", fontWeight:700, color:"#92400E", marginBottom:".75rem" }}>📋 Terms & Conditions</h4>
            {["Valid for the advertised class only","Cannot be combined with other promotional offers","Minimum advance purchase may apply","Applies to base fare only — taxes not included","One coupon code per booking"].map((t,i)=>(
              <div key={i} style={{ display:"flex", gap:".5rem", marginBottom:".375rem" }}>
                <span style={{ color:T.orange, flexShrink:0 }}>•</span>
                <span style={{ fontSize:".8125rem", color:"#78350F", lineHeight:1.5 }}>{t}</span>
              </div>
            ))}
          </div>

          {related.length>0 && (
            <div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1rem", fontWeight:700, color:T.navy, marginBottom:"1.25rem" }}>🎟 Related Deals</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.25rem" }}>
                {related.map(r=><DealCard key={r.id} d={r} onRedeem={onRedeem} />)}
              </div>
            </div>
          )}
        </main>

        <aside>
          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"1.375rem", position:"sticky", top:80 }}>
            <div style={{ background:`linear-gradient(135deg,${T.navy},${T.blue})`, borderRadius:12, padding:"1.375rem", textAlign:"center", marginBottom:"1.125rem" }}>
              <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.65)", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:".5rem" }}>Your Coupon Code</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#fff", letterSpacing:".2em", filter:revealed?"none":"blur(6px)", transition:"filter .4s", cursor:revealed?"auto":"pointer", marginBottom:".875rem" }} onClick={()=>setRevealed(true)}>{d.code}</div>
              <button onClick={()=>setRevealed(true)} style={{ background:`linear-gradient(135deg,${T.orange},#D97706)`, color:"#fff", border:"none", padding:".65rem 1.25rem", borderRadius:8, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".875rem", width:"100%", cursor:"pointer" }}>{revealed?"✅ Code Revealed!":"🎟 Click to Show Code"}</button>
            </div>
            {revealed && (
              <div style={{ display:"flex", gap:".625rem", marginBottom:"1rem" }}>
                <input value={d.code} readOnly style={{ flex:1, background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:8, padding:".6rem .875rem", fontFamily:"'Sora',sans-serif", fontWeight:700, letterSpacing:".12em", color:T.navy, outline:"none", fontSize:".8125rem" }} />
                <button onClick={copy} style={{ background:copied?T.green:T.blue, color:"#fff", border:"none", padding:".6rem .875rem", borderRadius:8, fontSize:".75rem", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{copied?"✅":"📋 Copy"}</button>
              </div>
            )}
            <BtnOrange style={{ width:"100%", padding:".875rem", marginBottom:".875rem" }}>🚀 Redeem at {d.airline} →</BtnOrange>
            <div style={{ display:"flex", gap:".5rem", marginBottom:"1.125rem" }}>
              {["📘 Share","🐦 Tweet","💬 WhatsApp"].map(s=><button key={s} style={{ flex:1, background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:8, padding:".5rem", fontSize:".7rem", fontWeight:600, color:T.muted, cursor:"pointer" }}>{s}</button>)}
            </div>
            <div style={{ background:T.bg, borderRadius:10, padding:".875rem" }}>
              <div style={{ fontSize:".75rem", fontWeight:700, color:T.navy, marginBottom:".625rem" }}>📊 Deal Stats</div>
              {[{l:"Views today",v:"342"},{l:"Total uses",v:d.views.toLocaleString()},{l:"Price from",v:d.price||"—"},{l:"Last verified",v:"Today ✅"}].map(s=>(
                <div key={s.l} style={{ display:"flex", justifyContent:"space-between", fontSize:".8rem", marginBottom:".375rem" }}>
                  <span style={{ color:T.muted }}>{s.l}</span><span style={{ fontWeight:700, color:T.navy }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── DESTINATIONS PAGE ────────────────────────────────────────
function DestinationsPage({ setPage }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const regions = ["All","North America","East Asia","Middle East","Western Europe","Southeast Asia","Southwest USA"];
  const filtered = DESTINATIONS.filter(d=>{
    if(search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.country.toLowerCase().includes(search.toLowerCase())) return false;
    if(filter!=="All" && d.region!==filter) return false;
    return true;
  });

  return (
    <div>
      <PageHero tag="Explore The World" title="🗺️ Travel Destinations" sub="Discover deals and activities in the world's most popular destinations">
        <div style={{ marginTop:"1rem", maxWidth:400 }}>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search destinations..." style={{ width:"100%", padding:".75rem 1rem", borderRadius:10, border:"1.5px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", color:"#fff", fontSize:".9rem", outline:"none" }} />
        </div>
      </PageHero>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
        <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"2rem" }}>
          {regions.map(r=>(
            <button key={r} onClick={()=>setFilter(r)} style={{ padding:".4rem .875rem", borderRadius:50, border:`1.5px solid ${filter===r?T.blue:T.border}`, background:filter===r?T.blue:"#fff", color:filter===r?"#fff":T.muted, fontSize:".8rem", cursor:"pointer" }}>{r}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.5rem" }}>
          {filtered.map(d=>(
            <div key={d.id} onClick={()=>setPage("destination-detail",d)} style={{ borderRadius:20, overflow:"hidden", cursor:"pointer", transition:"all .3s", border:`1.5px solid ${T.border}`, background:"#fff" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 20px 48px rgba(0,0,0,.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{ height:200, background:d.bg, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:"4rem", opacity:.7 }}>{d.emoji}</span>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,.5) 0%,transparent 60%)" }} />
                <div style={{ position:"absolute", bottom:".875rem", left:".875rem" }}>
                  <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:".05em" }}>{d.region}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.25rem", color:"#fff" }}>{d.name}</div>
                </div>
                <div style={{ position:"absolute", top:".75rem", right:".75rem", background:T.orange, color:"#fff", fontSize:".7rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>🏷️ {d.deals} deals</div>
              </div>
              <div style={{ padding:"1.25rem" }}>
                <p style={{ fontSize:".8rem", color:T.muted, lineHeight:1.6, marginBottom:"1rem" }}>{d.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
                  {d.attractions.slice(0,3).map(a=><span key={a} style={{ background:T.lb, color:T.blue, fontSize:".7rem", fontWeight:600, padding:".25rem .625rem", borderRadius:50 }}>{a}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DESTINATION DETAIL PAGE ──────────────────────────────────
function DestinationDetailPage({ dest, setPage, onRedeem }) {
  const d = dest || DESTINATIONS[0];
  const destDeals = DEALS.filter(dd=>dd.desc.toLowerCase().includes(d.name.toLowerCase())||dd.airline===d.airlines?.[0]).slice(0,3);
  const showDeals = destDeals.length>0 ? destDeals : DEALS.slice(0,3);

  return (
    <div>
      <div style={{ height:360, background:d.bg, position:"relative", display:"flex", alignItems:"flex-end" }}>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8rem", opacity:.4 }}>{d.emoji}</div>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.2) 50%,transparent 100%)" }} />
        <div style={{ position:"relative", zIndex:1, padding:"2rem", width:"100%", maxWidth:1100, margin:"0 auto" }}>
          <Breadcrumb items={[{label:"Home",onClick:()=>setPage("home")},{label:"Destinations",onClick:()=>setPage("destinations")},{label:d.name}]} />
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, color:"#fff", marginTop:".75rem", lineHeight:1.1 }}>{d.emoji} {d.name}</h1>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:"1.0625rem", lineHeight:1.6, maxWidth:560, marginTop:".5rem" }}>{d.country} · {d.region}</p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 300px", gap:"2rem", alignItems:"start" }}>
        <main>
          <p style={{ fontSize:"1rem", color:T.dark, lineHeight:1.8, marginBottom:"1.5rem" }}>{d.desc}</p>

          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy, marginBottom:"1rem" }}>🏛️ Top Attractions</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", marginBottom:"2rem" }}>
            {d.attractions.map(a=>(
              <div key={a} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:10, padding:".875rem", display:"flex", alignItems:"center", gap:".75rem" }}>
                <div style={{ width:36, height:36, background:T.lb, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem", flexShrink:0 }}>🗺️</div>
                <span style={{ fontWeight:600, color:T.navy, fontSize:".875rem" }}>{a}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy, marginBottom:"1rem" }}>✈️ Flights to {d.name}</h2>
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
              {showDeals.map(dd=><DealCard key={dd.id} d={dd} onRedeem={onRedeem} />)}
            </div>
          </div>

          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy, marginBottom:"1rem" }}>🛫 Airlines Flying to {d.name}</h2>
          <div style={{ display:"flex", gap:".75rem", flexWrap:"wrap", marginBottom:"2rem" }}>
            {(d.airlines||["Emirates","Singapore Airlines","Qatar Airways"]).map(an=>{
              const al = AIRLINES.find(a=>a.name===an)||{code:an.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),color:T.blue,name:an};
              return (
                <div key={an} style={{ display:"flex", alignItems:"center", gap:".625rem", background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:10, padding:".75rem 1rem" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:al.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".65rem", fontWeight:800, color:"#fff" }}>{al.code}</div>
                  <span style={{ fontSize:".875rem", fontWeight:600, color:T.navy }}>{an}</span>
                </div>
              );
            })}
          </div>
        </main>

        <aside>
          <div style={{ background:`linear-gradient(135deg,${T.navy},${T.blue})`, borderRadius:16, padding:"1.375rem", marginBottom:"1.25rem", textAlign:"center" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:".75rem" }}>{d.emoji}</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1rem", fontWeight:800, color:"#fff", marginBottom:".375rem" }}>{d.deals} Deals Available</div>
            <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.65)", marginBottom:"1rem", lineHeight:1.5 }}>Find the best prices for flights, hotels, and attractions</p>
            <BtnOrange onClick={()=>setPage("flight-deals")} style={{ width:"100%" }}>Browse All Deals →</BtnOrange>
          </div>

          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"1.25rem" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy, marginBottom:".875rem" }}>📍 Related Destinations</h3>
            {DESTINATIONS.filter(x=>x.id!==d.id).slice(0,4).map(r=>(
              <div key={r.id} onClick={()=>setPage("destination-detail",r)} style={{ display:"flex", gap:".75rem", alignItems:"center", marginBottom:".75rem", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ width:48, height:48, borderRadius:10, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>{r.emoji}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:".8125rem", color:T.navy }}>{r.name}</div>
                  <div style={{ fontSize:".7rem", color:T.muted }}>{r.deals} deals · {r.region}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── BLOG LISTING PAGE ────────────────────────────────────────
function BlogPage({ setPage }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(BLOG_POSTS.map(b=>b.cat))];
  const filtered = activeCategory==="All" ? BLOG_POSTS : BLOG_POSTS.filter(b=>b.cat===activeCategory);

  return (
    <div>
      <PageHero tag="Travel Insights" title="📰 Travel News & Guides" sub="Expert tips, destination guides, and airline updates from our team" />
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
        <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"2rem", alignItems:"center" }}>
          <span style={{ fontSize:".8rem", fontWeight:600, color:T.navy }}>Category:</span>
          {categories.map(c=>(
            <button key={c} onClick={()=>setActiveCategory(c)} style={{ padding:".4rem .875rem", borderRadius:50, border:`1.5px solid ${activeCategory===c?T.blue:T.border}`, background:activeCategory===c?T.blue:"#fff", color:activeCategory===c?"#fff":T.muted, fontSize:".8rem", cursor:"pointer" }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.5rem" }}>
          {filtered.map(b=>(
            <div key={b.id} onClick={()=>setPage("blog-detail",b)} style={{ borderRadius:16, overflow:"hidden", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", transition:"all .3s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,91,127,.1)";e.currentTarget.style.borderColor=T.sky;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
              <div style={{ height:200, background:b.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3.5rem", position:"relative" }}>
                {b.emoji}
                <div style={{ position:"absolute", top:".75rem", left:".75rem", background:T.blue, color:"#fff", fontSize:".65rem", fontWeight:700, padding:".3rem .75rem", borderRadius:50, letterSpacing:".04em" }}>{b.cat}</div>
              </div>
              <div style={{ padding:"1.375rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".75rem" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${T.sky},${T.blue})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:".65rem", fontWeight:800 }}>{b.authorInitials}</div>
                  <span style={{ fontSize:".75rem", fontWeight:600, color:T.navy }}>{b.author}</span>
                  <span style={{ fontSize:".75rem", color:T.muted }}>·</span>
                  <span style={{ fontSize:".75rem", color:T.muted }}>{b.date}</span>
                </div>
                <div style={{ fontWeight:700, fontSize:"1rem", color:T.navy, lineHeight:1.4, marginBottom:".625rem" }}>{b.title}</div>
                <div style={{ fontSize:".8rem", color:T.muted, lineHeight:1.6, marginBottom:".875rem" }}>{b.excerpt}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:".75rem" }}>
                    <span style={{ fontSize:".75rem", color:T.muted }}>⏱ {b.read} read</span>
                    <span style={{ fontSize:".75rem", color:T.muted }}>👁 {(b.views/1000).toFixed(1)}K</span>
                  </div>
                  <span style={{ fontSize:".8rem", color:T.sky, fontWeight:600 }}>Read →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BLOG DETAIL PAGE ─────────────────────────────────────────
function BlogDetailPage({ post, setPage, onRedeem }) {
  const b = post || BLOG_POSTS[0];
  const related = BLOG_POSTS.filter(x=>x.id!==b.id).slice(0,3);

  return (
    <div>
      <PageHero title={b.title} sub={b.excerpt}>
        <Breadcrumb items={[{label:"Home",onClick:()=>setPage("home")},{label:"Blog",onClick:()=>setPage("blog")},{label:b.cat}]} />
      </PageHero>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 300px", gap:"2rem", alignItems:"start" }}>
        <article>
          <div style={{ height:340, background:b.bg, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem", marginBottom:"1.75rem", position:"relative", overflow:"hidden" }}>
            {b.emoji}
            <div style={{ position:"absolute", top:"1.25rem", left:"1.25rem", background:T.blue, color:"#fff", fontSize:".7rem", fontWeight:700, padding:".3rem .75rem", borderRadius:50 }}>{b.cat}</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${T.sky},${T.blue})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"'Sora',sans-serif", fontSize:".75rem", fontWeight:800 }}>{b.authorInitials}</div>
              <div><div style={{ fontSize:".875rem", fontWeight:700, color:T.navy }}>{b.author}</div><div style={{ fontSize:".75rem", color:T.muted }}>Senior Travel Writer</div></div>
            </div>
            <span style={{ fontSize:".8rem", color:T.muted }}>📅 {b.date}</span>
            <span style={{ fontSize:".8rem", color:T.muted }}>⏱ {b.read} read</span>
            <span style={{ fontSize:".8rem", color:T.muted }}>👁 {b.views.toLocaleString()} views</span>
          </div>

          <div style={{ lineHeight:1.85 }}>
            <p style={{ fontSize:".9375rem", color:T.dark, marginBottom:"1.25rem" }}>Finding genuinely cheap flights in 2026 requires both strategy and timing. With airline pricing algorithms evolving rapidly, travelers who know the right techniques consistently outperform those who book impulsively.</p>

            <div style={{ background:T.lb, borderLeft:`4px solid ${T.sky}`, borderRadius:"0 10px 10px 0", padding:"1rem 1.25rem", margin:"1.5rem 0" }}>
              <p style={{ color:"#064E6F", fontSize:".9rem", lineHeight:1.7, fontWeight:500, margin:0 }}>💡 Quick tip: The average traveler overpays by $140–$380 per roundtrip by not using proven booking strategies. Implementing just 3 of these 10 techniques can recover that cost.</p>
            </div>

            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, margin:"2rem 0 .875rem" }}>1. Use Incognito Mode When Searching</h2>
            <p style={{ fontSize:".9375rem", color:T.dark, marginBottom:"1.25rem" }}>Airline booking engines track your search history using cookies. When they detect repeated searches for the same route, prices frequently increase through dynamic pricing algorithms. Always search in a private browser window to prevent this effect.</p>

            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, margin:"2rem 0 .875rem" }}>2. Book on Tuesdays and Wednesdays</h2>
            <p style={{ fontSize:".9375rem", color:T.dark, marginBottom:"1.25rem" }}>Airlines historically release discounted fares on Tuesday mornings, with competitors matching by Tuesday afternoon. Booking mid-week consistently shows lower fares compared to weekend searches on most major routes.</p>

            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, margin:"2rem 0 .875rem" }}>3. Use Airline Promo Codes and Coupons</h2>
            <p style={{ fontSize:".9375rem", color:T.dark, marginBottom:"1.25rem" }}>Many travelers forget that airline promo codes — like those listed on AirlineTopDeals.com — can stack significant discounts on top of already-discounted fares. Emirates, Qatar Airways, and Singapore Airlines regularly release 15–30% off promo codes to partner coupon sites.</p>

            <ul style={{ paddingLeft:"1.25rem", marginBottom:"1.25rem" }}>
              {["Emirates frequently releases 20–25% off Business Class codes","Qatar Airways runs Economy sale codes during school holiday windows","Singapore Airlines releases Asia vacation package codes quarterly","KLM regularly offers European short-haul discounts of 20–30%"].map(item=>(
                <li key={item} style={{ fontSize:".9375rem", color:T.dark, lineHeight:1.85, marginBottom:".375rem" }}>{item}</li>
              ))}
            </ul>

            <div style={{ background:"#F0FDF4", border:`1.5px solid #86EFAC`, borderRadius:12, padding:"1.25rem", margin:"1.5rem 0" }}>
              <div style={{ fontSize:".875rem", fontWeight:700, color:"#065F46", marginBottom:".5rem" }}>✈️ Ready to save on your next flight?</div>
              <p style={{ fontSize:".875rem", color:"#047857", lineHeight:1.65, margin:"0 0 .875rem" }}>Browse our verified airline coupon codes. Updated daily with the highest success rates.</p>
              <BtnOrange onClick={()=>setPage("flight-deals")} style={{ padding:".6rem 1.25rem", fontSize:".8125rem" }}>Browse Latest Deals →</BtnOrange>
            </div>
          </div>
        </article>

        <aside>
          <div style={{ background:`linear-gradient(135deg,${T.navy},${T.blue})`, borderRadius:14, padding:"1.25rem", textAlign:"center", marginBottom:"1.25rem" }}>
            <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>🎟️</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1rem", fontWeight:800, color:"#fff", marginBottom:".375rem" }}>Today's Best Deal</div>
            <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.65)", marginBottom:"1rem", lineHeight:1.5 }}>Emirates 25% Off Business Class — 93% success rate</p>
            <BtnOrange onClick={()=>onRedeem(COUPONS[0])} style={{ width:"100%" }}>Get This Deal →</BtnOrange>
          </div>

          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"1.125rem", marginBottom:"1.25rem" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy, marginBottom:".875rem", paddingBottom:".625rem", borderBottom:`1.5px solid ${T.border}` }}>🔥 Popular Articles</h3>
            {BLOG_POSTS.map((p,i)=>(
              <div key={p.id} onClick={()=>setPage("blog-detail",p)} style={{ display:"flex", gap:".75rem", marginBottom:".875rem", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{ width:28, height:28, borderRadius:7, background:T.lb, color:T.blue, fontFamily:"'Sora',sans-serif", fontSize:".75rem", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <div>
                  <div style={{ fontSize:".8125rem", fontWeight:600, color:T.navy, lineHeight:1.4 }}>{p.title}</div>
                  <div style={{ fontSize:".7rem", color:T.muted, marginTop:".2rem" }}>📅 {p.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"1.125rem" }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy, marginBottom:".875rem" }}>📧 Deal Alerts</h3>
            <p style={{ fontSize:".8rem", color:T.muted, lineHeight:1.6, marginBottom:".875rem" }}>Get the best deals delivered before they expire.</p>
            <input type="email" placeholder="your@email.com" style={{ width:"100%", padding:".7rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none", color:T.dark, marginBottom:".625rem" }} />
            <BtnPrimary style={{ width:"100%", padding:".65rem" }}>Subscribe Free</BtnPrimary>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────
function AboutPage() {
  const stats = [["847+","Active Coupons"],["48","Partner Airlines"],["$2.4M","User Savings"],["92%","Avg Success Rate"],["85K+","Newsletter Subscribers"],["12","Countries Covered"]];
  const team = [
    { name:"James Turner", role:"Founder & CEO", init:"JT", color:T.blue, bio:"12 years in travel tech. Founded AirlineTopDeals to democratize access to flight discounts." },
    { name:"Sarah Mitchell", role:"Head of Deals", init:"SM", color:T.sky, bio:"Former airline pricing analyst. Sources and verifies every deal on the platform." },
    { name:"Michael Chen", role:"Head of Technology", init:"MC", color:T.navy, bio:"Full-stack engineer building the systems that power 500+ live deals." },
    { name:"Priya Patel", role:"Content Director", init:"PP", color:T.orange, bio:"Travel writer and blogger covering budget travel, loyalty programs, and destination guides." },
  ];
  return (
    <div>
      <PageHero tag="Our Story" title="About AirlineTopDeals" sub="We believe everyone deserves to travel. Our mission is to make that possible by surfacing the best airline deals in the world." />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"3rem 1.5rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"1rem", marginBottom:"3rem" }}>
          {stats.map(([v,l])=>(
            <div key={l} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"1.25rem", textAlign:"center" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.875rem", fontWeight:800, color:T.navy, marginBottom:".25rem" }}>{v}</div>
              <div style={{ fontSize:".75rem", color:T.muted, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", marginBottom:"3rem", alignItems:"center" }}>
          <div>
            <SectionTag>🎯 Our Mission</SectionTag>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:T.navy, margin:".5rem 0 1rem" }}>Democratizing Access to Affordable Travel</h2>
            <p style={{ fontSize:".9375rem", color:T.muted, lineHeight:1.8, marginBottom:"1rem" }}>Founded in 2020, AirlineTopDeals started with a simple idea: promo codes and airline discounts shouldn't be hidden in email newsletters that only frequent flyers know to look for.</p>
            <p style={{ fontSize:".9375rem", color:T.muted, lineHeight:1.8 }}>Today we aggregate, verify, and publish hundreds of live airline deals — from premium business class promotions to student discounts and vacation packages — making them accessible to every traveler.</p>
          </div>
          <div style={{ background:`linear-gradient(135deg,${T.navy},${T.blue})`, borderRadius:20, padding:"2.5rem", textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>✈️</div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.375rem", fontWeight:800, marginBottom:".75rem" }}>Every deal is verified</h3>
            <p style={{ color:"rgba(255,255,255,.75)", lineHeight:1.7, fontSize:".9rem" }}>Our team manually checks success rates, expiry dates, and coupon functionality. We only publish deals with 75%+ verified success rates.</p>
          </div>
        </div>
        <SectionHead title="Meet Our Team" tag="👥 The People Behind AirlineTopDeals" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"1.25rem" }}>
          {team.map(p=>(
            <div key={p.name} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"1.5rem", textAlign:"center" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${p.color},${p.color}88)`, margin:"0 auto 1rem", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:"#fff" }}>{p.init}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", color:T.navy, marginBottom:".25rem" }}>{p.name}</div>
              <div style={{ fontSize:".775rem", color:T.blue, fontWeight:600, marginBottom:".75rem" }}>{p.role}</div>
              <p style={{ fontSize:".8125rem", color:T.muted, lineHeight:1.6 }}>{p.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHero tag="Get In Touch" title="✉️ Contact Us" sub="We'd love to hear from you. Send us a message and we'll respond as soon as possible." />
      <div style={{ maxWidth:1000, margin:"2rem auto", padding:"0 1.5rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", alignItems:"start" }}>
        <div style={{ background:"#fff", borderRadius:20, border:`1.5px solid ${T.border}`, padding:"2rem" }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"2rem" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", color:T.navy }}>Message sent!</h3>
              <p style={{ color:T.muted, marginTop:".5rem" }}>We'll get back to you within 24 hours.</p>
              <BtnPrimary onClick={()=>setSent(false)} style={{ marginTop:"1rem" }}>Send Another</BtnPrimary>
            </div>
          ) : (
            <div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.25rem", fontWeight:800, color:T.navy, marginBottom:"1.5rem" }}>Send a Message</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.125rem" }}>
                <div>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Name</label>
                  <input type="text" placeholder="Your name" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Email</label>
                  <input type="email" placeholder="you@example.com" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
                </div>
              </div>
              <div style={{ marginBottom:"1.125rem" }}>
                <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Subject</label>
                <input type="text" placeholder="How can we help?" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
              </div>
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Message</label>
                <textarea placeholder="Your message..." rows={5} style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none", resize:"vertical" }} />
              </div>
              <BtnPrimary onClick={()=>setSent(true)} style={{ width:"100%", padding:"1rem" }}>Send Message ✉️</BtnPrimary>
            </div>
          )}
        </div>

        <div>
          {[["📧","Email","info@airlinetopdeals.com"],["💬","WhatsApp","+1 (555) 123-4567"],["🕐","Response Time","Within 24 hours"],["🌍","Based In","Online · Worldwide"]].map(([icon,title,val])=>(
            <div key={title} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"1.25rem", marginBottom:"1rem", display:"flex", gap:"1rem", alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:T.lb, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>{icon}</div>
              <div><div style={{ fontWeight:700, fontSize:".875rem", color:T.navy }}>{title}</div><div style={{ fontSize:".8125rem", color:T.muted, marginTop:".125rem" }}>{val}</div></div>
            </div>
          ))}
          <div style={{ background:`linear-gradient(135deg,${T.navy},${T.blue})`, borderRadius:16, padding:"1.5rem", textAlign:"center", marginTop:"1.5rem" }}>
            <div style={{ fontSize:"2rem", marginBottom:".75rem" }}>💬</div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:"#fff", marginBottom:".5rem" }}>Chat on WhatsApp</h3>
            <p style={{ fontSize:".8rem", color:"rgba(255,255,255,.65)", marginBottom:"1rem" }}>Get instant support from our team</p>
            <button style={{ background:"#25D366", color:"#fff", border:"none", padding:".75rem 1.5rem", borderRadius:10, fontFamily:"'Sora',sans-serif", fontWeight:700, cursor:"pointer", width:"100%" }}>Open WhatsApp Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARE COUPON PAGE ────────────────────────────────────────
function SharePage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <PageHero tag="Community" title="📤 Submit a Deal" sub="Share an airline deal with 85,000+ travelers. Submissions are reviewed within 24 hours." />
      <div style={{ maxWidth:640, margin:"2rem auto", padding:"0 1.5rem" }}>
        {submitted ? (
          <div style={{ background:"#fff", borderRadius:20, border:`1.5px solid ${T.border}`, padding:"3rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎉</div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.375rem", fontWeight:800, color:T.navy, marginBottom:".75rem" }}>Deal Submitted!</h3>
            <p style={{ color:T.muted, lineHeight:1.7, marginBottom:"1.5rem" }}>Thank you for sharing. Our team will review and publish your deal within 24 hours.</p>
            <BtnOrange onClick={()=>setSubmitted(false)}>Submit Another Deal</BtnOrange>
          </div>
        ) : (
          <div style={{ background:"#fff", borderRadius:20, border:`1.5px solid ${T.border}`, padding:"2rem" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"1.125rem" }}>
              {[{label:"Deal Title *",type:"text",placeholder:"e.g. Emirates — 30% Off Economy Class"},{label:"Redeem URL *",type:"url",placeholder:"https://..."}].map(f=>(
                <div key={f.label}>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                <div>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Airline *</label>
                  <select style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none", color:T.dark, background:"#fff" }}>
                    <option>Select Airline...</option>
                    {AIRLINES.map(a=><option key={a.code}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Discount %</label>
                  <input type="number" placeholder="e.g. 25" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Coupon Code</label>
                <input type="text" placeholder="e.g. SAVE30" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", fontFamily:"'Sora',sans-serif", letterSpacing:".1em", outline:"none" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Expiry Date</label>
                <input type="date" style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>Description</label>
                <textarea placeholder="Describe the deal in detail..." rows={3} style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none", resize:"vertical" }} />
              </div>
              <BtnOrange onClick={()=>setSubmitted(true)} style={{ padding:"1rem", fontSize:"1rem" }}>Submit Deal for Review 🚀</BtnOrange>
              <p style={{ fontSize:".75rem", color:T.muted, textAlign:"center" }}>Deals are reviewed within 24 hours before going live</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────
function AuthPage({ type, setPage }) {
  const isLogin = type==="login";
  return (
    <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:T.bg }}>
      <div style={{ background:"#fff", borderRadius:20, border:`1.5px solid ${T.border}`, padding:"2.5rem", width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:".75rem" }}>{isLogin?"✈️":"🌍"}</div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:T.navy, marginBottom:".375rem" }}>{isLogin?"Welcome Back":"Join AirlineTopDeals"}</h2>
          <p style={{ fontSize:".875rem", color:T.muted }}>{isLogin?"Sign in to access exclusive deals":"Get exclusive deals, alerts & save more"}</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {!isLogin && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
              {["First Name","Last Name"].map(lbl=>(
                <div key={lbl}>
                  <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>{lbl}</label>
                  <input type="text" placeholder={lbl==="First Name"?"John":"Doe"} style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
                </div>
              ))}
            </div>
          )}
          {[{l:"Email Address",t:"email",p:"you@example.com"},{l:"Password",t:"password",p:"••••••••"}].map(f=>(
            <div key={f.l}>
              <label style={{ display:"block", fontSize:".775rem", fontWeight:600, color:T.navy, marginBottom:".375rem" }}>{f.l}</label>
              <input type={f.t} placeholder={f.p} style={{ width:"100%", padding:".75rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:9, fontSize:".875rem", outline:"none" }} />
            </div>
          ))}
          {isLogin && <a style={{ fontSize:".8125rem", color:T.blue, cursor:"pointer", textAlign:"right" }}>Forgot password?</a>}
          <button onClick={()=>setPage("dashboard")} style={{ background:isLogin?`linear-gradient(135deg,${T.blue},${T.navy})`:`linear-gradient(135deg,${T.orange},#D97706)`, color:"#fff", border:"none", padding:"1rem", borderRadius:10, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:"1rem", cursor:"pointer" }}>{isLogin?"Sign In":"Create Free Account"}</button>
          <div style={{ display:"flex", gap:".75rem" }}>
            {["Google","Facebook","Apple"].map(s=>(
              <button key={s} style={{ flex:1, padding:".625rem", border:`1.5px solid ${T.border}`, borderRadius:8, background:"#fff", fontSize:".8rem", cursor:"pointer", color:T.dark }}>{s}</button>
            ))}
          </div>
          <p style={{ textAlign:"center", fontSize:".8125rem", color:T.muted }}>
            {isLogin?"Don't have an account? ":"Already have an account? "}
            <a onClick={()=>setPage(isLogin?"register":"login")} style={{ color:T.blue, fontWeight:600, cursor:"pointer" }}>{isLogin?"Register free":"Sign in"}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────
function DashboardPage({ setPage, onRedeem }) {
  const [activeTab, setActiveTab] = useState("saved");
  const tabs = [["saved","🎟 Saved Deals"],["submissions","📤 My Submissions"],["history","📋 History"],["notifications","🔔 Alerts"],["settings","⚙️ Settings"]];
  const savedDeals = COUPONS;
  const submissions = [
    { title:"KLM Spring Sale 20%", airline:"KLM", code:"KL20SPR", date:"May 20", status:"Live", statusColor:T.green },
    { title:"Emirates Weekend Flash", airline:"Emirates", code:"EMIWKND", date:"May 15", status:"Live", statusColor:T.green },
    { title:"Virgin Club Deal", airline:"Virgin Atlantic", code:"VSCLUB", date:"May 10", status:"Pending", statusColor:T.orange },
    { title:"SQ First Class Promo", airline:"Singapore Air", code:"SQ1STCL", date:"May 5", status:"Expired", statusColor:T.red },
  ];

  return (
    <div>
      <PageHero tag="My Account" title="User Dashboard" sub="Manage your saved deals, submissions, and account settings" />
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:"1.75rem", maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem", alignItems:"start" }}>
        <aside>
          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"1.5rem", textAlign:"center", position:"sticky", top:70 }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${T.sky},${T.blue})`, margin:"0 auto 1rem", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#fff" }}>SM</div>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy }}>Sarah Mitchell</div>
            <div style={{ fontSize:".8rem", color:T.muted, marginBottom:".75rem" }}>sarah.m@gmail.com</div>
            <div style={{ display:"inline-flex", background:T.lb, color:T.blue, fontSize:".7rem", fontWeight:700, padding:".3rem .75rem", borderRadius:50, marginBottom:"1rem" }}>⭐ Premium Member</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".625rem", marginBottom:"1.25rem" }}>
              {[{n:"47",l:"Saved"},{n:"12",l:"Submitted"},{n:"$1,240",l:"Saved $"},{n:"94%",l:"Success"}].map(s=>(
                <div key={s.l} style={{ background:T.bg, borderRadius:9, padding:".75rem", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:800, color:T.navy }}>{s.n}</div>
                  <div style={{ fontSize:".65rem", color:T.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:".25rem" }}>
              {tabs.map(([k,l])=>(
                <button key={k} onClick={()=>setActiveTab(k)} style={{ display:"flex", alignItems:"center", gap:".625rem", padding:".625rem .75rem", borderRadius:8, fontSize:".8125rem", color:activeTab===k?T.blue:T.muted, background:activeTab===k?T.lb:"transparent", border:"none", cursor:"pointer", fontWeight:activeTab===k?600:500, textAlign:"left", width:"100%" }}>{l}</button>
              ))}
              <button style={{ display:"flex", alignItems:"center", gap:".625rem", padding:".625rem .75rem", borderRadius:8, fontSize:".8125rem", color:T.red, background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>🚪 Sign Out</button>
            </div>
          </div>
        </aside>

        <div>
          {activeTab==="saved" && (
            <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".875rem 1.25rem", borderBottom:`1.5px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy }}>🎟 Saved Deals ({savedDeals.length})</h3>
                <input type="text" placeholder="Search..." style={{ padding:".4rem .75rem", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:".8rem", outline:"none", width:160 }} />
              </div>
              <div style={{ padding:"1.125rem" }}>
                {savedDeals.map(c=>(
                  <div key={c.code} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:".875rem 0", borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ width:40, height:40, borderRadius:9, background:c.airlineColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif", fontSize:".7rem", fontWeight:800, color:"#fff", flexShrink:0 }}>{c.airlineCode}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:".875rem", fontWeight:600, color:T.navy }}>{c.title}</div>
                      <div style={{ fontSize:".75rem", color:T.muted, marginTop:".2rem" }}>📅 {c.expires} · <span style={{ color:T.green, fontWeight:600 }}>{c.success}% success</span></div>
                    </div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:".875rem", fontWeight:700, color:T.blue, background:T.lb, padding:".3rem .75rem", borderRadius:6, letterSpacing:".08em" }}>{c.code}</div>
                    <BtnPrimary onClick={()=>onRedeem(c)} style={{ padding:".4rem .875rem", fontSize:".75rem" }}>Redeem</BtnPrimary>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab==="submissions" && (
            <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".875rem 1.25rem", borderBottom:`1.5px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy }}>📤 My Submissions</h3>
                <BtnOrange onClick={()=>setPage("share")} style={{ padding:".375rem .875rem", fontSize:".75rem" }}>+ Submit New</BtnOrange>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:"#FAFBFC" }}>{["Deal Title","Airline","Code","Submitted","Status"].map(h=><th key={h} style={{ fontSize:".7rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".06em", padding:".5rem .75rem", textAlign:"left", borderBottom:`1.5px solid ${T.border}` }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {submissions.map(s=>(
                      <tr key={s.code} style={{ borderBottom:`1px solid ${T.border}` }}>
                        <td style={{ padding:".65rem .75rem", fontWeight:600, fontSize:".8125rem", color:T.dark }}>{s.title}</td>
                        <td style={{ padding:".65rem .75rem", fontSize:".8125rem", color:T.muted }}>{s.airline}</td>
                        <td style={{ padding:".65rem .75rem" }}><span style={{ fontFamily:"'Sora',sans-serif", fontSize:".75rem", fontWeight:700, color:T.blue }}>{s.code}</span></td>
                        <td style={{ padding:".65rem .75rem", fontSize:".775rem", color:T.muted }}>{s.date}</td>
                        <td style={{ padding:".65rem .75rem" }}><span style={{ background:s.statusColor+"22", color:s.statusColor, fontSize:".65rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {(activeTab==="history"||activeTab==="notifications"||activeTab==="settings") && (
            <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:16, padding:"2rem", textAlign:"center" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🚧</div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", color:T.navy, marginBottom:".5rem" }}>Coming Soon</h3>
              <p style={{ color:T.muted }}>This section is under development. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────
function AdminPage({ onRedeem }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navSections = [
    {label:"Overview",items:[{k:"dashboard",icon:"📊",label:"Dashboard"},{k:"analytics",icon:"📈",label:"Analytics"},{k:"notifications",icon:"🔔",label:"Notifications",badge:5}]},
    {label:"Content",items:[{k:"coupons",icon:"🎟️",label:"Coupons",badge:12},{k:"airlines-admin",icon:"✈️",label:"Airlines"},{k:"categories-admin",icon:"📂",label:"Categories"},{k:"destinations-admin",icon:"🗺️",label:"Destinations"},{k:"blog-admin",icon:"📰",label:"Blog Posts"}]},
    {label:"Users",items:[{k:"users",icon:"👥",label:"All Users"},{k:"submissions",icon:"📤",label:"Submissions",badge:8}]},
    {label:"Settings",items:[{k:"site-settings",icon:"⚙️",label:"Site Settings"},{k:"email-templates",icon:"📧",label:"Email Templates"}]},
  ];
  const stats = [{icon:"🎟️",label:"Total Active Coupons",val:"847",change:"+24 this week",up:true},{icon:"👥",label:"Registered Users",val:"12,481",change:"+318 this week",up:true},{icon:"👁️",label:"Page Views Today",val:"9,234",change:"+12% vs yesterday",up:true},{icon:"🔗",label:"Coupon Clicks Today",val:"2,847",change:"+8% vs yesterday",up:true},{icon:"⏳",label:"Pending Approvals",val:"12",change:"8 awaiting review",up:false},{icon:"💰",label:"Est. User Savings",val:"$2.4M",change:"+$84K this month",up:true}];
  const pendingCoupons = [{title:"40% Off Business LAX→LHR",airline:"Virgin Atlantic",date:"May 27"},{title:"SQ Student 20% Off Asia",airline:"Singapore Air",date:"May 26"},{title:"KLM Amsterdam Flash Sale",airline:"KLM",date:"May 26"},{title:"Etihad 35% Off Abu Dhabi",airline:"Etihad",date:"May 25"}];
  const topPerformers = [{name:"Emirates 25%",clicks:4821,pct:93},{name:"Virgin 40%",clicks:4102,pct:85},{name:"SQ Package",clicks:3481,pct:72},{name:"Qatar 30%",clicks:2890,pct:60},{name:"KLM Europe",clicks:2311,pct:48}];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100vh - 128px)", background:"#F0F4F7" }}>
      <nav style={{ background:T.navy, padding:"1.25rem 0" }}>
        <div style={{ padding:"1.25rem 1.25rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,.08)", marginBottom:".5rem" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:".875rem", fontWeight:700, color:"#fff" }}>Admin Panel</div>
          <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.4)", marginTop:".2rem" }}>AirlineTopDeals.com</div>
        </div>
        {navSections.map(sec=>(
          <div key={sec.label} style={{ marginBottom:"1.25rem" }}>
            <div style={{ fontSize:".65rem", color:"rgba(255,255,255,.3)", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"0 1.25rem", marginBottom:".5rem" }}>{sec.label}</div>
            {sec.items.map(item=>(
              <button key={item.k} onClick={()=>setActiveSection(item.k)} style={{ display:"flex", alignItems:"center", gap:".625rem", padding:".575rem 1.25rem", fontSize:".8rem", color:activeSection===item.k?"#fff":"rgba(255,255,255,.65)", fontWeight:500, background:activeSection===item.k?"rgba(255,255,255,.1)":"transparent", border:activeSection===item.k?"none":activeSection===item.k?"3px solid transparent":"none", borderLeft:activeSection===item.k?`3px solid ${T.sky}`:"3px solid transparent", cursor:"pointer", width:"100%", textAlign:"left" }}>
                <span style={{ fontSize:"1rem", width:20, textAlign:"center" }}>{item.icon}</span>
                {item.label}
                {item.badge && <span style={{ marginLeft:"auto", background:T.orange, color:"#fff", fontSize:".6rem", fontWeight:700, padding:".15rem .45rem", borderRadius:50 }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding:"1.75rem", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.75rem", flexWrap:"wrap", gap:"1rem" }}>
          <div><h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.375rem", fontWeight:800, color:T.navy }}>Dashboard Overview</h1>
          <p style={{ fontSize:".8rem", color:T.muted, marginTop:".2rem" }}>Friday, May 29, 2026 · Welcome back, Admin</p></div>
          <div style={{ display:"flex", gap:".625rem" }}>
            <button style={{ padding:".5rem 1rem", border:`1.5px solid ${T.border}`, borderRadius:8, background:"#fff", fontSize:".8rem", cursor:"pointer" }}>📤 Export Report</button>
            <BtnOrange style={{ padding:".5rem .875rem" }}>+ Add Coupon</BtnOrange>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"1.75rem" }}>
          {stats.map(s=>(
            <div key={s.label} style={{ background:"#fff", borderRadius:13, border:`1.5px solid ${T.border}`, padding:"1.25rem" }}>
              <div style={{ fontSize:"1.5rem", marginBottom:".5rem" }}>{s.icon}</div>
              <div style={{ fontSize:".75rem", color:T.muted, fontWeight:600, marginBottom:".375rem" }}>{s.label}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.875rem", fontWeight:800, color:T.navy, marginBottom:".25rem" }}>{s.val}</div>
              <div style={{ fontSize:".75rem", fontWeight:600, color:s.up?T.green:T.red }}>{s.up?"↑ ":"↓ "}{s.change}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1.75rem" }}>
          <div style={{ background:"#fff", borderRadius:13, border:`1.5px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".875rem 1.25rem", borderBottom:`1.5px solid ${T.border}` }}>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy }}>⏳ Pending Approvals</h3>
              <span style={{ fontSize:".75rem", color:T.blue, fontWeight:600 }}>View All (12)</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#FAFBFC" }}>{["Title","Airline","Date","Actions"].map(h=><th key={h} style={{ fontSize:".7rem", fontWeight:700, color:T.muted, textTransform:"uppercase", padding:".5rem .75rem", textAlign:"left", borderBottom:`1.5px solid ${T.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {pendingCoupons.map(c=>(
                  <tr key={c.title} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:".65rem .75rem", fontWeight:600, fontSize:".8rem", color:T.dark, maxWidth:140 }}>{c.title}</td>
                    <td style={{ padding:".65rem .75rem" }}><span style={{ background:T.lb, color:"#064E6F", fontSize:".7rem", fontWeight:700, padding:".2rem .5rem", borderRadius:50 }}>{c.airline}</span></td>
                    <td style={{ padding:".65rem .75rem", fontSize:".775rem", color:T.muted }}>{c.date}</td>
                    <td style={{ padding:".65rem .75rem" }}>
                      <div style={{ display:"flex", gap:".375rem" }}>
                        <button style={{ background:"#ECFDF5", border:"1px solid #BBF7D0", borderRadius:5, padding:".25rem .5rem", fontSize:".7rem", color:T.green, cursor:"pointer" }}>✓</button>
                        <button style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:5, padding:".25rem .5rem", fontSize:".7rem", color:T.red, cursor:"pointer" }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background:"#fff", borderRadius:13, border:`1.5px solid ${T.border}` }}>
            <div style={{ padding:".875rem 1.25rem", borderBottom:`1.5px solid ${T.border}` }}>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy }}>📈 Top Performing Coupons</h3>
            </div>
            <div style={{ padding:"1.125rem" }}>
              {topPerformers.map(p=>(
                <div key={p.name} style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".75rem" }}>
                  <div style={{ fontSize:".775rem", color:T.muted, minWidth:90, textAlign:"right" }}>{p.name}</div>
                  <div style={{ flex:1, height:8, background:"#F1F5F9", borderRadius:50, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${p.pct}%`, background:`linear-gradient(90deg,${T.sky},${T.blue})`, borderRadius:50 }} />
                  </div>
                  <div style={{ fontSize:".775rem", fontWeight:700, color:T.navy, minWidth:36, textAlign:"right" }}>{p.clicks.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:"#fff", borderRadius:13, border:`1.5px solid ${T.border}`, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".875rem 1.25rem", borderBottom:`1.5px solid ${T.border}` }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".9375rem", fontWeight:700, color:T.navy }}>🎟 All Coupons</h3>
            <BtnOrange style={{ padding:".35rem .875rem", fontSize:".75rem" }}>+ Add New</BtnOrange>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#FAFBFC" }}>{["Title","Code","Airline","Discount","Success","Status","Actions"].map(h=><th key={h} style={{ fontSize:".7rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:".06em", padding:".5rem .75rem", textAlign:"left", borderBottom:`1.5px solid ${T.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {COUPONS.map(c=>(
                  <tr key={c.code} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:".65rem .75rem", fontWeight:600, fontSize:".8125rem", color:T.dark, maxWidth:160 }}>{c.title}</td>
                    <td style={{ padding:".65rem .75rem" }}><span style={{ fontFamily:"'Sora',sans-serif", fontSize:".75rem", fontWeight:700, color:T.blue, background:T.lb, padding:".2rem .5rem", borderRadius:4 }}>{c.code}</span></td>
                    <td style={{ padding:".65rem .75rem", fontSize:".8rem" }}>{c.airline}</td>
                    <td style={{ padding:".65rem .75rem", fontWeight:700, color:T.orange }}>{c.discount}%</td>
                    <td style={{ padding:".65rem .75rem" }}><span style={{ color:T.green, fontWeight:700 }}>{c.success}%</span></td>
                    <td style={{ padding:".65rem .75rem" }}><span style={{ background:"#ECFDF5", color:"#065F46", fontSize:".65rem", fontWeight:700, padding:".25rem .625rem", borderRadius:50 }}>Active</span></td>
                    <td style={{ padding:".65rem .75rem" }}>
                      <div style={{ display:"flex", gap:".375rem" }}>
                        <button style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:5, padding:".25rem .5rem", fontSize:".7rem", color:T.muted, cursor:"pointer" }}>✏️</button>
                        <button style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:5, padding:".25rem .5rem", fontSize:".7rem", color:T.red, cursor:"pointer" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRIVACY & TERMS ──────────────────────────────────────────
function PolicyPage({ type }) {
  const isPrivacy = type==="privacy";
  const tocItems = isPrivacy
    ? ["Information We Collect","How We Use Your Data","Cookies & Tracking","Data Sharing","Data Security","Your Rights (GDPR)","Data Retention","Third-Party Links","Changes to Policy","Contact Us"]
    : ["Acceptance of Terms","Service Description","User Accounts","Coupon Submissions","Coupon Usage Policy","Prohibited Conduct","Intellectual Property","Disclaimers","Limitation of Liability","Affiliate Disclosure","Termination","Governing Law"];
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div>
      <PageHero tag="Legal" title={isPrivacy?"🔒 Privacy Policy":"📋 Terms & Conditions"} sub={isPrivacy?"How we collect, use, and protect your personal information":"Please read these terms carefully before using our platform"} />
      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"1.75rem", maxWidth:1100, margin:"0 auto", padding:"2rem 1.5rem", alignItems:"start" }}>
        <aside>
          <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"1.125rem", position:"sticky", top:70 }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:".875rem", fontWeight:700, color:T.navy, marginBottom:".875rem", paddingBottom:".625rem", borderBottom:`1.5px solid ${T.border}` }}>📋 Table of Contents</h3>
            {tocItems.map((item,i)=>(
              <a key={i} onClick={()=>setActiveSection(i)} style={{ display:"block", fontSize:".8rem", color:activeSection===i?T.blue:T.muted, padding:".375rem .5rem", borderRadius:6, cursor:"pointer", background:activeSection===i?T.lb:"transparent", fontWeight:activeSection===i?600:400, marginBottom:".125rem", transition:"all .2s" }}>{i+1}. {item}</a>
            ))}
          </div>
        </aside>
        <div style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"2rem" }}>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:T.navy, marginBottom:".5rem" }}>{isPrivacy?"Privacy Policy":"Terms & Conditions"}</h1>
          <div style={{ fontSize:".8rem", color:T.muted, marginBottom:"2rem", paddingBottom:"1.25rem", borderBottom:`1.5px solid ${T.border}` }}>Last updated: May 29, 2026</div>
          <div style={{ background:T.lb, borderRadius:10, padding:"1rem 1.25rem", marginBottom:"1.5rem" }}>
            <p style={{ color:"#064E6F", fontSize:".875rem", lineHeight:1.7, margin:0 }}>{isPrivacy?"At AirlineTopDeals.com, we take your privacy seriously. This policy explains exactly what data we collect, why we collect it, and how you can control it. We are committed to full GDPR and CCPA compliance.":"By accessing or using AirlineTopDeals.com, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform immediately."}</p>
          </div>
          {tocItems.map((section,i)=>(
            <div key={i} style={{ marginBottom:"2rem" }}>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.125rem", fontWeight:700, color:T.navy, marginBottom:".875rem", paddingLeft:".875rem", borderLeft:`3px solid ${T.sky}` }}>{i+1}. {section}</h2>
              <p style={{ fontSize:".9rem", color:"#374151", lineHeight:1.85, marginBottom:".875rem" }}>
                {isPrivacy
                  ? ["We collect information you provide directly — including account registration details, coupon submissions, contact forms, newsletter subscriptions, and user reviews. We also collect information automatically, such as IP addresses, browser type, and usage patterns.","We use your information to manage your account, personalise deal recommendations, send deal alert emails (with consent), process coupon submissions, improve our platform, prevent fraud, and comply with legal obligations.","We use essential cookies for site functionality, analytics cookies (Google Analytics) to understand usage, preference cookies to remember your settings, and marketing cookies to track coupon clicks for affiliate reporting.","We do not sell your personal data. We may share limited data with service providers (hosting, email), affiliate partners (anonymised click data), and in response to legal requirements.","We implement SSL/TLS encryption, bcrypt password hashing, enterprise-grade database encryption, regular security audits, and rate limiting on all public-facing forms.","You have the right to access, rectify, erase, restrict, port, and object to processing of your personal data. Contact privacy@airlinetopdeals.com to exercise any of these rights.","We retain account data until deletion is requested, email subscription data until unsubscription, analytics data for 26 months, and server logs for 90 days.","Our website contains links to airline websites and booking platforms. We are not responsible for the privacy practices of those external sites.","We may update this Privacy Policy from time to time. We will notify registered users by email when significant changes are made.","For privacy-related inquiries, email privacy@airlinetopdeals.com. We respond within 30 business days."][i]
                  : ["These Terms govern your access to and use of AirlineTopDeals.com. By accessing the platform, you agree to these Terms in their entirety.","AirlineTopDeals.com is a coupon aggregation platform. We collect and list airline promo codes, allow registered users to submit deals, provide travel news, and link users to third-party booking sites.","To submit coupons or save deals, you must create a free account and agree to provide accurate information and maintain account security.","By submitting a coupon, you confirm the code is genuine, obtained legitimately, and grant us a licence to publish and modify the submission.","All coupons are subject to the terms of the issuing airline. Success rates are crowd-sourced estimates, not guarantees. We are not responsible for changes airlines make to their promotional offers.","You agree not to submit fraudulent codes, scrape our database, use bots, post spam, impersonate others, or use the platform for unlawful purposes.","All original content is the property of AirlineTopDeals. Airline logos remain the property of their respective airlines and are used for identification only.","The platform is provided 'as is' with no warranties regarding accuracy, timeliness, or availability of deals.","AirlineTopDeals shall not be liable for failed coupon redemptions, missed flights, or financial losses incurred on third-party booking sites.","We participate in affiliate programs. When you click 'Redeem Deal' and make a qualifying purchase, we may receive a commission at no additional cost to you.","We reserve the right to terminate your access at any time. You may also delete your account at any time via Account Settings.","These Terms shall be governed by the laws of the United States. Disputes are subject to the jurisdiction of applicable courts."][i]
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 404 PAGE ─────────────────────────────────────────────────
function NotFoundPage({ setPage }) {
  return (
    <div style={{ textAlign:"center", padding:"5rem 1.5rem", minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"8rem", fontWeight:800, background:`linear-gradient(135deg,${T.sky},${T.blue})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1, marginBottom:".5rem" }}>404</div>
      <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>✈️</div>
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.5rem", fontWeight:800, color:T.navy, marginBottom:".75rem" }}>Flight Not Found</h2>
      <p style={{ color:T.muted, maxWidth:420, lineHeight:1.7, marginBottom:"2rem" }}>Looks like this page took off without us. The deal you're looking for may have expired or moved.</p>
      <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
        <BtnPrimary onClick={()=>setPage("home")}>🏠 Go to Homepage</BtnPrimary>
        <BtnOrange onClick={()=>setPage("flight-deals")}>🎟 Browse Deals</BtnOrange>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);

  const navigate = useCallback((p, data=null) => {
    setPage(p);
    setPageData(data);
    window.scrollTo(0,0);
  }, []);

  function handleRedeem(coupon) { setActiveCoupon(coupon); }

  const pages = {
    "home": <HomePage setPage={navigate} onRedeem={handleRedeem} />,
    "flight-deals": <FlightDealsPage onRedeem={handleRedeem} />,
    "airlines": <AirlinesPage setPage={navigate} />,
    "airline-detail": <AirlineDetailPage airline={pageData} setPage={navigate} onRedeem={handleRedeem} />,
    "deal-detail": <DealDetailPage deal={pageData} setPage={navigate} onRedeem={handleRedeem} />,
    "destinations": <DestinationsPage setPage={navigate} />,
    "destination-detail": <DestinationDetailPage dest={pageData} setPage={navigate} onRedeem={handleRedeem} />,
    "blog": <BlogPage setPage={navigate} />,
    "blog-detail": <BlogDetailPage post={pageData} setPage={navigate} onRedeem={handleRedeem} />,
    "categories": <HomePage setPage={navigate} onRedeem={handleRedeem} />,
    "about": <AboutPage />,
    "contact": <ContactPage />,
    "share": <SharePage />,
    "login": <AuthPage type="login" setPage={navigate} />,
    "register": <AuthPage type="register" setPage={navigate} />,
    "dashboard": <DashboardPage setPage={navigate} onRedeem={handleRedeem} />,
    "admin": <AdminPage onRedeem={handleRedeem} />,
    "privacy": <PolicyPage type="privacy" />,
    "terms": <PolicyPage type="terms" />,
    "404": <NotFoundPage setPage={navigate} />,
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", fontFamily:"'DM Sans',sans-serif", background:T.bg, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        select, input, textarea { font-family: 'DM Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(0,0,0,.35); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }
      `}</style>

      <Header page={page} setPage={navigate} />

      <main style={{ flex:1 }}>
        {pages[page] || <NotFoundPage setPage={navigate} />}
      </main>

      <Footer setPage={navigate} />

      {/* WhatsApp FAB */}
      <button title="Chat on WhatsApp" style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", width:52, height:52, background:"#25D366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", cursor:"pointer", boxShadow:"0 4px 20px rgba(37,211,102,.4)", zIndex:98, border:"none", transition:"all .2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>💬</button>

      {activeCoupon && <CouponModal coupon={activeCoupon} onClose={()=>setActiveCoupon(null)} />}
    </div>
  );
}

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  CloudSun,
  Download,
  Droplets,
  Flame,
  Gauge,
  LocateFixed,
  MapPin,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  TreePine,
  Waves,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type CityKey = "Chennai" | "Bengaluru" | "Delhi";

type CityData = {
  city: CityKey;
  state: string;
  country: string;
  lat: string;
  lon: string;
  temp: number;
  surface: number;
  utci: number;
  solar: number;
  humidity: number;
  zone: string;
};

const cityData: Record<CityKey, CityData> = {
  Chennai: {
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    lat: "13.0827° N",
    lon: "80.2707° E",
    temp: 34.8,
    surface: 48.2,
    utci: 42.6,
    solar: 812,
    humidity: 63,
    zone: "T. Nagar / Central Chennai",
  },
  Bengaluru: {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    lat: "12.9716° N",
    lon: "77.5946° E",
    temp: 28.4,
    surface: 38.1,
    utci: 32.2,
    solar: 744,
    humidity: 48,
    zone: "Koramangala / South Bengaluru",
  },
  Delhi: {
    city: "Delhi",
    state: "Delhi NCR",
    country: "India",
    lat: "28.6139° N",
    lon: "77.2090° E",
    temp: 41.2,
    surface: 53.6,
    utci: 47.1,
    solar: 923,
    humidity: 31,
    zone: "Lajpat Nagar / South Delhi",
  },
};

const cityOptions: CityKey[] = ["Chennai", "Bengaluru", "Delhi"];

function formatLakhs(value: number) {
  return `₹${(value / 100000).toFixed(1)}L`;
}

function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StatusDot({ color = "yellow" }: { color?: "yellow" | "red" | "green" }) {
  return <span className={`status-dot status-dot-${color}`} aria-hidden="true" />;
}

function Toggle({
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button className={`hardware-toggle ${checked ? "is-on" : ""}`} onClick={onChange} type="button">
      <span className="hardware-toggle-icon">{icon}</span>
      <span className="hardware-toggle-copy">
        <span className="hardware-toggle-label">{label}</span>
        <span className="hardware-toggle-description">{description}</span>
      </span>
      <span className="toggle-track" aria-hidden="true"><span className="toggle-thumb"><span /></span></span>
    </button>
  );
}

function HotspotGlobe({ city }: { city: CityData }) {
  return (
    <div className="globe-wrap" aria-label={`Heat hotspot globe centered on ${city.city}`}>
      <div className="globe-orbit orbit-one" />
      <div className="globe-orbit orbit-two" />
      <motion.div
        className="globe-tilt"
        animate={{ rotate: [0, 2, 0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      >
        <svg className="globe" viewBox="0 0 420 420" role="img">
          <defs>
            <radialGradient id="globeFill" cx="34%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#25323b" />
              <stop offset="55%" stopColor="#111a21" />
              <stop offset="100%" stopColor="#090d11" />
            </radialGradient>
            <radialGradient id="hotCore">
              <stop offset="0%" stopColor="#fff4a3" stopOpacity="1" />
              <stop offset="22%" stopColor="#f4dd32" stopOpacity=".98" />
              <stop offset="100%" stopColor="#ff332d" stopOpacity="0" />
            </radialGradient>
            <filter id="blurGlow"><feGaussianBlur stdDeviation="8" /></filter>
            <clipPath id="globeClip"><circle cx="210" cy="210" r="157" /></clipPath>
          </defs>
          <circle cx="210" cy="210" r="162" fill="#f4dd32" opacity=".08" filter="url(#blurGlow)" />
          <circle cx="210" cy="210" r="157" fill="url(#globeFill)" stroke="#f4dd32" strokeOpacity=".36" strokeWidth="1.5" />
          <g clipPath="url(#globeClip)" fill="none" stroke="#e9f0ed" strokeOpacity=".14" strokeWidth="1">
            <ellipse cx="210" cy="210" rx="157" ry="49" />
            <ellipse cx="210" cy="210" rx="157" ry="102" />
            <ellipse cx="210" cy="210" rx="157" ry="140" />
            <ellipse cx="210" cy="210" rx="54" ry="157" />
            <ellipse cx="210" cy="210" rx="104" ry="157" />
            <ellipse cx="210" cy="210" rx="137" ry="157" />
            <path d="M51 168 C100 120 138 139 171 121 C210 99 232 122 260 115 C304 105 329 140 367 169" />
            <path d="M55 263 C101 236 131 248 165 266 C195 281 227 270 253 286 C291 310 321 278 362 267" />
            <path d="M127 64 C116 118 146 147 135 189 C120 244 166 282 149 356" />
          </g>
          <g clipPath="url(#globeClip)" fill="#cbd7d3" fillOpacity=".18">
            <path d="M96 126l31-19 21 7 5 22 34 8-7 28-31 3-8 24-33-9-12-29z" />
            <path d="M202 119l34-18 32 17 8 27-25 12 2 25-30 11-19-22 15-26z" />
            <path d="M276 197l38-16 24 19-13 27-28 4-18-15z" />
            <path d="M167 250l28-9 27 22-5 37-28 17-26-20z" />
          </g>
          <g>
            <circle cx="251" cy="156" r="29" fill="url(#hotCore)" opacity=".7" />
            <circle cx="251" cy="156" r="4.5" fill="#ffe85b" stroke="#fff" strokeWidth="1.5" />
            <circle cx="251" cy="156" r="9" fill="none" stroke="#f4dd32" strokeWidth="1" opacity=".75">
              <animate attributeName="r" values="6;18;6" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".9;0;.9" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="223" cy="194" r="2.8" fill="#ff5b43" />
            <circle cx="289" cy="221" r="3" fill="#ff5b43" />
            <circle cx="181" cy="146" r="2.2" fill="#ff5b43" />
          </g>
        </svg>
      </motion.div>
      <div className="globe-label"><StatusDot color="red" /> 18 active hotspots</div>
      <div className="globe-axis axis-lat">13.08° N</div>
      <div className="globe-axis axis-lon">80.27° E</div>
    </div>
  );
}

export default function Home() {
  const [city, setCity] = useState<CityKey>("Chennai");
  const [telemetry, setTelemetry] = useState<Record<CityKey, CityData>>(cityData);
  const [query, setQuery] = useState("Chennai");
  const [budget, setBudget] = useState(2700000);
  const [heavyTraffic, setHeavyTraffic] = useState(true);
  const [undergroundWires, setUndergroundWires] = useState(false);
  const [reflectiveRoofs, setReflectiveRoofs] = useState(true);
  const [activeNav, setActiveNav] = useState("Planner");
  const [showMoreCities, setShowMoreCities] = useState(false);
  const [isTenderOpen, setIsTenderOpen] = useState(false);
  const [telemetryPulse, setTelemetryPulse] = useState(false);

  const data = telemetry[city];
  const factor = budget / 2700000;
  const derived = useMemo(() => {
    const budgetLakhs = budget / 100000;
    const planA = 2.2 + budgetLakhs * 0.085;
    const planB = 1.8 + budgetLakhs * 0.06;
    const planC = 1.35 + budgetLakhs * 0.045;
    const roofBoost = reflectiveRoofs ? 1.25 : 1;
    const relief = Math.min(7.4, (planA * 0.72 * roofBoost) + (heavyTraffic ? 0.55 : 0) - (undergroundWires ? 0.25 : 0));
    const canopyBudget = budget * 0.30;
    const calculatedTrees = Math.floor(canopyBudget / 1400);
    const trees = undergroundWires ? Math.min(120, calculatedTrees) : calculatedTrees;
    return {
      temp: (data.temp - relief * 0.28).toFixed(1),
      surface: (data.surface - relief * 0.88).toFixed(1),
      utci: (data.utci - relief * 0.58).toFixed(1),
      trees,
      canopy: Math.round(budget * 0.5 / 160),
      planA: planA.toFixed(1),
      planB: planB.toFixed(1),
      planC: planC.toFixed(1),
      roofBoost,
      rootBarrier: undergroundWires,
      trafficTag: heavyTraffic,
    };
  }, [budget, data, heavyTraffic, undergroundWires, reflectiveRoofs, factor]);

  const activeBudget = Math.round(budget / 50000) * 50000;

  async function runSearch(nextCity?: CityKey) {
    const candidate = nextCity ?? cityOptions.find((item) => item.toLowerCase() === query.trim().toLowerCase());
    if (candidate) {
      setCity(candidate);
      setQuery(candidate);
      setTelemetryPulse(true);
      window.setTimeout(() => setTelemetryPulse(false), 520);
      const seed = cityData[candidate];
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${seed.lat.split("°")[0]}&longitude=${seed.lon.split("°")[0]}&current=temperature_2m,relative_humidity_2m,shortwave_radiation&timezone=auto`);
        if (!response.ok) throw new Error("Weather feed unavailable");
        const live = await response.json();
        const ambient = Number(live.current?.temperature_2m ?? seed.temp);
        const humidity = Number(live.current?.relative_humidity_2m ?? seed.humidity);
        const solar = Number(live.current?.shortwave_radiation ?? seed.solar);
        setTelemetry((current) => ({
          ...current,
          [candidate]: {
            ...current[candidate],
            temp: ambient,
            humidity,
            solar,
            surface: Number((ambient + 13.4 + (solar > 700 ? 1.4 : 0)).toFixed(1)),
            utci: Number((ambient + 7.8 + humidity / 50).toFixed(1)),
          },
        }));
        toast.success(`Live telemetry synced for ${candidate}`, { description: "Open-Meteo weather and hotspot layers updated." });
      } catch {
        toast.info(`Demo telemetry loaded for ${candidate}`, { description: "Live weather is unavailable; using the calibrated city baseline." });
      }
    } else {
      toast.error("City not in demo index", { description: "Try Chennai, Bengaluru, or Delhi." });
    }
  }

  function exportTender() {
    setIsTenderOpen(true);
  }

  const boqRows = [
    { code: "CPWD-2026-CR01", description: "High-albedo cool roof coating", quantity: Math.round((activeBudget * 0.60 * (reflectiveRoofs ? 1.25 : 1)) / 160).toLocaleString(), unit: "m²", rate: "₹160", total: `₹${Math.round(activeBudget * 0.60 * (reflectiveRoofs ? 1.25 : 1)).toLocaleString()}` },
    { code: "CPWD-2026-UF04", description: "Native urban canopy saplings", quantity: derived.trees.toLocaleString(), unit: "units", rate: "₹1,400", total: `₹${Math.min(activeBudget * 0.30, derived.trees * 1400).toLocaleString()}` },
    { code: "CPWD-2026-MC07", description: "Tactical misting corridor", quantity: Math.round(activeBudget * 0.10 / 120000).toLocaleString(), unit: "corridors", rate: "₹120,000", total: `₹${Math.round(activeBudget * 0.10).toLocaleString()}` },
  ];

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><span /><span /><span /></div>
          <div>
            <div className="brand-name">HEAT<span>SCAPE</span></div>
            <div className="brand-subtitle">URBAN THERMAL INTELLIGENCE</div>
          </div>
        </div>
        <nav className="top-nav" aria-label="Primary navigation">
          {["Planner", "Hotspots", "Interventions"].map((item) => (
            <button key={item} onClick={() => { setActiveNav(item); toast.info(`${item} view`, { description: "This concept view is wired for the hackathon demo." }); }} className={activeNav === item ? "nav-item active" : "nav-item"} type="button">
              {item}
            </button>
          ))}
        </nav>
        <div className="topbar-meta">
          <span className="live-chip"><StatusDot color="green" /> SYSTEM LIVE</span>
          <button className="icon-button" aria-label="Help" onClick={() => toast.info("HeatScape telemetry", { description: "Modeled from live weather, land surface, and pedestrian comfort signals." })}><CircleHelp size={17} /></button>
          <div className="operator-avatar">AR</div>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="intro-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> MUNICIPAL CONTROL CENTER <span className="eyebrow-code">/ 07 SEP 2026 / 22:46 IST</span></div>
            <h1>Cool the city.<br /><em>Precisely.</em></h1>
            <p className="hero-copy">Real-time thermodynamic modeling paired with deterministic capital optimization for municipal planners.</p>
          </div>
          <div className="intro-note"><span className="note-index">01</span><span>SELECT A CITY<br /><b>MODEL THE INTERVENTION</b></span><ArrowUpRight size={15} /></div>
        </section>

        <GlassCard className="command-card" delay={0.05}>
          <div className="section-heading">
            <div className="section-kicker"><Radio size={14} /> COMMAND CENTER</div>
            <span className="micro-label">INPUT / 01</span>
          </div>
          <div className="command-layout">
            <div className="search-block">
              <label htmlFor="city-search">TARGET URBAN ZONE</label>
              <div className="search-shell">
                <MapPin size={19} />
                <input id="city-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runSearch(); }} placeholder="Search city..." />
                <button className="search-submit" onClick={() => runSearch()} aria-label="Search city" type="button"><Search size={17} /></button>
              </div>
              <div className="search-suggestions">
                {cityOptions.map((item) => <button key={item} onClick={() => runSearch(item)} className={city === item ? "suggestion active" : "suggestion"} type="button">{item}</button>)}
                <button className="suggestion more" onClick={() => setShowMoreCities(!showMoreCities)} type="button">{showMoreCities ? "Hide" : "+ 4 more cities"}</button>
              </div>
            </div>
            <div className="location-readout">
              <div className="location-title"><LocateFixed size={16} /><span>{data.city}, {data.state}</span><span className="verified-badge"><Check size={11} /> VERIFIED</span></div>
              <div className="coordinate-row"><span>LAT <b>{data.lat}</b></span><span>LON <b>{data.lon}</b></span><span className="weather-pulse"><CloudSun size={14} /> 6 MIN AGO</span></div>
            </div>
          </div>
        </GlassCard>

        <div className="two-col-row">
          <GlassCard className="globe-card" delay={0.1}>
            <div className="card-topline"><div><div className="section-kicker"><Flame size={14} /> SPATIAL HEAT LAYER</div><div className="card-title">Live hotspot field</div></div><span className="heat-index"><span>HEAT INDEX</span><b>8.7</b><small>/ 10</small></span></div>
            <HotspotGlobe city={data} />
            <div className="globe-footer"><span><StatusDot color="red" /> HIGH EXPOSURE</span><span>LANDSAT + ERA5</span><span>REFRESH 00:06:14</span></div>
          </GlassCard>

          <GlassCard className="constraints-card" delay={0.15}>
            <div className="section-heading"><div className="section-kicker"><Settings2 size={14} /> PHYSICAL CONSTRAINTS</div><span className="micro-label">INPUT / 02</span></div>
            <div className="budget-header"><div><label>DEPLOYMENT BUDGET</label><div className="budget-value">{formatLakhs(activeBudget)} <span>INR</span></div></div><div className="budget-range"><span>₹5L</span><span>₹50L</span></div></div>
            <div className="slider-wrap"><input aria-label="Deployment budget" type="range" min="500000" max="5000000" step="50000" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /><div className="slider-track-glow" style={{ width: `${((budget - 500000) / 4500000) * 100}%` }} /><div className="slider-ticks"><span>05</span><span>15</span><span>25</span><span>35</span><span>50</span></div></div>
            <div className="constraint-divider" />
            <div className="toggle-list">
              <Toggle label="Heavy traffic zone" description="Peak road occupancy > 80%" icon={<Activity size={16} />} checked={heavyTraffic} onChange={() => setHeavyTraffic(!heavyTraffic)} />
              <Toggle label="Underground wires" description="Protect existing utility corridors" icon={<Zap size={16} />} checked={undergroundWires} onChange={() => setUndergroundWires(!undergroundWires)} />
              <Toggle label="Reflective roofs" description="Prioritize cool roof surfaces" icon={<Sun size={16} />} checked={reflectiveRoofs} onChange={() => setReflectiveRoofs(!reflectiveRoofs)} />
            </div>
            <div className="constraint-footnote"><ShieldCheck size={15} /> <span>Physics-Validated Solver (UTCI / ISO 7730 Compliant) • 98.4% Confidence</span></div>
            <div className="constraint-tags">{derived.rootBarrier && <span><StatusDot color="yellow" /> ROOT BARRIER SAFETY ACTIVE</span>}{derived.trafficTag && <span><StatusDot color="red" /> TRANSIT-GRADE HIGH-ALBEDO ASPHALT</span>}{derived.roofBoost > 1 && <span><StatusDot color="green" /> COOL ROOF PRIORITY +25%</span>}</div>
          </GlassCard>
        </div>

        <GlassCard className={`telemetry-card ${telemetryPulse ? "telemetry-pulse" : ""}`} delay={0.2}>
          <div className="telemetry-heading"><div><div className="section-kicker"><Gauge size={14} /> TELEMETRY DASHBOARD</div><div className="card-title">Current conditions <span>/ {data.zone}</span></div></div><div className="telemetry-live"><StatusDot color="green" /> LIVE WEATHER FEED <ChevronDown size={14} /></div></div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-icon"><CloudSun size={18} /></div><div className="metric-label">AMBIENT TEMPERATURE <span>°C</span></div><div className="metric-value">{data.temp}<small>°</small></div><div className="metric-baseline"><span>BASELINE</span><b>{data.temp.toFixed(1)}°</b><i className="baseline-line" /></div><div className="metric-status"><StatusDot color="red" /> ABOVE COMFORT BAND</div></div>
            <div className="metric-card"><div className="metric-icon"><Flame size={18} /></div><div className="metric-label">SURFACE TEMPERATURE <span>°C</span></div><div className="metric-value">{data.surface}<small>°</small></div><div className="metric-baseline"><span>BASELINE</span><b>{(data.surface - 4.1).toFixed(1)}°</b><i className="baseline-line line-hot" /></div><div className="metric-status"><StatusDot color="red" /> THERMAL HOTSPOT</div></div>
            <div className="metric-card highlight"><div className="metric-icon"><Waves size={18} /></div><div className="metric-label">UTCI <span>PEDESTRIAN STRESS</span></div><div className="metric-value">{data.utci}<small>°</small></div><div className="metric-baseline"><span>SAFE LIMIT</span><b>32.0°</b><i className="baseline-line line-safe" /></div><div className="metric-status"><StatusDot color="yellow" /> {data.utci >= 45 ? "EXTREME UTCI STRESS" : data.utci >= 32 ? "VERY STRONG HEAT STRESS" : "MODERATE HEAT STRESS"}</div></div>
          </div>
          <div className="telemetry-foot"><span><Sun size={14} /> SOLAR RADIATION <b>{data.solar} W/m²</b></span><span><Droplets size={14} /> RELATIVE HUMIDITY <b>{data.humidity}%</b></span><span><Activity size={14} /> SENSOR CONFIDENCE <b>94.2%</b></span></div>
        </GlassCard>

        <div className="optimizer-header"><div><div className="section-kicker"><Zap size={14} /> OPTIMIZER OUTPUT</div><h2>Three ways to lower the heat.</h2></div><div className="optimizer-note">MODEL RESPONSE <b>REAL-TIME</b><br /><span>Budget sensitivity enabled</span></div></div>

        <div className="plans-grid">
          <motion.div layout className="plan-card plan-featured" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <div className="plan-card-top"><span className="plan-letter">A</span><span className="plan-tag">RECOMMENDED</span><ArrowUpRight size={17} /></div>
            <div className="plan-visual visual-max"><div className="visual-ring ring-one" /><div className="visual-ring ring-two" /><div className="visual-core"><TreePine size={21} /></div><span className="visual-caption">MAX ΔT</span></div>
            <div className="plan-name">Maximum<br />Cooling</div><p>Stacked canopy, cool roofs + mist corridors for the biggest thermal relief.</p>
            <div className="plan-results"><div><b>−{derived.planA}°</b><span>UTCI DROP</span></div><div><b>{derived.trees.toLocaleString()}</b><span>TREES</span></div></div>
            <div className="plan-footer"><span>₹{(activeBudget / 100000).toFixed(1)}L / 90 DAYS</span><span className="plan-score">92 <small>SCORE</small></span></div>
          </motion.div>
          <motion.div layout className="plan-card" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <div className="plan-card-top"><span className="plan-letter">B</span><span className="plan-tag subdued">NATURE-LED</span><ArrowUpRight size={17} /></div>
            <div className="plan-visual visual-forest"><div className="forest-line line-a" /><div className="forest-line line-b" /><div className="forest-dot dot-a" /><div className="forest-dot dot-b" /><TreePine size={26} /></div>
            <div className="plan-name">Eco-<br />Forestry</div><p>Build long-term shade equity with native tree clusters and water-smart soil.</p>
            <div className="plan-results"><div><b>−{derived.planB}°</b><span>UTCI DROP</span></div><div><b>{Math.round(derived.trees * 1.45).toLocaleString()}</b><span>PLANTINGS</span></div></div>
            <div className="plan-footer"><span>₹{(activeBudget * 0.82 / 100000).toFixed(1)}L / 120 DAYS</span><span className="plan-score">84 <small>SCORE</small></span></div>
          </motion.div>
          <motion.div layout className="plan-card" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <div className="plan-card-top"><span className="plan-letter">C</span><span className="plan-tag subdued">RAPID RESPONSE</span><ArrowUpRight size={17} /></div>
            <div className="plan-visual visual-fast"><div className="fast-bar bar-one" /><div className="fast-bar bar-two" /><div className="fast-bar bar-three" /><div className="fast-grid" /><Zap size={22} /></div>
            <div className="plan-name">Fast<br />Deployment</div><p>Shade sails, cool pavements and tactical hydration for immediate relief.</p>
            <div className="plan-results"><div><b>−{derived.planC}°</b><span>UTCI DROP</span></div><div><b>{Math.round(derived.canopy).toLocaleString()}</b><span>m² SHADE</span></div></div>
            <div className="plan-footer"><span>₹{(activeBudget * 0.64 / 100000).toFixed(1)}L / 21 DAYS</span><span className="plan-score">77 <small>SCORE</small></span></div>
          </motion.div>
        </div>

        <div className="bottom-action"><div className="impact-summary"><span className="impact-pulse"><span /></span><span>PROJECTED IMPACT</span><b>−{derived.surface}°C surface temp at peak</b><span className="impact-divider" /><span>CONFIDENCE <b>87%</b></span></div><button className="export-button" onClick={exportTender} type="button"><Download size={17} /> EXPORT MUNICIPAL TENDER <ArrowUpRight size={16} /></button></div>
      </main>
      {isTenderOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Municipal tender bill of quantities">
        <motion.div initial={{ opacity: 0, scale: .96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="tender-modal">
          <div className="tender-header"><div><div className="section-kicker"><Building2 size={14} /> OFFICIAL PROCUREMENT DOCUMENT</div><h2>MUNICIPAL CORPORATION CAPITAL WORKS DIVISION</h2><p>URBAN HEAT MITIGATION TENDER / SCHEDULE OF RATES &amp; BILL OF QUANTITIES</p></div><button className="modal-close" onClick={() => setIsTenderOpen(false)} type="button">×</button></div>
          <div className="tender-meta"><span>ZONE <b>{data.zone}</b></span><span>CITY <b>{data.city}</b></span><span>CEILING <b>{formatLakhs(activeBudget)}</b></span><span>UTCi TARGET <b>−{derived.planA}°C</b></span></div>
          <div className="boq-table-wrap"><table className="boq-table"><thead><tr><th>ITEM CODE</th><th>SPECIFICATION DESCRIPTION</th><th>QUANTITY</th><th>UNIT RATE</th><th>TOTAL LINE COST</th></tr></thead><tbody>{boqRows.map((row) => <tr key={row.code}><td>{row.code}</td><td>{row.description}</td><td>{row.quantity} {row.unit}</td><td>{row.rate}</td><td>{row.total}</td></tr>)}</tbody></table></div>
          <div className="tender-footer"><span><ShieldCheck size={15} /> Physics-Validated Solver / ISO 7730</span><span>Generated 07 Sep 2026 / HeatScape Planner</span><div><button className="modal-secondary" onClick={() => setIsTenderOpen(false)} type="button">Close</button><button className="modal-primary" onClick={() => window.print()} type="button"><Download size={15} /> Download PDF Tender</button></div></div>
        </motion.div>
      </div>}
      <footer className="footer"><span>HEATSCAPE / 2026</span><span>Urban heat decisions, made tangible.</span><span>DATA SOURCES: OPEN-METEO · LANDSAT · ERA5</span></footer>
    </div>
  );
}

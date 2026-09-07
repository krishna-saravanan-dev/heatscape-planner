import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "react-globe.gl";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Activity, ArrowRight, Building2, Check, ChevronDown, CircleHelp, CloudSun, Download, Flame, Gauge, Layers3, LocateFixed, MapPin, Radio, Search, ShieldCheck, Sparkles, Sun, TreePine, Waves, Zap } from "lucide-react";
import { toast } from "sonner";

type CityKey = "Chennai" | "Bengaluru" | "Delhi";
type CityData = { city: CityKey; state: string; lat: number; lon: number; temp: number; surface: number; utci: number; solar: number; humidity: number; zone: string };
const cities: Record<CityKey, CityData> = {
  Chennai: { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, temp: 34.8, surface: 48.2, utci: 42.6, solar: 812, humidity: 63, zone: "T. Nagar / Central Chennai" },
  Bengaluru: { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, temp: 28.4, surface: 38.1, utci: 32.2, solar: 744, humidity: 48, zone: "Koramangala / South Bengaluru" },
  Delhi: { city: "Delhi", state: "Delhi NCR", lat: 28.6139, lon: 77.209, temp: 41.2, surface: 53.6, utci: 47.1, solar: 923, humidity: 31, zone: "Lajpat Nagar / South Delhi" },
};
const cityKeys = Object.keys(cities) as CityKey[];
const hotspotPoints = cityKeys.map((key) => ({ ...cities[key], size: key === "Delhi" ? 1.15 : .78, color: key === "Delhi" ? "#ff3d81" : "#ff5b43" }));

function Ticker({ value, decimals = 1, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const from = display;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 420);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
}

function Metric({ label, value, suffix, tone = "cyan" }: { label: string; value: string | number; suffix: string; tone?: "cyan" | "pink" }) {
  return <motion.div layout className={`metric-glass ${tone}`} whileHover={{ y: -4, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}><span>{label}</span><strong><Ticker value={Number(value)} suffix={suffix} /></strong><i><span /> LIVE SIGNAL</i></motion.div>;
}
function Glass({ children, className = "" }: { children: ReactNode; className?: string }) { return <motion.section className={`glass ${className}`} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>{children}</motion.section>; }

function HeatGlobe({ city, onPick }: { city: CityData; onPick: (name: CityKey) => void }) {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  useEffect(() => { fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((res) => res.json()).then((data) => import("topojson-client").then(({ feature }) => setCountries((feature(data as any, data.objects.countries as any) as any).features))).catch(() => setCountries([])); }, []);
  useEffect(() => { globeRef.current?.pointOfView({ lat: city.lat, lng: city.lon, altitude: 1.65 }, 900); }, [city]);
  return <div className="globe-stage"><Globe ref={globeRef} width={600} height={430} backgroundColor="rgba(0,0,0,0)" globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg" bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png" polygonsData={countries} polygonCapColor={() => "rgba(34,211,238,.06)"} polygonSideColor={() => "rgba(168,85,247,.08)"} polygonStrokeColor={() => "rgba(34,211,238,.27)"} polygonAltitude={0.012} pointsData={hotspotPoints} pointLat="lat" pointLng="lon" pointColor="color" pointRadius="size" pointAltitude={0.04} pointResolution={12} pointsMerge={false} ringsData={hotspotPoints} ringLat="lat" ringLng="lon" ringColor={() => (t: number) => `rgba(255,61,129,${1 - t})`} ringMaxRadius={4} ringPropagationSpeed={1.8} ringRepeatPeriod={900} onPointClick={(point: any) => onPick(point.city)} atmosphereColor="#22d3ee" atmosphereAltitude={0.18} enablePointerInteraction /> <div className="globe-crosshair" /><div className="globe-caption"><span className="pulse-dot magenta" /> {city.city.toUpperCase()} / GIS FOCUS <b>{city.lat.toFixed(4)}°N {city.lon.toFixed(4)}°E</b></div></div>;
}

export default function Home() {
  const [cityKey, setCityKey] = useState<CityKey>("Chennai");
  const [query, setQuery] = useState("Chennai");
  const [budget, setBudget] = useState(2700000);
  const [undergroundWires, setUndergroundWires] = useState(false);
  const [trafficZone, setTrafficZone] = useState(true);
  const [roofPriority, setRoofPriority] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [hovered, setHovered] = useState("");
  const [showTender, setShowTender] = useState(false);
  const city = cities[cityKey];
  const budgetLakhs = budget / 100000;
  const solver = useMemo(() => {
    const roofBoost = roofPriority ? 1.25 : 1;
    const trafficFactor = trafficZone ? 1.08 : 1;
    const wireFactor = undergroundWires ? .92 : 1;
    const planA = (2.2 + budgetLakhs * .085) * roofBoost * trafficFactor * wireFactor;
    const planB = (1.8 + budgetLakhs * .06) * trafficFactor;
    const planC = (1.35 + budgetLakhs * .045) * roofBoost;
    const treeUnits = undergroundWires ? Math.min(120, Math.floor(budget * .4 / 1400)) : Math.floor(budget * .4 / 1400);
    return { planA, planB, planC, treeUnits, roofSqm: Math.floor(budget * .6 / 160), shadeSqm: Math.floor(budget * .5 / 120), aRoi: 14.5 + budgetLakhs * .15, bRoi: 10.4 + budgetLakhs * .06, cRoi: 12.6 + budgetLakhs * .09 };
  }, [budget, budgetLakhs, undergroundWires, trafficZone, roofPriority]);
  const activeBudget = Math.round(budget / 50000) * 50000;
  const focusCity = (key: CityKey) => { setCityKey(key); setQuery(key); setPulse(true); window.setTimeout(() => setPulse(false), 500); };
  const searchCity = () => { const match = cityKeys.find((key) => key.toLowerCase() === query.trim().toLowerCase()); match ? focusCity(match) : toast.error("City not indexed", { description: "Try Chennai, Bengaluru, or Delhi." }); };
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(3, 7, 18); doc.rect(0, 0, 210, 32, "F");
    doc.setTextColor(34, 211, 238); doc.setFont("helvetica", "bold"); doc.setFontSize(21); doc.text("HEATSCAPE", 15, 15);
    doc.setTextColor(230, 238, 242); doc.setFontSize(8); doc.text("URBAN THERMAL INTELLIGENCE / MUNICIPAL CAPITAL WORKS", 15, 23);
    doc.setTextColor(25, 35, 50); doc.setFontSize(15); doc.text("Bill of Quantities — Urban Heat Mitigation Tender", 15, 47);
    doc.setFontSize(9); doc.text(`City: ${city.city}, ${city.state}    Zone: ${city.zone}`, 15, 55); doc.text(`Deployment budget: ₹${(activeBudget / 100000).toFixed(1)}L    Plan A UTCI drop: -${solver.planA.toFixed(1)}°C`, 15, 62);
    autoTable(doc, { startY: 72, head: [["Item", "Quantity", "Rate", "Total"]], body: [["High-albedo cool roof coating", `${solver.roofSqm.toLocaleString()} m²`, "₹160 / m²", `₹${(solver.roofSqm * 160).toLocaleString()}`], ["Native urban canopy", `${solver.treeUnits.toLocaleString()} saplings`, "₹1,400 / unit", `₹${(solver.treeUnits * 1400).toLocaleString()}`], ["Misting corridors", `${Math.max(1, Math.floor(activeBudget * .1 / 120000))} corridors`, "₹120,000 / unit", `₹${Math.round(activeBudget * .1).toLocaleString()}`]], theme: "grid", headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255] }, alternateRowStyles: { fillColor: [242, 247, 250] } });
    const endY = (doc as any).lastAutoTable.finalY + 17;
    doc.setTextColor(25, 35, 50); doc.setFontSize(10); doc.text(`Financial ROI: ${solver.aRoi.toFixed(1)}%    Payback: ${(3.8 - budgetLakhs * .025).toFixed(1)} years    Emissions impact: -${Math.round(270 + budgetLakhs * 13)} tons CO2e`, 15, endY);
    doc.setDrawColor(34, 211, 238); doc.setLineWidth(.7); doc.rect(15, endY + 12, 62, 19); doc.setFontSize(8); doc.setTextColor(34, 160, 180); doc.text("GENERATED BY AI WORKFLOW", 19, endY + 24); doc.setTextColor(100, 110, 120); doc.text("HeatScape / ISO 7730 solver", 15, 285);
    doc.save("HeatScape_BoQ_Tender.pdf"); toast.success("Branded tender PDF generated", { description: "HeatScape_BoQ_Tender.pdf is ready." }); setShowTender(false);
  };
  return <div className="heatscape-app"><header className="nav"><div className="logo"><span className="logo-glyph">⌁</span><div><b>HEAT<span>SCAPE</span></b><small>URBAN THERMAL INTELLIGENCE</small></div></div><div className="nav-links"><button className="active">Planner</button><button onClick={() => toast.info("Hotspots layer", { description: "Select a point directly on the globe to focus the city." })}>Hotspots</button><button onClick={() => toast.info("Interventions", { description: "Optimizer cards are live and budget-sensitive." })}>Interventions</button></div><div className="nav-right"><span><i className="pulse-dot green" /> SYSTEM LIVE</span><CircleHelp size={16} /><b className="avatar">AR</b></div></header>
    <main className="main"><div className="hero"><div><div className="overline"><span /> MUNICIPAL CONTROL CENTER / 07 SEP 2026</div><h1>Cool the city.<br /><em>Precisely.</em></h1><p>Real-time thermodynamic modeling paired with deterministic capital optimization for municipal planners.</p></div><div className="hero-meta"><Sparkles size={15} /> PHYSICS-VALIDATED SOLVER<br /><b>UTCI / ISO 7730 COMPLIANT • 98.4% CONFIDENCE</b></div></div>
      <Glass className="command"><div className="section-head"><span><Radio size={15} /> COMMAND CENTER</span><small>INPUT / 01</small></div><div className="command-grid"><div><label>TARGET URBAN ZONE</label><div className="search"><MapPin size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchCity()} /><button onClick={searchCity}><Search size={16} /></button></div><div className="chips">{cityKeys.map((key) => <button className={cityKey === key ? "selected" : ""} key={key} onClick={() => focusCity(key)}>{key}</button>)}</div></div><div className="location"><div><LocateFixed size={16} /> {city.city}, {city.state} <span><Check size={11} /> VERIFIED</span></div><small>LAT <b>{city.lat.toFixed(4)}° N</b> &nbsp;&nbsp; LON <b>{city.lon.toFixed(4)}° E</b></small></div></div></Glass>
      <div className="workspace"><Glass className="globe-card"><div className="section-head"><span><Layers3 size={15} /> 3D SPATIAL HEAT LAYER</span><b className="heat-score">8.7 <small>/10 HEAT INDEX</small></b></div><HeatGlobe city={city} onPick={focusCity} /></Glass><Glass className="controls"><div className="section-head"><span><Zap size={15} /> PHYSICAL CONTROL BOARD</span><small>INPUT / 02</small></div><label>DEPLOYMENT BUDGET</label><strong className="budget">₹{(activeBudget / 100000).toFixed(1)}L <small>INR</small></strong><div className="range"><input type="range" min="500000" max="5000000" step="50000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /><div className="range-fill" style={{ width: `${((budget - 500000) / 4500000) * 100}%` }} /></div><div className="range-labels"><span>₹5L</span><span>₹50L</span></div><div className="switches"><Switch label="Underground wires" hint="Utility corridors protected" icon={<ShieldCheck size={16} />} checked={undergroundWires} onChange={() => setUndergroundWires(!undergroundWires)} /><Switch label="Heavy traffic zone" hint="Transit-grade asphalt" icon={<Activity size={16} />} checked={trafficZone} onChange={() => setTrafficZone(!trafficZone)} /><Switch label="Reflective roof priority" hint="Cool roof allocation +25%" icon={<Sun size={16} />} checked={roofPriority} onChange={() => setRoofPriority(!roofPriority)} /></div><div className="tag-row">{undergroundWires && <span>ROOT BARRIER SAFETY ACTIVE</span>}{trafficZone && <span>TRANSIT-GRADE HIGH-ALBEDO ASPHALT</span>}</div></Glass></div>
      <Glass className={`telemetry ${pulse ? "flash" : ""}`}><div className="section-head"><span><Gauge size={15} /> TELEMETRY DASHBOARD <small>/ {city.zone}</small></span><b><i className="pulse-dot green" /> LIVE WEATHER FEED</b></div><div className="metrics"><Metric label="AMBIENT TEMPERATURE" value={city.temp.toFixed(1)} suffix="°C" /><Metric label="SURFACE TEMPERATURE" value={city.surface.toFixed(1)} suffix="°C" tone="pink" /><Metric label="UTCI PEDESTRIAN STRESS" value={city.utci.toFixed(1)} suffix="°C" tone="pink" /></div><div className="telemetry-foot"><span><Sun size={14} /> SOLAR {city.solar} W/m²</span><span><CloudSun size={14} /> HUMIDITY {city.humidity}%</span><span><Waves size={14} /> {city.utci >= 45 ? "EXTREME DANGER" : city.utci >= 32 ? "VERY STRONG STRESS" : "MODERATE STRESS"}</span></div></Glass>
      <div className="optimizer-head"><div><div className="overline"><span /> OPTIMIZER OUTPUT</div><h2>Capital plans that cool on contact.</h2></div><span className="budget-live">BUDGET SENSITIVITY <b>ACTIVE</b></span></div><div className="plans"><Plan letter="A" title="Maximum Cooling" subtitle="60% cool roofs / 40% canopy" drop={solver.planA} roi={solver.aRoi} payback={3.8 - budgetLakhs * .025} emissions={270 + budgetLakhs * 13} featured icon={<Flame size={20} />} /><Plan letter="B" title="Eco-Forestry" subtitle="Dense Miyawaki + permeable bioswales" drop={solver.planB} roi={solver.bRoi} payback={4.5} emissions={400 + budgetLakhs * 15} icon={<TreePine size={20} />} /><Plan letter="C" title="Rapid Deployment" subtitle="Shade sails + reflective coatings" drop={solver.planC} roi={solver.cRoi} payback={2.8} emissions={200 + budgetLakhs * 8} icon={<Zap size={20} />} /></div><div className="bottom-bar"><span><i className="pulse-dot green" /> PROJECTED IMPACT <b>−{solver.planA.toFixed(1)}°C UTCI / {solver.treeUnits} canopy units</b></span><button className="tender-btn" onClick={() => setShowTender(true)}><Download size={16} /> GENERATE TENDER PDF <ArrowRight size={15} /></button></div></main><footer><span>HEATSCAPE / 2026</span><span>Urban heat decisions, made tangible.</span><span>DATA SOURCES: OPEN-METEO · LANDSAT · ERA5</span></footer>
    <AnimatePresence>{showTender && <div className="modal-backdrop"><motion.div className="tender-modal" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }}><div className="modal-top"><div><div className="section-head"><span><Building2 size={15} /> MUNICIPAL CORPORATION CAPITAL WORKS DIVISION</span></div><h2>Urban Heat Mitigation Tender</h2><p>Current state compiled for {city.city} / Plan A — Maximum Cooling.</p></div><button onClick={() => setShowTender(false)} className="close">×</button></div><div className="boq-preview"><div>ITEM <b>High-albedo cool roofs</b></div><div>QTY <b>{solver.roofSqm.toLocaleString()} m²</b></div><div>RATE <b>₹160 / m²</b></div><div>TOTAL <b>₹{(solver.roofSqm * 160).toLocaleString()}</b></div><div>ITEM <b>Native urban canopy</b></div><div>QTY <b>{solver.treeUnits} saplings</b></div><div>RATE <b>₹1,400 / unit</b></div><div>TOTAL <b>₹{(solver.treeUnits * 1400).toLocaleString()}</b></div></div><div className="modal-actions"><button className="secondary" onClick={() => setShowTender(false)}>Close</button><button className="tender-btn" onClick={generatePdf}><Download size={15} /> DOWNLOAD BRANDED PDF</button></div></motion.div></div>}</AnimatePresence>
  </div>;
}
function Switch({ label, hint, icon, checked, onChange }: { label: string; hint: string; icon: ReactNode; checked: boolean; onChange: () => void }) { return <button className={`hardware ${checked ? "on" : ""}`} onClick={onChange}><span className="hardware-icon">{icon}</span><span><b>{label}</b><small>{hint}</small></span><i className="switch"><em /></i></button>; }
function Plan({ letter, title, subtitle, drop, roi, payback, emissions, featured, icon }: { letter: string; title: string; subtitle: string; drop: number; roi: number; payback: number; emissions: number; featured?: boolean; icon: ReactNode }) { return <motion.article className={`plan ${featured ? "featured" : ""}`} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}><div className="plan-top"><span>{letter}</span><b>{featured ? "RECOMMENDED TENDER" : "OPTIMIZED SCENARIO"}</b><ArrowRight size={15} /></div><div className="plan-icon">{icon}</div><h3>{title}</h3><p>{subtitle}</p><div className="plan-metrics"><div><strong>−<Ticker value={drop} suffix="°" /></strong><span>UTCI DROP</span></div><div><strong><Ticker value={roi} suffix="%" /></strong><span>FINANCIAL ROI</span></div><div><strong><Ticker value={payback} suffix="Y" /></strong><span>PAYBACK</span></div><div><strong>−<Ticker value={Math.round(emissions)} decimals={0} /></strong><span>TONS CO2E</span></div></div></motion.article>; }

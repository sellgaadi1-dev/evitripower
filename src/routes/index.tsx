import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/EnquiryForm";
import logo from "@/assets/evt-logo.jpg.asset.json";
import vasudev from "@/assets/evt-vasudev.jpg.asset.json";
import tvc from "@/assets/evt-tvc.jpg.asset.json";
import mahesh from "@/assets/evt-mahesh.jpg.asset.json";
import g1 from "@/assets/evt-g1.jpg.asset.json";
import g2 from "@/assets/evt-g2.jpg.asset.json";
import g3 from "@/assets/evt-g3.jpg.asset.json";
import g4 from "@/assets/evt-g4.jpg.asset.json";
import g5 from "@/assets/evt-g5.jpg.asset.json";
import g6 from "@/assets/evt-g6.jpg.asset.json";
import g7 from "@/assets/evt-g7.jpg.asset.json";
import g8 from "@/assets/evt-g8.jpg.asset.json";
import { useState } from "react";

const TITLE = "EVTripower Solutions — EV & Automotive Consulting for India";
const DESC =
  "Partner-led EV consulting: India market entry, CBU→SKD→CKD localization, homologation, dealer networks and China OEM partnerships.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [["#why-now","Why India now"],["#different","Why EVT"],["#practices","Services"],["#partners","Partner network"],["#team","Partners"],["#engage","Engage"],["#contact","Contact"]];

const audiences = [
  ["Indian business & automotive groups", "Add a credible EV brand to your portfolio, with a vetted platform partner, a localization path and a network plan built in.", true],
  ["Global EV makers", "India entry: partner selection, pricing, launch and channel plans, CBU → SKD → CKD roadmaps and CMVR type approval.", false],
  ["Tier-1 suppliers", "Greenfield plants, supplier localization and value-addition plans, plus China sourcing and JV structuring.", false],
  ["Dealer groups", "Dealer planning, SOPs and audits, parts and service setup, CSI programmes and DMS rollout for EV franchises.", false],
] as const;

const compare = [
  ["Who does the work", "Partner sells; analyst teams deliver", "Three partners, hands-on.", "86+ years across manufacturing, aftersales and OEM strategy, on your programme personally."],
  ["Finding a platform partner", "Long-list research, months of outreach", "10 signed MOUs and agreements (2023–2025)", "with China OEMs across buses, trucks, hydrogen, vans, cars, chargers and machinery. A shortlist on day one."],
  ["Scope", "Strategy deck; execution handed over", "From kit to dealer, end to end.", "Partner brokering, CBU→SKD→CKD, homologation, supplier base, dealer network and aftersales."],
  ["Aftersales & CX", "Generic retail benchmarks", "Built BYD India's EV aftersales turnkey", "(CSI 4.8, 97% first-pick parts) and launched Audi India aftersales."],
  ["Resale & residual value", "Rarely addressed", "Residual-value and buy-back models", "to overcome resale fear, from the founder of VW India's certified pre-owned business."],
  ["Geography", "India desk or global desk", "India · UAE · Middle East · Africa · China,", "with C-suite experience in the GCC and partners signed in person in China."],
  ["When it gets hard", "Recommendations", "Interim CXO leadership,", "P&L turnarounds and contract renegotiation, all done before for real companies."],
];

const practices = [
  ["Market entry & GTM", "India entry for global EV makers: partner selection, pricing, launch and channel plans.", "Mahesh B. Kale"],
  ["Localization & plants", "CBU → SKD → CKD roadmaps, greenfield plant setup, supplier localization and value-addition plans.", "Vasudev Rao Varkoor"],
  ["Homologation", "CMVR and whole-vehicle type approval in India; GSO and ESMA in the GCC; testing-agency coordination.", "Partner-led, cross-practice"],
  ["Network & aftersales", "Dealer planning, SOPs and audits, parts and service setup, CSI programmes, DMS rollout.", "TVC Rao"],
  ["Business strategy & digital", "Business strategy built on defined goals, with a roadmap for product launch and digitization.", "Mahesh B. Kale"],
  ["Turnaround & interim", "P&L diagnosis, cost control, contract renegotiation and interim CXO leadership.", "Vasudev Rao Varkoor"],
];

type PCat = "Buses & trucks" | "Hydrogen" | "LCVs & cars" | "Charging & energy" | "Machinery";
const partners: { cat: PCat; desc: string; deal: string; terms: string }[] = [
  { cat: "Buses & trucks", desc: "Electric buses, trucks, ambulances, engineering vehicles; founded 2017; Nanjing, Hengyang, Yueyang.", deal: "MOU · Jun 2023", terms: "UAE exclusivity first; showroom, warehouse, after-sales. Draft distributorship for bus kits." },
  { cat: "Buses & trucks", desc: "City, mini and coach buses, mini trucks, LCVs in EV, CNG and diesel; ~RMB 1 bn assets; 444,000 m² site.", deal: "Draft MOU · Apr 2025 · India", terms: "Exclusive India cooperation; CBU, SKD, CKD; homologation support." },
  { cat: "Buses & trucks", desc: "Fuel and new-energy buses, trucks, special vehicles; Dongfeng Group subsidiary, Shiyan, Hubei.", deal: "MOU · Nov 2023", terms: "Electric trucks with 5-yr warranty, 8-yr parts supply, 300 km range, battery-swap units." },
  { cat: "Buses & trucks", desc: "Cabs, special-vehicle chassis, tankers, EV trucks; founded 1980; 4,000+ staff.", deal: "MOU · Nov 2023", terms: "Tankers and EV trucks; joint venture considered." },
  { cat: "Hydrogen", desc: "Hydrogen fuel-cell buses and heavy trucks; Ballard-powered bus programme.", deal: "MOU · Dec 2023", terms: "Exclusive distribution; UAE JV for SKD and CKD." },
  { cat: "Buses & trucks", desc: "Electric commercial vehicles.", deal: "MOU · Jan 2024", terms: "Exclusive UAE distribution, subject to GSO and ESMA approvals." },
  { cat: "LCVs & cars", desc: "Logistics vans G100/G100P, G050, G200B; 1.6 mn cumulative overseas sales.", deal: "Distribution agreement", terms: "UAE and Middle East." },
  { cat: "LCVs & cars", desc: "Passenger EVs (Modern IN), built by BAW.", deal: "MOU · Nov 2023", terms: "Joint venture in principle; exclusive distribution." },
  { cat: "Charging & energy", desc: "Battery test systems, storage converters, AC/DC chargers; founded 2005, Fuzhou; Shenzhen-listed; ~2,100 staff.", deal: "MOU · Feb 2025 · India", terms: "Exclusive India technical services and sales, 3 years." },
  { cat: "Machinery", desc: "Loaders, excavators, forklifts, road machinery; founded 1951; Shanghai-listed.", deal: "MOU · Dec 2023", terms: "Exclusive agency for UAE, Middle East and Africa." },
];

type Power = "ICEV" | "EV" | "CNG" | "Hydrogen";
const categories: [string, Power, string?][] = [
  ["Two-wheelers", "ICEV"], ["Three-wheelers", "ICEV"], ["Premium passenger cars", "EV"], ["Passenger cars & SUVs", "EV"],
  ["Light trucks", "ICEV"], ["Pick-ups", "ICEV"], ["Medium & heavy trucks", "ICEV"], ["Electric buses", "EV"],
  ["CNG buses", "CNG"], ["Hydrogen buses & trucks", "Hydrogen"],
  ["Special vehicles", "ICEV", "Tankers · RVs · ambulances · sweepers · refuse collectors"],
  ["Construction & road machinery", "ICEV"], ["Airport airside equipment", "ICEV"],
  ["Battery energy storage (BESS)", "EV"], ["EV chargers", "EV"],
];

const team = [
  { img: vasudev.url, name: "Vasudev Rao Varkoor", yrs: "30+", role: "Partner · Manufacturing, Localization & China Sourcing", bio: "Mechanical engineer and MBA, with C-suite roles across India, UAE and Oman. Has run P&Ls up to INR 1,500 Cr / USD 150 Mn and built greenfield Tier-1 plants.", brands: "Volvo · MG · Ford Trucks · Ashok Leyland · JLR · BYD · Escorts" },
  { img: tvc.url, name: "TVC Rao", yrs: "29", role: "Partner · EV Aftersales, Network & Customer Experience", bio: "29 years across nine brands. Built BYD India's turnkey EV aftersales network and launched Audi India's aftersales programme.", brands: "BYD · Audi · Mercedes · Honda · VW · Nissan · Renault · Kia · Mahindra" },
  { img: mahesh.url, name: "Mahesh B. Kale", yrs: "27", role: "Partner · OEM Strategy, Network & Market Entry", bio: "Over two decades with Shell, Maruti Suzuki and Volkswagen Group India. Built VW India's pre-owned network to 100+ dealerships and headed Group Strategy, reporting to the Group MD. Now a founder advising OEMs.", brands: "VW Group India · Maruti Suzuki · SheerDrive · Shell · HUL" },
];

const engage = [
  ["Typically 4–12 weeks", "Diagnostic sprint", "Market, product and partner fit; regulatory path; a clear go / no-go with the business case."],
  ["Typically 3–9 months", "Programme build", "Localization roadmap, homologation, supplier base, dealer and service network rollout."],
  ["Deal-based", "Partner brokering", "Introductions, MOUs, agreements, China coordination, technical support and term sheets with Chinese OEMs and suppliers."],
  ["Retainer", "Partner on the ground", "Programme director or interim CXO for overseas interaction and operational implementation."],
];

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-4xl font-medium leading-tight md:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pFilter, setPFilter] = useState<"All" | PCat>("All");
  const [cFilter, setCFilter] = useState<"All" | Power>("All");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-ink/95 text-ink-foreground backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3 font-display text-lg font-extrabold tracking-tight"><img src={logo.url} alt="EVTripower Solutions logo" className="h-11 w-11 rounded-full bg-card object-contain" /><span>EVTripower<small className="block text-[10px] font-medium uppercase tracking-[0.24em] opacity-60">Solutions</small></span></a>
          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {navItems.map(([h,l]) => (
              <a key={h} href={h} className="opacity-85 hover:text-teal">{l}</a>
            ))}
          </nav>
          
          <a href="#contact" className="rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-foreground hover:opacity-90 max-sm:hidden">Start a conversation</a>
          <button aria-label="Menu" onClick={() => setMenuOpen((o) => !o)} className="text-2xl lg:hidden">{menuOpen ? "✕" : "☰"}</button>
        </div>
        {menuOpen && (
          <nav className="border-t border-ink-foreground/15 px-6 pb-4 lg:hidden">
            {navItems.map(([h, l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} className="block py-3 font-medium hover:text-teal">{l}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="on-ink bg-ink-deep text-ink-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="eyebrow mb-6">EV & Automotive Consulting for India</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[1.05] md:text-7xl">
            For groups ready to <em>expand into EVs</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg opacity-80">
            Whether you are adding an EV brand to a diversified group or bringing your own vehicles to India, we cover the whole programme, from the first partner meeting to the first service visit.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="rounded-full bg-accent px-6 py-4 font-display font-bold text-accent-foreground hover:opacity-90">Request a diagnostic →</a>
            <a href="#partners" className="rounded-full border border-ink-foreground/35 px-6 py-4 font-display hover:border-teal hover:text-teal font-bold hover:bg-ink-foreground/10">See our partner network</a>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHead eyebrow="Who we work with" title={<>Built for four kinds of <em>EV ambition</em></>} />
        <div className="grid gap-5 md:grid-cols-2">
          {audiences.map(([t, d, top]) => (
            <div key={t} className="rounded-xl border bg-card p-8">
              {top && <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold">Most asked</span>}
              <h3 className="text-2xl font-medium">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Market */}
      <section id="why-now" className="scroll-mt-20 bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHead eyebrow="The Indian EV market in late 2026" title={<>The window is open, <em>and it rewards speed.</em></>} intro="Policy now rewards companies that build locally. Demand keeps growing even as subsidies are reduced." />
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-card p-8"><p className="eyebrow">Commercial EVs</p><h3 className="mt-3 text-2xl">PM E-DRIVE runs to March 2028</h3><p className="mt-3 text-sm text-muted-foreground">Extended for e-buses, e-trucks, e-ambulances and testing agencies. The scheme has a fixed budget: each category closes when its money is spent.</p></div>
            <div className="rounded-xl bg-card p-8"><p className="eyebrow">Passenger EVs</p><h3 className="mt-3 text-2xl">Import relief is tied to local build</h3><p className="mt-2 font-display text-5xl text-primary">15%</p><p className="mt-3 text-sm text-muted-foreground">SPMEPCI duty on up to 8,000 CBUs a year, against ₹4,150 cr investment and 25% local value in 3 years, 50% in 5.</p></div>
            <div className="rounded-xl bg-card p-8"><p className="eyebrow">Demand</p><h3 className="mt-3 text-2xl">Growth without subsidy crutches</h3><p className="mt-2 font-display text-5xl text-primary">+86%</p><p className="mt-3 text-sm text-muted-foreground">Passenger EV sales reached about 270,000 units in 2025, while e-2W incentives are being tapered.</p></div>
          </div>
          <div className="mt-8 rounded-xl border-l-4 border-primary bg-card p-6">
            <p><strong>What it means:</strong> The winners localize fastest. They move from kits to a local plant while building homologation, suppliers and the dealer network in parallel. That parallel build is what we deliver.</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Sources: MHI notifications via Inc42, Drishti IAS, Autocar Pro; News18.</p>
        </div>
      </section>

      {/* Why */}
      <section id="different" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24">
        <SectionHead eyebrow="Why EVTripower" title={<>We have run the businesses <em>we advise on.</em></>} intro="Large firms bring frameworks and benchmarks. We bring operating experience from inside Volkswagen Group, BYD, Audi, Volvo, MG, Ashok Leyland and Maruti Suzuki, plus signed relationships that let a programme start in its first week." />
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden grid-cols-[1fr_1fr_2fr] gap-6 border-b bg-muted px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:grid">
            <span>What matters</span><span>Typical advisory model</span><span>The EVT difference</span>
          </div>
          {compare.map(([a, b, c, d]) => (
            <div key={a} className="grid gap-2 border-b px-6 py-5 last:border-0 md:grid-cols-[1fr_1fr_2fr] md:gap-6">
              <span className="font-bold">{a}</span>
              <span className="text-muted-foreground line-through decoration-muted-foreground/40">{b}</span>
              <span><strong className="text-primary">{c}</strong> {d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Practices */}
      <section id="practices" className="on-ink bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow mb-4">Consulting practices</p>
          <h2 className="text-4xl font-medium md:text-5xl">Six practices, <em>one programme</em></h2>
          <p className="mt-5 max-w-2xl text-lg opacity-75">Most EV programmes stall where one workstream hands over to the next. Our practices run in parallel under the same partners.</p>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-ink-foreground/15 md:grid-cols-3">
            {practices.map(([t, d, l], i) => (
              <div key={t} className="bg-ink p-8">
                <p className="font-serif text-4xl italic text-teal">0{i + 1}</p>
                <h3 className="mt-4 text-xl">{t}</h3>
                <p className="mt-3 text-sm opacity-75">{d}</p>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider opacity-60">Led by {l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHead eyebrow="Localization reference · Ethio-Engineering Group MOU (2023)" title={<>From kit to local build <em>in three phases</em></>} intro="This structure has already been agreed in a real deal, and an Indian programme would follow the same path. Commercial terms are built into it: deferred letters of credit, staff training and a digitally managed parts store." />
        <div className="grid gap-5 md:grid-cols-3">
          {[["Phase I · SKD", "SKD electric vehicles plus a 12 m city bus"], ["Phase II · Assembly", "Units across 10 models on a working assembly line"], ["Phase III · CKD", "CKD sets with technology transfer"]].map(([p, d], i) => (
            <div key={p} className="relative rounded-xl border bg-card p-8">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-primary" style={{ opacity: 0.4 + i * 0.3 }} />
              <p className="eyebrow">{p}</p>
              <p className="mt-3 text-lg">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Homologation", "Supplier base", "Dealer network", "Service & parts"].map((w) => (
            <span key={w} className="rounded-full bg-secondary px-4 py-2 text-sm font-bold">{w}</span>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground"><strong className="text-foreground">Run in parallel, not in sequence:</strong> these four workstreams start alongside Phase I, so the network is ready when local production begins.</p>
      </section>

      {/* Partners */}
      <section id="partners" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHead eyebrow="EVT capability · China partner network" title={<>Ten signed relationships, <em>ready to put to work</em></>} intro="The hardest step in an EV programme is finding a credible platform partner willing to supply kits, transfer technology and support homologation. That search usually takes a year. With our network, you start from a shortlist on day one." />
          <div className="mb-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {[["10", "Partners", "MOUs and agreements, 2023–2025"], ["7", "Product families", "Buses, trucks, hydrogen, vans, cars, chargers, machinery"], ["3", "Supply models", "CBU, SKD and CKD, with homologation support"], ["4", "Territories", "India, UAE, wider Middle East, Africa"]].map(([n, l, d]) => (
              <div key={l}><p className="font-display text-5xl text-primary">{n}</p><p className="mt-1 font-bold">{l}</p><p className="text-sm text-muted-foreground">{d}</p></div>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {(["All", "Buses & trucks", "Hydrogen", "LCVs & cars", "Charging & energy", "Machinery"] as const).map((f) => (
              <button key={f} onClick={() => setPFilter(f)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${pFilter === f ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{f === "All" ? "All partners" : f}</button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {partners.filter((p) => pFilter === "All" || p.cat === pFilter).map((p) => (
              <div key={p.desc} className="rounded-xl bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{p.cat}</p>
                <p className="mt-2">{p.desc}</p>
                <p className="mt-3 text-sm"><strong className="text-primary">{p.deal}</strong> — {p.terms}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Public profiles as reported by public sources; not independently verified. Further OEM contacts and partners in discussion.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHead eyebrow="Where we have contacts and operate" title={<>15 categories, <em>IC to EV</em></>} intro="From two-wheelers to airport airside equipment, across four powertrains. Filter to see where we can help your portfolio." />
        <div className="mb-6 flex flex-wrap gap-2">
          {(["All", "ICEV", "EV", "CNG", "Hydrogen"] as const).map((f) => (
            <button key={f} onClick={() => setCFilter(f)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${cFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([n, p, sub], i) => {
            const on = cFilter === "All" || cFilter === p;
            return (
              <div key={n} className={`flex items-start gap-4 rounded-lg border bg-card p-5 transition ${on ? "" : "opacity-30"}`}>
                <span className="font-display text-xl text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1"><p className="font-bold">{n}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold">{p}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHead eyebrow="The team behind the work" title={<>Three partners, <em>across the whole value chain</em></>} intro="Manufacturing and China sourcing. Aftersales and customer experience. OEM strategy and dealer networks. Together they cover the full journey an EV brand takes into India." />
          <div className="grid gap-5 md:grid-cols-3">
            {team.map((t) => (
              <div key={t.name} className="flex flex-col rounded-xl bg-card p-8">
                <div className="flex items-center justify-between">
                  <img src={t.img} alt={t.name} className="h-16 w-16 rounded-full object-cover" />
                  <p className="text-right"><span className="font-display text-4xl text-primary">{t.yrs}</span><br /><span className="text-xs text-muted-foreground">years</span></p>
                </div>
                <h3 className="mt-6 text-2xl">{t.name}</h3>
                <p className="mt-1 text-sm font-bold text-primary">{t.role}</p>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{t.bio}</p>
                <p className="mt-5 border-t pt-4 text-xs"><strong>Brands</strong> {t.brands}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[[g1,"MOU signing with a hydrogen vehicle partner"],[g2,"Agreement signing in China"],[g3,"Machinery plant visit"],[g4,"Hydrogen refuse truck"],[g5,"Signing ceremony with UAE partners"],[g6,"Partner delegation signing"],[g7,"Agreement signing"],[g8,"Handshake after MOU signing"]].map(([g,a]) => (
              <img key={a as string} src={(g as {url:string}).url} alt={a as string} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
            ))}
          </div>
          <p className="mt-6 text-center text-muted-foreground">Each partner MOU was negotiated face to face — in plant visits, boardrooms and signing ceremonies in China and the UAE, not by email. That is why our introductions get answered.</p>
        </div>
      </section>

      {/* Engage */}
      <section id="engage" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHead eyebrow="Working with us" title={<>Four ways <em>we engage</em></>} intro="Start small with a go / no-go decision, or bring us in to run the programme. Each model is led by a partner." />
        <div className="grid gap-5 md:grid-cols-4">
          {engage.map(([d, t, x], i) => (
            <div key={t} className="rounded-xl border bg-card p-6">
              <p className="font-display text-2xl italic text-primary">{["i.", "ii.", "iii.", "iv."][i]}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{d}</p>
              <h3 className="mt-2 text-xl">{t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{x}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="on-ink bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Start a conversation</p>
            <h2 className="text-4xl font-medium md:text-5xl">Your market. Your product. <em>Your timeline.</em></h2>
            <p className="mt-6 opacity-75">Tell us what you want to bring to India, or which EV category you want to enter. We will tell you which of our partners and playbooks fit, usually within one conversation.</p>
            <div className="mt-8 space-y-3 text-lg">
              <a className="block hover:text-teal" href="mailto:Team@evtripower.com">Team@evtripower.com</a>
              <a className="block hover:text-teal" href="tel:+919167007500">+91 91670 07500</a>
              <a className="block hover:text-teal" href="https://www.evtripower.com/">www.EVTripower.com</a>
            </div>
          </div>
          <EnquiryForm />
        </div>
        <p className="border-t border-ink-foreground/15 py-6 text-center text-xs opacity-60">© {new Date().getFullYear()} EVTripower Solutions</p>
      </section>
    </div>
  );
}

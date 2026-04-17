// redeploy after nextjs preset
"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, CalendarRange } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const monthly = [
  { month: "Abr", fullMonth: "Abril",      pdg: 18360000,    consumo: 26258928,  ejecutado: 143.02 },
  { month: "May", fullMonth: "Mayo",       pdg: 18640908,    consumo: 34740014,  ejecutado: 186.36 },
  { month: "Jun", fullMonth: "Junio",      pdg: 18941958.7,  consumo: 10804571,  ejecutado: 57.04  },
  { month: "Jul", fullMonth: "Julio",      pdg: 19245030,    consumo: 18807495,  ejecutado: 97.73  },
  { month: "Ago", fullMonth: "Agosto",     pdg: 19533705.5,  consumo: 24658827,  ejecutado: 126.24 },
  { month: "Sep", fullMonth: "Septiembre", pdg: 19826711,    consumo: 40771723,  ejecutado: 205.64 },
  { month: "Oct", fullMonth: "Octubre",    pdg: 20124111.7,  consumo: 51620308,  ejecutado: 256.51 },
  { month: "Nov", fullMonth: "Noviembre",  pdg: 20415911.3,  consumo: 27990487,  ejecutado: 137.10 },
  { month: "Dic", fullMonth: "Diciembre",  pdg: 20701734.1,  consumo: 26086287,  ejecutado: 126.01 },
  { month: "Ene", fullMonth: "Enero",      pdg: 20991558.4,  consumo: 36998924,  ejecutado: 176.26 },
  { month: "Feb", fullMonth: "Febrero",    pdg: 21285440.2,  consumo: 27044387,  ejecutado: 127.06 },
  { month: "Mar", fullMonth: "Marzo",      pdg: 21583436.3,  consumo: 72128903,  ejecutado: 334.19 },
];

const internalClients = [
  { month: "Abr", ing: 16892597.59, mant: 2811215.56 },
  { month: "May", ing: 14753145,    mant: 18734933   },
  { month: "Jun", ing: 7404591,     mant: 3399980    },
  { month: "Jul", ing: 15357616,    mant: 3449880    },
  { month: "Ago", ing: 20574298,    mant: 4084529    },
  { month: "Sep", ing: 20900483,    mant: 19871240   },
  { month: "Oct", ing: 35151506,    mant: 16468802   },
  { month: "Nov", ing: 21271861,    mant: 6723432    },
  { month: "Dic", ing: 7024450,     mant: 19102688   },
  { month: "Ene", ing: 8228858,     mant: 28770066   },
  { month: "Feb", ing: 9160554,     mant: 17883834   },
  { month: "Mar", ing: 16804799,    mant: 55324105   },
];

const monthlyBreakdown = {
  Abr: {
    summary: "Abril mostró un consumo relativamente equilibrado, con predominio de Ingeniería Clínica y un peso menor de Mantenimiento y otros.",
    topItems: [
      { name: "Filtro absoluto AT 61×61×15 cm", amount: 7125316.88, note: "Equipamiento técnico" },
      { name: "Cartel circular chapa galvanizada cochera", amount: 1100000.00, note: "Señalización" },
      { name: "Cascote picado / escombro", amount: 752840.01, note: "Construcción" },
      { name: "Adaptador cable ECG Schiller MS-12/FT-1", amount: 751647.81, note: "Instrumental médico" },
      { name: "Mango PNI adulto Philips M1574A", amount: 735040.74, note: "Instrumental médico" },
      { name: "Tensor de pared retráctil 5cm x 10m", amount: 673468.97, note: "Ferretería" },
    ],
    grouped: [
      { name: "Repuestos y refrig.", value: 7400715.81 },
      { name: "Ferretería",          value: 3672290.67 },
      { name: "Pinturas",            value: 3099402.43 },
      { name: "Electricidad",        value: 1755307.56 },
      { name: "Sanitarios",          value: 2281545.07 },
      { name: "Rep. Instrumental",   value: 2811215.56 },
      { name: "Mat. Construcción",   value: 2302341.30 },
      { name: "Otros",               value: 2936110.16 },
    ],
  },
  May: {
    summary: "En mayo se produjo uno de los primeros desvíos fuertes del ejercicio, con gran presión desde Rep. Instrumental médico que concentró más del 55% del total.",
    topItems: [
      { name: "Cable intermediario Masimo Radical 7", amount: 3304000.00, note: "Instrumental médico" },
      { name: "Máscara total face Philips Performax S", amount: 2363130.00, note: "Instrumental médico" },
      { name: "Máscara facial Philips Respironics Performax S", amount: 2363130.00, note: "Instrumental médico" },
      { name: "Cable intermediario PI Edwards Mindray", amount: 1514198.36, note: "Instrumental médico" },
      { name: "Cable calefactor Evaqua Fisher Paykel MR850", amount: 1487362.80, note: "Instrumental médico" },
      { name: "Cable sensor temperatura 900MR861", amount: 1426902.19, note: "Instrumental médico" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 18734933 },
      { name: "Rep. y Refrigeración",value: 5056074  },
      { name: "Electricidad",        value: 1819725  },
      { name: "Mat. Construcción",   value: 2486605  },
      { name: "Sanitarios",          value: 1561761  },
      { name: "Ferretería",          value: 2210199  },
      { name: "Otros",               value: 2870717  },
    ],
  },
  Jun: {
    summary: "Junio fue el único mes claramente por debajo del PDG. El nivel de gasto fue bajo y el ejercicio mostró una pausa operativa relativa.",
    topItems: [
      { name: "Lámpara Xenon Cermax ME300BF", amount: 1483000.00, note: "Instrumental médico" },
      { name: "Barral rebatible baño discapacitado Inox 70cm", amount: 1417500.00, note: "Sanitarios" },
      { name: "Cable intermediario Philips a Masimo DR Set", amount: 975450.00, note: "Instrumental médico" },
      { name: "Lámpara dicroica 12x100 Philips 409737", amount: 824000.00, note: "Electricidad" },
      { name: "Hidrolavadora inalámbrica Einhell 18V", amount: 496517.00, note: "Herramientas" },
      { name: "Accesorio depósito-baño discapacitado FV Ferrum", amount: 383489.28, note: "Sanitarios" },
    ],
    grouped: [
      { name: "Ferretería",          value: 2417829 },
      { name: "Electricidad",        value: 1549427 },
      { name: "Sanitarios",          value: 1204416 },
      { name: "Rep. Instrumental",   value: 2458450 + 941530 },
      { name: "Rep. y Refrigeración",value: 985766  },
      { name: "Herramientas",        value: 612441  },
      { name: "Otros",               value: 634702  },
    ],
  },
  Jul: {
    summary: "Julio mostró un repunte respecto a junio, aunque dentro de parámetros más razonables y con una distribución operativa habitual.",
    topItems: [
      { name: "Luminaria alumbrado público 150W Lumenac", amount: 2006503.20, note: "Electricidad" },
      { name: "Lámpara Xenon Osram XBO R 100W/45C", amount: 1290000.00, note: "Instrumental médico" },
      { name: "Silikote desmoldante 33%", amount: 905231.29, note: "Materiales de construcción" },
      { name: "Sensor SpO2 pediátrico M1192A", amount: 864647.42, note: "Instrumental médico" },
      { name: "Cascote picado / escombro", amount: 790500.01, note: "Construcción" },
      { name: "Atornilladora Bosch GSR 180 18V", amount: 766245.61, note: "Herramientas" },
    ],
    grouped: [
      { name: "Electricidad",        value: 4180277 },
      { name: "Rep. Instrumental",   value: 3449880 },
      { name: "Ferretería",          value: 3274872 },
      { name: "Mat. Construcción",   value: 1722885 },
      { name: "Sanitarios",          value: 1690220 },
      { name: "Maderas",             value: 1387526 },
      { name: "Otros",               value: 3101835 },
    ],
  },
  Ago: {
    summary: "Agosto combinó sobreejecución con egresos extraordinarios en construcción y sanitarios, con Ferretería y Mat. Construcción liderando el gasto.",
    topItems: [
      { name: "Weber Dur mortero reparador hormigón 25kg", amount: 3610002.48, note: "Materiales de construcción" },
      { name: "Mango PNI M1576A Philips", amount: 2148400.00, note: "Instrumental médico" },
      { name: "Barral rebatible baño discapacitado Inox 70cm", amount: 1516804.80, note: "Sanitarios" },
      { name: "Tensiometro de pared", amount: 949622.61, note: "Instrumental médico" },
      { name: "Terminal puntera Pawling medialuna beige 20cm", amount: 780000.00, note: "Ferretería" },
      { name: "Brazalete Welch Allyn reusable adulto 25-34cm", amount: 732487.00, note: "Instrumental médico" },
    ],
    grouped: [
      { name: "Ferretería",          value: 5316291 },
      { name: "Mat. Construcción",   value: 4612133 },
      { name: "Sanitarios",          value: 3254096 },
      { name: "Rep. Instrumental",   value: 3134907 + 949623 },
      { name: "Pinturas",            value: 1335188 },
      { name: "Electricidad",        value: 1970240 },
      { name: "Rep. y Refrigeración",value: 2188129 },
      { name: "Otros",               value: 2898220 },
    ],
  },
  Sep: {
    summary: "Septiembre marcó un salto fuerte en el ejercicio, con concentración en pantoscopios, sensores SpO2 y repuestos de Ingeniería Clínica.",
    topItems: [
      { name: "Pantoscopios Welch Allyn 77716 (de pared)", amount: 8109660.00, note: "Equip. de diagnóstico" },
      { name: "Sensor SpO2 adulto Philips M1191BL", amount: 6816239.67, note: "Instrumental médico" },
      { name: "Gas Oil Euro", amount: 2314373.32, note: "Combustible" },
      { name: "Lámpara Welch Allyn 03100", amount: 2115236.28, note: "Instrumental médico" },
      { name: "Extractor aire industrial 4\" conductos", amount: 1292152.07, note: "Infraestructura" },
      { name: "Multímetro Fluke 117", amount: 1027015.00, note: "Herramientas" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 11761580 },
      { name: "Equip. diagnóstico",  value: 8109660  },
      { name: "Rep. y Refrigeración",value: 5580546  },
      { name: "Mat. Construcción",   value: 3200612  },
      { name: "Sanitarios",          value: 3070520  },
      { name: "Electricidad",        value: 2295143  },
      { name: "Herramientas",        value: 1997961  },
      { name: "Combustible",         value: 2314373  },
      { name: "Otros",               value: 2441328  },
    ],
  },
  Oct: {
    summary: "Octubre fue el pico del ejercicio, impulsado por pantoscopios, manómetros y repuestos de alta complejidad técnica.",
    topItems: [
      { name: "Pantoscopios Welch Allyn 77716 (de pared)", amount: 5406440.00, note: "Equip. de diagnóstico" },
      { name: "Manómetro Dwyer Magnehelic 30/3/30 PA", amount: 4505010.05, note: "Instrumental médico" },
      { name: "Cable ECG 5 deriv. Philips M1973A", amount: 2519853.00, note: "Instrumental médico" },
      { name: "Latiguillo 5 derivaciones Mindray", amount: 1550241.40, note: "Instrumental médico" },
      { name: "Batería Nihon Kohden NKB-301V X065", amount: 1544250.00, note: "Instrumental médico" },
      { name: "Acrílico transparente 4mm 2,44x1,30m", amount: 1495080.00, note: "Materiales" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 11062362 },
      { name: "Rep. y Refrigeración",value: 6805887  },
      { name: "Equip. diagnóstico",  value: 5406440  },
      { name: "Ferretería",          value: 5432073  },
      { name: "Mat. Construcción",   value: 5676621  },
      { name: "Electricidad",        value: 5158692  },
      { name: "Maderas",             value: 4008563  },
      { name: "Herramientas",        value: 3510110  },
      { name: "Otros",               value: 9077560  },
    ],
  },
  Nov: {
    summary: "Noviembre mostró una baja relevante respecto a octubre, aunque siguió por encima del PDG. Pesaron combustible, filtros y adaptadores de señales.",
    topItems: [
      { name: "Gas Oil Euro", amount: 3576092.40, note: "Combustible" },
      { name: "Filtro permanganato de potasio 600x500x48mm", amount: 2266830.00, note: "Equipamiento técnico" },
      { name: "Adaptador cable ECG Schiller MS-12/FT-1", amount: 1524290.04, note: "Instrumental médico" },
      { name: "Electrodo ECG cable 1,5m copa oro Touch Proof", amount: 1430000.00, note: "Instrumental médico" },
      { name: "Sensor respiratorio abdominal Neurovirtual SM", amount: 1428840.00, note: "Instrumental médico" },
      { name: "Electrodo EEG cable 80cm Touch Proof Barra Roberto", amount: 1360000.00, note: "Instrumental médico" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 6755124 },
      { name: "Herramientas",        value: 4386280 },
      { name: "Rep. y Refrigeración",value: 4313119 },
      { name: "Combustible",         value: 3955492 },
      { name: "Electricidad",        value: 3540735 },
      { name: "Ferretería",          value: 3493380 },
      { name: "Sanitarios",          value: 1072730 },
      { name: "Otros",               value: 473627  },
    ],
  },
  Dic: {
    summary: "Desde diciembre se produce el cruce entre sectores: Mantenimiento y otros pasa a consumir más que Ingeniería Clínica, explicado por obras e infraestructura.",
    topItems: [
      { name: "Gas Oil Euro", amount: 2541234.29, note: "Combustible" },
      { name: "Cable Sintenax 5×25 IMSA-Pirelli", amount: 1674545.60, note: "Electricidad" },
      { name: "Sensor buconasal Neurovirtual SI1035 (neonatal)", amount: 1598400.00, note: "Instrumental médico" },
      { name: "Sensor respiratorio toracico Neurovirtual SI2123", amount: 1420800.00, note: "Instrumental médico" },
      { name: "Sensor buconasal Neurovirtual SI1262 (pediátrico)", amount: 1287600.00, note: "Instrumental médico" },
      { name: "Manómetro digital Value VDG-1", amount: 1125180.00, note: "Instrumental médico" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 7024450 },
      { name: "Electricidad",        value: 5393404 },
      { name: "Herramientas",        value: 3763920 },
      { name: "Combustible",         value: 3038837 },
      { name: "Sanitarios",          value: 2399308 },
      { name: "Ferretería",          value: 2431721 },
      { name: "Rep. y Refrigeración",value: 1498528 },
      { name: "Otros",               value: 536119  },
    ],
  },
  Ene: {
    summary: "Enero sostuvo la presión presupuestaria por materiales de obra, electricidad y construcción, consolidando el predominio de Mantenimiento y otros.",
    topItems: [
      { name: "Filtro aire Sun Pure (Air Filter Assembly UV)", amount: 6019200.00, note: "Equipamiento técnico" },
      { name: "Tosca x metro a granel", amount: 2454646.15, note: "Materiales de construcción" },
      { name: "Artefacto emergencia LED Atomlux 8091 dos faros", amount: 1921153.85, note: "Electricidad" },
      { name: "Cable Afumex Prysmian 4×6mm", amount: 1852500.00, note: "Electricidad" },
      { name: "Weber Dur mortero reparador hormigón 25kg", amount: 1832837.72, note: "Materiales de construcción" },
      { name: "Filtro H13 2424.12\" HEPA absolutos", amount: 1644461.95, note: "Equipamiento técnico" },
    ],
    grouped: [
      { name: "Rep. Instrumental",   value: 7572566 },
      { name: "Mat. Construcción",   value: 8114335 },
      { name: "Electricidad",        value: 7340338 },
      { name: "Sanitarios",          value: 3672020 },
      { name: "Rep. y Refrigeración",value: 3078318 },
      { name: "Ferretería",          value: 3606287 },
      { name: "Herramientas",        value: 1237070 },
      { name: "Equip. diagnóstico",  value: 656292  },
      { name: "Maderas",             value: 1579490 },
      { name: "Otros",               value: 142208  },
    ],
  },
  Feb: {
    summary: "Predominaron consumos ligados a equipamiento de diagnóstico, electricidad y sanitarios, con fuerte peso en Mantenimiento y otros.",
    topItems: [
      { name: "Pantoscopios Welch Allyn 77716 (de pared)", amount: 8114796.90, note: "Equip. de diagnóstico" },
      { name: "Rueda plástica hospitalaria Hofer Stilus 75mm", amount: 1894860.00, note: "Equipamiento hospitalario" },
      { name: "Weber Dur mortero reparador hormigón 25kg", amount: 1787011.20, note: "Materiales de construcción" },
      { name: "Inodoro vertedero Ferrum SVA-IN-014-BL", amount: 1401424.50, note: "Sanitarios" },
      { name: "Termómetro digital heladera TFA-LT102", amount: 1045756.63, note: "Instrumental médico" },
      { name: "Repartidor bornera bipolar 15 conexiones 125A", amount: 759599.10, note: "Electricidad" },
    ],
    grouped: [
      { name: "Equip. diagnóstico",  value: 8114797 },
      { name: "Electricidad",        value: 5453804 },
      { name: "Sanitarios",          value: 4113285 },
      { name: "Ferretería",          value: 3013483 },
      { name: "Mat. Construcción",   value: 1942231 },
      { name: "Rep. y Refrigeración",value: 2085516 },
      { name: "Rep. Instrumental",   value: 1045757 },
      { name: "Pinturas",            value: 581271  },
      { name: "Herramientas",        value: 694243  },
    ],
  },
  Mar: {
    summary: "Marzo concentró consumos extraordinarios vinculados a pantoscopios remanentes, estacionamiento, muebles y obra del pabellón Devoto.",
    topItems: [
      { name: "Pantoscopios Welch Allyn 77716 (de pared)", amount: 16229593.80, note: "Equip. de diagnóstico" },
      { name: "Tosca x metro a granel", amount: 8846400.00, note: "Estacionamiento" },
      { name: "Chapa hierro semilla melón 1/4", amount: 6713888.54, note: "Estacionamiento" },
      { name: "Chapa hierro semilla melón 5/8", amount: 1361390.00, note: "Estacionamiento" },
      { name: "Placa enchapado en cedro 25mm sobre MDF", amount: 1267320.00, note: "Muebles / Maderas" },
      { name: "Artefacto emergencia LED Atomlux 8091 dos faros", amount: 1140656.40, note: "Material eléctrico" },
    ],
    grouped: [
      { name: "Equip. diagnóstico",  value: 16229594 },
      { name: "Mat. Construcción",   value: 19151305 },
      { name: "Electricidad",        value: 9980943  },
      { name: "Rep. y Refrigeración",value: 8204128  },
      { name: "Herramientas",        value: 6679930  },
      { name: "Ferretería",          value: 4323958  },
      { name: "Maderas",             value: 3207189  },
      { name: "Pinturas",            value: 1217728  },
      { name: "Otros",               value: 3134128  },
    ],
  },
};

const monthConclusions = {
  Abr: "Abril mostró un inicio exigente del ejercicio, con predominio de consumos técnicos y un nivel ampliamente superior al PDG mensual, impulsado por filtros de alta temperatura y materiales de construcción.",
  May: "Mayo fue uno de los primeros meses con desvío fuerte, impulsado sobre todo por Rep. Instrumental médico que representó más del 55% del consumo total.",
  Jun: "Junio funcionó como un mes de alivio presupuestario, con consumo por debajo del PDG y una baja general de la actividad.",
  Jul: "Julio mostró un repunte respecto a junio, aunque dentro de parámetros más razonables y con una distribución operativa habitual.",
  Ago: "Agosto volvió a tensionar el presupuesto por egresos extraordinarios vinculados a infraestructura, ferretería y materiales de construcción.",
  Sep: "Septiembre marcó un salto importante, con fuerte peso de pantoscopios, sensores SpO2 e instrumental médico de alta complejidad.",
  Oct: "Octubre fue el pico del ejercicio, con adquisiciones extraordinarias y necesidades técnicas acumuladas que llevaron el consumo a su máximo hasta ese momento.",
  Nov: "Noviembre mostró una moderación respecto a octubre, aunque siguió por encima del PDG y con fuerte peso de combustible, herramientas y refrig.",
  Dic: "En diciembre comenzó a verse el cambio de patrón: Mantenimiento y otros pasó a explicar una mayor parte del consumo por obras e infraestructura.",
  Ene: "Enero sostuvo la presión presupuestaria por materiales de obra, electricidad y construcción, consolidando el predominio de Mantenimiento y otros.",
  Feb: "Febrero mantuvo un nivel alto de consumo, con protagonismo de equipamiento de diagnóstico, electricidad y sanitarios.",
  Mar: "Marzo cerró como el mes de mayor consumo del ejercicio, explicado por pantoscopios remanentes, materiales para estacionamiento, muebles y la obra eléctrica del pabellón Devoto.",
};

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

const totalPartida = 239650505.1;
const monthOrder   = monthly.map((m) => m.month);
const defaultMonth = "Feb";
const COLORS = ["#3b82f6","#ef4444","#f59e0b","#10b981","#8b5cf6","#14b8a6","#f97316","#ec4899","#a3e635"];

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (n) => `${n.toFixed(1)}%`;

function getReading(monthData) {
  if (monthData.ejecutado >= 130) return { label: "Muy por encima del PDG", cls: "badge-red"   };
  if (monthData.ejecutado >= 100) return { label: "Por encima del PDG",     cls: "badge-amber" };
  return                                 { label: "Dentro del PDG",         cls: "badge-green" };
}

/* ─── CUSTOM TOOLTIP ────────────────────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="recharts-custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="tooltip-row">
          {p.name}: {fmtMoney(Number(p.value))}
        </p>
      ))}
    </div>
  );
};

/* ─── PROGRESS BAR ──────────────────────────────────────────────────────── */

const ProgressBar = ({ value }) => {
  const pct = Math.min(value, 100);
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */

export default function DashboardConsumoInteractivo() {
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [open, setOpen] = useState(false);

  const selectedIndex    = monthOrder.indexOf(selectedMonth);
  const currentMonth     = monthly[selectedIndex];
  const currentClients   = internalClients[selectedIndex];
  const currentBreakdown = monthlyBreakdown[selectedMonth];
  const currentConclusion= monthConclusions[selectedMonth];

  const consumedToDate = useMemo(
    () => monthly.slice(0, selectedIndex + 1).reduce((a, r) => a + r.consumo, 0),
    [selectedIndex]
  );
  const pdgToDate = useMemo(
    () => monthly.slice(0, selectedIndex + 1).reduce((a, r) => a + r.pdg, 0),
    [selectedIndex]
  );

  const timeProgress = ((selectedIndex + 1) / 12) * 100;
  const pdgProgress  = (consumedToDate / totalPartida) * 100;
  const reading      = getReading(currentMonth);

  const visibleMonthly = monthly.slice(0, selectedIndex + 1);
  const visibleClients = internalClients.slice(0, selectedIndex + 1);

  const sectorShare = useMemo(() => {
    const total = (currentClients?.ing || 0) + (currentClients?.mant || 0);
    if (!total) return [];
    return [
      { name: "Ingeniería Clínica",    value: currentClients.ing  },
      { name: "Mantenimiento y otros", value: currentClients.mant },
    ];
  }, [currentClients]);

  return (
    <div className="dashboard-root">
      {/* ── HEADER ── */}
      <header className="dash-header">
        <div className="header-left">
          <span className="header-org">Depósito de Materiales SJ</span>
          <h1 className="header-title">Dashboard del ejercicio económico</h1>
          <p className="header-sub">Visualización ejecutiva para contrastar PDG, consumo real y ranking de egresos</p>
        </div>
        <div className="header-right">
          <label className="selector-label">Elegir mes</label>
          <div className="custom-select-wrapper">
            <button
              className="custom-select-trigger"
              onClick={() => setOpen(!open)}
              aria-haspopup="listbox"
            >
              <span>{currentMonth.fullMonth}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {open && (
              <ul className="custom-select-dropdown" role="listbox">
                {monthly.map((m) => (
                  <li
                    key={m.month}
                    role="option"
                    aria-selected={selectedMonth === m.month}
                    className={`custom-select-item${selectedMonth === m.month ? " selected" : ""}`}
                    onClick={() => { setSelectedMonth(m.month); setOpen(false); }}
                  >
                    {m.fullMonth}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* ── KPI CARDS ── */}
      <div className="grid-4">
        <div className="card">
          <div className="card-label">Mes seleccionado</div>
          <div className="card-value flex-row gap-sm">
            <CalendarRange size={20} className="icon-muted" />
            {currentMonth.fullMonth}
          </div>
          <div className="card-sub">Consumo del mes: {fmtMoney(currentMonth.consumo)}</div>
        </div>

        <div className="card">
          <div className="card-label">PDG del mes</div>
          <div className="card-value">{fmtMoney(currentMonth.pdg)}</div>
          <div className="card-sub">Ejecución: {fmtPct(currentMonth.ejecutado)}</div>
        </div>

        <div className="card">
          <div className="card-label">Acumulado al mes</div>
          <div className="card-value text-red">{fmtMoney(consumedToDate)}</div>
          <div className="card-sub">PDG acumulado: {fmtMoney(pdgToDate)}</div>
        </div>

        <div className="card">
          <div className="card-label">Lectura rápida</div>
          <span className={`badge ${reading.cls}`}>{reading.label}</span>
          <div className="flex-row gap-sm card-sub mt-sm">
            <AlertTriangle size={14} className="icon-amber" />
            {selectedMonth === "Mar" ? "Cierre crítico del ejercicio" : "Seguimiento mensual del desvío"}
          </div>
        </div>
      </div>

      {/* ── PROGRESS + NARRATIVE ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Avance del ejercicio</div>
          <div className="progress-block">
            <div className="progress-row">
              <span>Tiempo transcurrido</span>
              <span>{fmtPct(timeProgress)}</span>
            </div>
            <ProgressBar value={timeProgress} />
          </div>
          <div className="progress-block">
            <div className="progress-row">
              <span>PDG ejecutado sobre partida total</span>
              <span>{fmtPct(pdgProgress)}</span>
            </div>
            <ProgressBar value={pdgProgress} />
            <div className="progress-note">
              Comparación contra la partida anual total: {fmtMoney(totalPartida)}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Qué mirar en {currentMonth.fullMonth}</div>
          <p className="card-text">{currentBreakdown?.summary || "Sin lectura ejecutiva cargada para este mes."}</p>
          <p className="card-text">
            {selectedMonth === "Mar"
              ? "En este corte final se ve con claridad que el problema no fue un solo rubro, sino la combinación de obras, reposiciones técnicas y demanda interna variable."
              : "El objetivo es mostrar rápido qué explicó el consumo del mes y si se trató de algo puntual o de una tendencia más estructural."}
          </p>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">PDG vs Consumo mensual</div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleMonthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "13px", paddingTop: "12px" }} />
                <ReferenceLine x={selectedMonth} stroke="#e2e8f0" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Bar dataKey="pdg"     name="PDG"     fill="#3b82f6" radius={[4,4,0,0]} />
                <Bar dataKey="consumo" name="Consumo" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Ing. Clínica vs Mantenimiento y otros</div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleClients} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "13px", paddingTop: "12px" }} />
                <ReferenceLine x={selectedMonth} stroke="#e2e8f0" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Line type="monotone" dataKey="ing"  name="Ing. Clínica"  stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mant" name="Mant. y otros" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid-3">
        {/* Pie clientes */}
        <div className="card">
          <div className="card-title">Consumo por cliente interno · {currentMonth.fullMonth}</div>
          {sectorShare.length ? (
            <>
              <div className="pie-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorShare}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="client-list">
                <div className="client-item">
                  <span className="dot dot-blue" />
                  <div>
                    <div className="client-name">Ingeniería Clínica</div>
                    <div className="client-amt">{fmtMoney(currentClients.ing || 0)}</div>
                  </div>
                </div>
                <div className="client-item">
                  <span className="dot dot-red" />
                  <div>
                    <div className="client-name">Mantenimiento y otros</div>
                    <div className="client-amt">{fmtMoney(currentClients.mant || 0)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Sin información de clientes internos para este mes.</div>
          )}
        </div>

        {/* Ranking */}
        <div className="card">
          <div className="card-title">{currentMonth.fullMonth} · ranking de egresos más relevantes</div>
          {currentBreakdown?.topItems ? (
            <div className="ranking-list">
              {currentBreakdown.topItems.map((item, idx) => (
                <div key={idx} className="ranking-item">
                  <span className="ranking-num">{idx + 1}</span>
                  <div className="ranking-info">
                    <div className="ranking-name">{item.name}</div>
                    <div className="ranking-note">{item.note}</div>
                  </div>
                  <div className="ranking-amt">{fmtMoney(item.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Sin ranking cargado para este mes.</div>
          )}
        </div>

        {/* Pie rubros */}
        <div className="card">
          <div className="card-title">Qué explicó {currentMonth.fullMonth}</div>
          {currentBreakdown?.grouped ? (
            <div className="pie-container-lg">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentBreakdown.grouped}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {currentBreakdown.grouped.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">Sin agrupación cargada para este mes.</div>
          )}
        </div>
      </div>

      {/* ── CONCLUSIÓN ── */}
      <div className="card conclusion-card">
        <div className="card-title">Conclusión</div>
        <p className="conclusion-text">{currentConclusion}</p>
      </div>
    </div>
  );
}

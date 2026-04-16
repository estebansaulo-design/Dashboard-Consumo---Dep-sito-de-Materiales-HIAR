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
  { month: "Abr", fullMonth: "Abril",      pdg: 18360000,    consumo: 19703813,  ejecutado: 107.32 },
  { month: "May", fullMonth: "Mayo",       pdg: 18640908,    consumo: 34740014,  ejecutado: 186.36 },
  { month: "Jun", fullMonth: "Junio",      pdg: 18941958.7,  consumo: 10804571,  ejecutado: 57.04  },
  { month: "Jul", fullMonth: "Julio",      pdg: 19245030,    consumo: 18807495,  ejecutado: 97.73  },
  { month: "Ago", fullMonth: "Agosto",     pdg: 19533705.5,  consumo: 24658827,  ejecutado: 126.24 },
  { month: "Sep", fullMonth: "Septiembre", pdg: 19826711,    consumo: 40771723,  ejecutado: 205.64 },
  { month: "Oct", fullMonth: "Octubre",    pdg: 20124111.7,  consumo: 51620308,  ejecutado: 256.51 },
  { month: "Nov", fullMonth: "Noviembre",  pdg: 20415911.3,  consumo: 27995293,  ejecutado: 137.12 },
  { month: "Dic", fullMonth: "Diciembre",  pdg: 20701734.1,  consumo: 26127138,  ejecutado: 126.21 },
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
      { name: "Ingeniería Clínica",    amount: 16892597.59, note: "Reposiciones y soporte técnico" },
      { name: "Mantenimiento y otros", amount: 2811215.56,  note: "Operación general" },
    ],
    grouped: [
      { name: "Ingeniería Clínica",    value: 16892597.59 },
      { name: "Mantenimiento y otros", value: 2811215.56  },
    ],
  },
  May: {
    summary: "En mayo se produjo uno de los primeros desvíos fuertes del ejercicio, con gran presión desde Mantenimiento y otros y un consumo ampliamente superior al PDG mensual.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 18734933, note: "Mayor peso mensual" },
      { name: "Ingeniería Clínica",    amount: 14753145, note: "Demanda técnica"    },
    ],
    grouped: [
      { name: "Ingeniería Clínica",    value: 14753145 },
      { name: "Mantenimiento y otros", value: 18734933 },
    ],
  },
  Jun: {
    summary: "Junio fue el único mes claramente por debajo del PDG. El nivel de gasto fue bajo y el ejercicio mostró una pausa operativa relativa.",
    topItems: [
      { name: "Ingeniería Clínica",    amount: 7404591, note: "Reposiciones puntuales" },
      { name: "Mantenimiento y otros", amount: 3399980, note: "Mínimo operativo"       },
    ],
    grouped: [
      { name: "Ingeniería Clínica",    value: 7404591 },
      { name: "Mantenimiento y otros", value: 3399980 },
    ],
  },
  Jul: {
    summary: "Julio mostró un repunte respecto a junio, aunque dentro de parámetros más razonables y con una distribución operativa habitual.",
    topItems: [
      { name: "Electricidad",             amount: 4180277, note: "22,2% del mes" },
      { name: "Rep. Instrumental médico", amount: 3449880, note: "18,3% del mes" },
      { name: "Ferretería",               amount: 3277585, note: "17,4% del mes" },
    ],
    grouped: [
      { name: "Electricidad",     value: 4180277 },
      { name: "Rep. instrumental",value: 3449880 },
      { name: "Ferretería",       value: 3277585 },
      { name: "Otros",            value: 18807495 - 4180277 - 3449880 - 3277585 },
    ],
  },
  Ago: {
    summary: "Agosto combinó sobreejecución con egresos extraordinarios en construcción, especialmente vinculados a la reparación de veredas.",
    topItems: [
      { name: "Materiales de construcción", amount: 6156858, note: "Reparación de veredas" },
      { name: "Rep. Instrumental médico",   amount: 4084530, note: "16,6% del mes"         },
      { name: "Ferretería",                 amount: 3810054, note: "15,5% del mes"          },
      { name: "Sanitarios",                 amount: 3244455, note: "13,2% del mes"          },
    ],
    grouped: [
      { name: "Construcción",    value: 6156858 },
      { name: "Rep. instrumental",value: 4084530 },
      { name: "Ferretería",      value: 3810054 },
      { name: "Sanitarios",      value: 3244455 },
      { name: "Otros",           value: 24658827 - 6156858 - 4084530 - 3810054 - 3244455 },
    ],
  },
  Sep: {
    summary: "Septiembre marcó un salto fuerte en el ejercicio, con concentración en repuestos de Ingeniería Clínica y equipamiento de diagnóstico.",
    topItems: [
      { name: "Rep. Instrumental médico",   amount: 11761580, note: "27,5% del mes" },
      { name: "Equip. de diagnóstico",      amount: 8109660,  note: "18,9% del mes" },
      { name: "Rep. varios y refrigeración",amount: 5354230,  note: "12,5% del mes" },
    ],
    grouped: [
      { name: "Rep. instrumental", value: 11761580 },
      { name: "Equip. diagnóstico",value: 8109660  },
      { name: "Refrigeración",     value: 5354230  },
      { name: "Otros",             value: 40771723 - 11761580 - 8109660 - 5354230 },
    ],
  },
  Oct: {
    summary: "Octubre fue el pico del ejercicio, impulsado por adquisiciones extraordinarias de alto costo y necesidades técnicas acumuladas.",
    topItems: [
      { name: "Rep. Instrumental médico",   amount: 11062362, note: "21,4% del mes"      },
      { name: "Rep. varios y refrigeración",amount: 6805887,  note: "13,2% del mes"      },
      { name: "Equip. de diagnóstico",      amount: 5406440,  note: "10,5% del mes"      },
      { name: "Ferretería",                 amount: 5432073,  note: "Alto peso operativo" },
      { name: "Mat. construcción",          amount: 5676621,  note: "Obras y mantenimiento"},
    ],
    grouped: [
      { name: "Rep. instrumental", value: 11062362 },
      { name: "Refrigeración",     value: 6805887  },
      { name: "Equip. diagnóstico",value: 5406440  },
      { name: "Ferretería",        value: 5432073  },
      { name: "Construcción",      value: 5676621  },
      { name: "Otros",             value: 51620308 - 11062362 - 6805887 - 5406440 - 5432073 - 5676621 },
    ],
  },
  Nov: {
    summary: "Noviembre mostró una baja relevante respecto a octubre, aunque siguió por encima del PDG. Pesaron herramientas, refrigeración y combustible.",
    topItems: [
      { name: "Rep. Instrumental médico",   amount: 6755124, note: "24,1% del mes"  },
      { name: "Herramientas",               amount: 4386280, note: "15,7% del mes"  },
      { name: "Rep. varios y refrigeración",amount: 4307289, note: "15,4% del mes"  },
      { name: "Combustible",                amount: 3955492, note: "Consumo puntual" },
      { name: "Electricidad",               amount: 3551371, note: "12,7% del mes"  },
    ],
    grouped: [
      { name: "Rep. instrumental", value: 6755124 },
      { name: "Herramientas",      value: 4386280 },
      { name: "Refrigeración",     value: 4307289 },
      { name: "Combustible",       value: 3955492 },
      { name: "Electricidad",      value: 3551371 },
      { name: "Otros",             value: 27995293 - 6755124 - 4386280 - 4307289 - 3955492 - 3551371 },
    ],
  },
  Dic: {
    summary: "Desde diciembre se produce el cruce entre sectores: Mantenimiento y otros pasa a consumir más que Ingeniería Clínica, explicado por obras e infraestructura.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 19102688, note: "Inicio del cambio de tendencia" },
      { name: "Ingeniería Clínica",    amount: 7024450,  note: "Menor peso relativo"           },
    ],
    grouped: [
      { name: "Mantenimiento y otros", value: 19102688 },
      { name: "Ingeniería Clínica",    value: 7024450  },
    ],
  },
  Ene: {
    summary: "Enero sostuvo la presión presupuestaria por materiales de obra, electricidad y construcción, consolidando el predominio de Mantenimiento y otros.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 28770066, note: "Predominio por obras e infraestructura" },
      { name: "Ingeniería Clínica",    amount: 8228858,  note: "Recambio técnico puntual"              },
    ],
    grouped: [
      { name: "Mantenimiento y otros", value: 28770066 },
      { name: "Ingeniería Clínica",    value: 8228858  },
    ],
  },
  Feb: {
    summary: "Predominaron consumos ligados a mantenimiento general, reposición de repuestos y soporte operativo hospitalario.",
    topItems: [
      { name: "Equip. de diagnóstico",      amount: 8114797, note: "Equipamiento hospitalario" },
      { name: "Electricidad",               amount: 5458135, note: "Materiales eléctricos"     },
      { name: "Sanitarios",                 amount: 4113285, note: "Mantenimiento edilicio"    },
      { name: "Ferretería",                 amount: 3013483, note: "Reparaciones generales"    },
      { name: "Rep. varios y refrigeración",amount: 2081186, note: "Climatización y soporte"   },
    ],
    grouped: [
      { name: "Equip. diagnóstico", value: 8114797 },
      { name: "Electricidad",       value: 5458135 },
      { name: "Sanitarios",         value: 4113285 },
      { name: "Ferretería",         value: 3013483 },
      { name: "Otros",              value: 6274487 },
    ],
  },
  Mar: {
    summary: "Marzo concentró consumos extraordinarios vinculados a pantoscopios remanentes, estacionamiento, muebles y obra del pabellón Devoto.",
    topItems: [
      { name: "Pantoscopios de pared",         amount: 16229594, note: "Recambio remanente"   },
      { name: "Tosca a granel",                amount: 8846400,  note: "Estacionamiento"      },
      { name: "Chapa semilla melón 1/4",       amount: 6713889,  note: "Estacionamiento"      },
      { name: "Chapa semilla melón 5/8",       amount: 1361390,  note: "Estacionamiento"      },
      { name: "Placa enchapado en cedro 25mm", amount: 1267320,  note: "Muebles"              },
      { name: "Placa enchapado en cedro 18mm", amount: 1050000,  note: "Muebles"              },
      { name: "Artefacto emergencia LED",      amount: 1140656,  note: "Material eléctrico"   },
      { name: "Gabinete tablero",              amount: 1101293,  note: "Pabellón Devoto"      },
      { name: "Amoladora inalámbrica",         amount: 1005177,  note: "Herramientas"         },
    ],
    grouped: [
      { name: "Pantoscopios",       value: 16229594 },
      { name: "Estacionamiento",    value: 16921789 },
      { name: "Maderas / muebles",  value: 2317320  },
      { name: "Mat. eléctricos",    value: 2241949  },
      { name: "Herramientas",       value: 1005177  },
    ],
  },
};

const monthConclusions = {
  Abr: "Abril mostró un inicio exigente del ejercicio, con predominio de consumos técnicos y un nivel apenas superior al PDG mensual.",
  May: "Mayo fue uno de los primeros meses con desvío fuerte, impulsado sobre todo por Ingeniería Clínica y una demanda alta de repuestos específicos.",
  Jun: "Junio funcionó como un mes de alivio presupuestario, con consumo por debajo del PDG y una baja general de la actividad.",
  Jul: "Julio mostró un repunte respecto a junio, aunque dentro de parámetros más razonables y con una distribución operativa habitual.",
  Ago: "Agosto volvió a tensionar el presupuesto por egresos extraordinarios vinculados a infraestructura y materiales de construcción.",
  Sep: "Septiembre marcó un salto importante, con fuerte peso de instrumental médico y equipamiento de diagnóstico.",
  Oct: "Octubre fue el pico del ejercicio, con adquisiciones extraordinarias y necesidades técnicas acumuladas que llevaron el consumo a su máximo hasta ese momento.",
  Nov: "Noviembre mostró una moderación respecto a octubre, aunque siguió por encima del PDG y con fuerte peso de herramientas, refrigeración y combustible.",
  Dic: "En diciembre comenzó a verse el cambio de patrón: Mantenimiento y otros pasó a explicar una mayor parte del consumo por obras e infraestructura.",
  Ene: "Enero sostuvo la presión presupuestaria por materiales de obra, electricidad y construcción, consolidando el predominio de Mantenimiento y otros.",
  Feb: "Febrero mantuvo un nivel alto de consumo, con protagonismo de equipamiento de diagnóstico, electricidad y sanitarios.",
  Mar: "Marzo cerró como el mes de mayor consumo del ejercicio, explicado por pantoscopios remanentes, materiales para estacionamiento, muebles y la obra eléctrica del pabellón Devoto.",
};

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

const totalPartida = 239650505.1;
const monthOrder   = monthly.map((m) => m.month);
const defaultMonth = "Feb";
const COLORS = ["#3b82f6","#ef4444","#f59e0b","#10b981","#8b5cf6","#14b8a6","#f97316"];

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (n) => `${n.toFixed(1)}%`;

function getReading(monthData) {
  if (monthData.ejecutado >= 130) return { label: "Muy por encima del PDG", cls: "badge-red"    };
  if (monthData.ejecutado >= 100) return { label: "Por encima del PDG",     cls: "badge-amber"  };
  return                                 { label: "Dentro del PDG",         cls: "badge-green"  };
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

const ProgressBar = ({ value, max = 100 }) => {
  const pct = Math.min((value / max) * 100, 100);
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

  const selectedIndex   = monthOrder.indexOf(selectedMonth);
  const currentMonth    = monthly[selectedIndex];
  const currentClients  = internalClients[selectedIndex];
  const currentBreakdown= monthlyBreakdown[selectedMonth];
  const currentConclusion = monthConclusions[selectedMonth];

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
                <Line type="monotone" dataKey="ing"  name="Ing. Clínica"    stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mant" name="Mant. y otros"   stroke="#ef4444" strokeWidth={2.5} dot={false} />
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

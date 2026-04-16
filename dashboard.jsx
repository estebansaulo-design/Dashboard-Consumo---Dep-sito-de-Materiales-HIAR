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

const monthly = [
  { month: "Abr", fullMonth: "Abril", pdg: 18360000, consumo: 19703813, ejecutado: 107.32 },
  { month: "May", fullMonth: "Mayo", pdg: 18640908, consumo: 34740014, ejecutado: 186.36 },
  { month: "Jun", fullMonth: "Junio", pdg: 18941958.7, consumo: 10804571, ejecutado: 57.04 },
  { month: "Jul", fullMonth: "Julio", pdg: 19245030, consumo: 18807495, ejecutado: 97.73 },
  { month: "Ago", fullMonth: "Agosto", pdg: 19533705.5, consumo: 24658827, ejecutado: 126.24 },
  { month: "Sep", fullMonth: "Septiembre", pdg: 19826711, consumo: 40771723, ejecutado: 205.64 },
  { month: "Oct", fullMonth: "Octubre", pdg: 20124111.7, consumo: 51620308, ejecutado: 256.51 },
  { month: "Nov", fullMonth: "Noviembre", pdg: 20415911.3, consumo: 27995293, ejecutado: 137.12 },
  { month: "Dic", fullMonth: "Diciembre", pdg: 20701734.1, consumo: 26127138, ejecutado: 126.21 },
  { month: "Ene", fullMonth: "Enero", pdg: 20991558.4, consumo: 36998924, ejecutado: 176.26 },
  { month: "Feb", fullMonth: "Febrero", pdg: 21285440.2, consumo: 27044387, ejecutado: 127.06 },
  { month: "Mar", fullMonth: "Marzo", pdg: 21583436.3, consumo: 72128903, ejecutado: 334.19 },
];

const internalClients = [
  { month: "Abr", ing: 16892597.59, mant: 2811215.56 },
  { month: "May", ing: 14753145, mant: 18734933 },
  { month: "Jun", ing: 7404591, mant: 3399980 },
  { month: "Jul", ing: 15357616, mant: 3449880 },
  { month: "Ago", ing: 20574298, mant: 4084529 },
  { month: "Sep", ing: 20900483, mant: 19871240 },
  { month: "Oct", ing: 35151506, mant: 16468802 },
  { month: "Nov", ing: 21271861, mant: 6723432 },
  { month: "Dic", ing: 7024450, mant: 19102688 },
  { month: "Ene", ing: 8228858, mant: 28770066 },
  { month: "Feb", ing: 9160554, mant: 17883834 },
  { month: "Mar", ing: 16804799, mant: 55324105 },
];

const monthlyBreakdown = {
  Abr: {
    summary:
      "Abril mostró un consumo relativamente equilibrado, con predominio de Ingeniería Clínica y un peso menor de Mantenimiento y otros.",
    topItems: [
      { name: "Ingeniería Clínica", amount: 16892597.59, note: "Reposiciones y soporte técnico" },
      { name: "Mantenimiento y otros", amount: 2811215.56, note: "Operación general" },
    ],
    grouped: [
      { name: "Ingeniería Clínica", value: 16892597.59 },
      { name: "Mantenimiento y otros", value: 2811215.56 },
    ],
  },
  May: {
    summary:
      "En mayo se produjo uno de los primeros desvíos fuertes del ejercicio, con gran presión desde Mantenimiento y otros y un consumo ampliamente superior al PDG mensual.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 18734933, note: "Mayor peso mensual" },
      { name: "Ingeniería Clínica", amount: 14753145, note: "Demanda técnica" },
    ],
    grouped: [
      { name: "Ingeniería Clínica", value: 14753145 },
      { name: "Mantenimiento y otros", value: 18734933 },
    ],
  },
  Jun: {
    summary:
      "Junio fue el único mes claramente por debajo del PDG. El nivel de gasto fue bajo y el ejercicio mostró una pausa operativa relativa.",
    topItems: [
      { name: "Ingeniería Clínica", amount: 7404591, note: "Reposiciones puntuales" },
      { name: "Mantenimiento y otros", amount: 3399980, note: "Mínimo operativo" },
    ],
    grouped: [
      { name: "Ingeniería Clínica", value: 7404591 },
      { name: "Mantenimiento y otros", value: 3399980 },
    ],
  },
  Jul: {
    summary:
      "Julio mostró un repunte respecto a junio, aunque dentro de parámetros más razonables y con una distribución operativa habitual.",
    topItems: [
      { name: "Electricidad", amount: 4180277, note: "22,2% del mes" },
      { name: "Rep. Instrumental médico", amount: 3449880, note: "18,3% del mes" },
      { name: "Ferretería", amount: 3277585, note: "17,4% del mes" },
    ],
    grouped: [
      { name: "Electricidad", value: 4180277 },
      { name: "Rep. Instrumental médico", value: 3449880 },
      { name: "Ferretería", value: 3277585 },
      { name: "Otros", value: 18807495 - 4180277 - 3449880 - 3277585 },
    ],
  },
  Ago: {
    summary:
      "Agosto combinó sobreejecución con egresos extraordinarios en construcción, especialmente vinculados a la reparación de veredas.",
    topItems: [
      { name: "Materiales de construcción", amount: 6156858, note: "Reparación de veredas" },
      { name: "Rep. Instrumental médico", amount: 4084530, note: "16,6% del mes" },
      { name: "Ferretería", amount: 3810054, note: "15,5% del mes" },
      { name: "Sanitarios", amount: 3244455, note: "13,2% del mes" },
    ],
    grouped: [
      { name: "Construcción", value: 6156858 },
      { name: "Rep. instrumental", value: 4084530 },
      { name: "Ferretería", value: 3810054 },
      { name: "Sanitarios", value: 3244455 },
      { name: "Otros", value: 24658827 - 6156858 - 4084530 - 3810054 - 3244455 },
    ],
  },
  Sep: {
    summary:
      "Septiembre marcó un salto fuerte en el ejercicio, con concentración en repuestos de Ingeniería Clínica y equipamiento de diagnóstico.",
    topItems: [
      { name: "Rep. Instrumental médico", amount: 11761580, note: "27,5% del mes" },
      { name: "Equip. de diagnóstico", amount: 8109660, note: "18,9% del mes" },
      { name: "Rep. varios y refrigeración", amount: 5354230, note: "12,5% del mes" },
    ],
    grouped: [
      { name: "Rep. instrumental", value: 11761580 },
      { name: "Equip. diagnóstico", value: 8109660 },
      { name: "Refrigeración", value: 5354230 },
      { name: "Otros", value: 40771723 - 11761580 - 8109660 - 5354230 },
    ],
  },
  Oct: {
    summary:
      "Octubre fue el pico del ejercicio, impulsado por adquisiciones extraordinarias de alto costo y necesidades técnicas acumuladas.",
    topItems: [
      { name: "Rep. Instrumental médico", amount: 11062362, note: "21,4% del mes" },
      { name: "Rep. varios y refrigeración", amount: 6805887, note: "13,2% del mes" },
      { name: "Equip. de diagnóstico", amount: 5406440, note: "10,5% del mes" },
      { name: "Ferretería", amount: 5432073, note: "Alto peso operativo" },
      { name: "Mat. construcción", amount: 5676621, note: "Obras y mantenimiento" },
    ],
    grouped: [
      { name: "Rep. instrumental", value: 11062362 },
      { name: "Refrigeración", value: 6805887 },
      { name: "Equip. diagnóstico", value: 5406440 },
      { name: "Ferretería", value: 5432073 },
      { name: "Construcción", value: 5676621 },
      { name: "Otros", value: 51620308 - 11062362 - 6805887 - 5406440 - 5432073 - 5676621 },
    ],
  },
  Nov: {
    summary:
      "Noviembre mostró una baja relevante respecto a octubre, aunque siguió por encima del PDG. Pesaron herramientas, refrigeración y combustible.",
    topItems: [
      { name: "Rep. Instrumental médico", amount: 6755124, note: "24,1% del mes" },
      { name: "Herramientas", amount: 4386280, note: "15,7% del mes" },
      { name: "Rep. varios y refrigeración", amount: 4307289, note: "15,4% del mes" },
      { name: "Combustible", amount: 3955492, note: "Consumo puntual" },
      { name: "Electricidad", amount: 3551371, note: "12,7% del mes" },
    ],
    grouped: [
      { name: "Rep. instrumental", value: 6755124 },
      { name: "Herramientas", value: 4386280 },
      { name: "Refrigeración", value: 4307289 },
      { name: "Combustible", value: 3955492 },
      { name: "Electricidad", value: 3551371 },
      { name: "Otros", value: 27995293 - 6755124 - 4386280 - 4307289 - 3955492 - 3551371 },
    ],
  },
  Dic: {
    summary:
      "Desde diciembre se produce el cruce entre sectores: Mantenimiento y otros pasa a consumir más que Ingeniería Clínica, explicado por obras e infraestructura.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 19102688, note: "Inicio del cambio de tendencia" },
      { name: "Ingeniería Clínica", amount: 7024450, note: "Menor peso relativo" },
    ],
    grouped: [
      { name: "Mantenimiento y otros", value: 19102688 },
      { name: "Ingeniería Clínica", value: 7024450 },
    ],
  },
  Ene: {
    summary:
      "Enero sostuvo la presión presupuestaria por materiales de obra, electricidad y construcción, consolidando el predominio de Mantenimiento y otros.",
    topItems: [
      { name: "Mantenimiento y otros", amount: 28770066, note: "Predominio por obras e infraestructura" },
      { name: "Ingeniería Clínica", amount: 8228858, note: "Recambio técnico puntual" },
    ],
    grouped: [
      { name: "Mantenimiento y otros", value: 28770066 },
      { name: "Ingeniería Clínica", value: 8228858 },
    ],
  },
  Feb: {
    summary:
      "Predominaron consumos ligados a mantenimiento general, reposición de repuestos y soporte operativo hospitalario.",
    topItems: [
      { name: "Equip. de diagnóstico", amount: 8114797, note: "Equipamiento hospitalario" },
      { name: "Electricidad", amount: 5458135, note: "Materiales eléctricos" },
      { name: "Sanitarios", amount: 4113285, note: "Mantenimiento edilicio" },
      { name: "Ferretería", amount: 3013483, note: "Reparaciones generales" },
      { name: "Rep. varios y refrigeración", amount: 2081186, note: "Climatización y soporte" },
    ],
    grouped: [
      { name: "Equip. diagnóstico", value: 8114797 },
      { name: "Electricidad", value: 5458135 },
      { name: "Sanitarios", value: 4113285 },
      { name: "Ferretería", value: 3013483 },
      { name: "Otros", value: 6274487 },
    ],
  },
  Mar: {
    summary:
      "Marzo concentró consumos extraordinarios vinculados a pantoscopios remanentes, estacionamiento, muebles y obra del pabellón Devoto.",
    topItems: [
      { name: "Pantoscopios de pared", amount: 16229594, note: "Recambio remanente" },
      { name: "Tosca a granel", amount: 8846400, note: "Estacionamiento" },
      { name: "Chapa semilla melón 1/4", amount: 6713889, note: "Estacionamiento" },
      { name: "Chapa semilla melón 5/8", amount: 1361390, note: "Estacionamiento" },
      { name: "Placa enchapado en cedro 25mm", amount: 1267320, note: "Muebles" },
      { name: "Placa enchapado en cedro 18mm", amount: 1050000, note: "Muebles" },
      { name: "Artefacto emergencia LED", amount: 1140656, note: "Material eléctrico" },
      { name: "Gabinete tablero", amount: 1101293, note: "Pabellón Devoto" },
      { name: "Amoladora inalámbrica", amount: 1005177, note: "Herramientas" },
    ],
    grouped: [
      { name: "Pantoscopios", value: 16229594 },
      { name: "Estacionamiento", value: 16921789 },
      { name: "Maderas / muebles", value: 2317320 },
      { name: "Materiales eléctricos", value: 2241949 },
      { name: "Herramientas", value: 1005177 },
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

const totalPartida = 239650505.1;
const monthOrder = monthly.map((m) => m.month);
const defaultMonth = "Feb";
const COLORS = ["#2563eb", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#14b8a6", "#f97316"];

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (n) => `${n.toFixed(1)}%`;

function buildProgress(selectedIndex) {
  return ((selectedIndex + 1) / 12) * 100;
}

function getReading(monthData) {
  if (monthData.ejecutado >= 130) return { label: "Muy por encima del PDG", tone: "#dc2626", text: "#ffffff" };
  if (monthData.ejecutado >= 100) return { label: "Por encima del PDG", tone: "#f59e0b", text: "#111827" };
  return { label: "Dentro del PDG", tone: "#16a34a", text: "#ffffff" };
}

function Card({ title, children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 1px 3px rgba(15,23,42,0.12), 0 1px 2px rgba(15,23,42,0.06)",
        border: "1px solid #e2e8f0",
        ...style,
      }}
    >
      {title && (
        <div style={{ padding: "18px 18px 0 18px", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{title}</div>
      )}
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const selectedIndex = monthOrder.indexOf(selectedMonth);
  const currentMonth = monthly[selectedIndex];
  const currentClients = internalClients[selectedIndex];
  const currentBreakdown = monthlyBreakdown[selectedMonth];
  const currentConclusion = monthConclusions[selectedMonth];

  const consumedToDate = useMemo(
    () => monthly.slice(0, selectedIndex + 1).reduce((acc, row) => acc + row.consumo, 0),
    [selectedIndex]
  );

  const pdgToDate = useMemo(
    () => monthly.slice(0, selectedIndex + 1).reduce((acc, row) => acc + row.pdg, 0),
    [selectedIndex]
  );

  const timeProgress = buildProgress(selectedIndex);
  const pdgProgress = (consumedToDate / totalPartida) * 100;
  const reading = getReading(currentMonth);
  const visibleMonthly = monthly.slice(0, selectedIndex + 1);
  const visibleClients = internalClients.slice(0, selectedIndex + 1);

  const sectorShare = useMemo(() => {
    const total = (currentClients?.ing || 0) + (currentClients?.mant || 0);
    if (!total) return [];
    return [
      { name: "Ingeniería Clínica", value: currentClients.ing },
      { name: "Mantenimiento y otros", value: currentClients.mant },
    ];
  }, [currentClients]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Depósito de Materiales SJ</div>
            <h1 style={{ margin: "6px 0 4px 0", fontSize: 34, lineHeight: 1.1 }}>Dashboard del ejercicio económico</h1>
            <p style={{ margin: 0, color: "#64748b" }}>
              Visualización ejecutiva para contrastar PDG, consumo real y ranking de egresos
            </p>
          </div>

          <div style={{ minWidth: 240 }}>
            <div style={{ fontSize: 14, color: "#475569", marginBottom: 8, fontWeight: 600 }}>Elegir mes</div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#fff",
                fontSize: 15,
              }}
            >
              {monthly.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.fullMonth}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <Card title="Mes seleccionado">
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 800 }}>
              <CalendarRange size={22} color="#64748b" />
              {currentMonth.fullMonth}
            </div>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>Consumo del mes: {fmtMoney(currentMonth.consumo)}</div>
          </Card>

          <Card title="PDG del mes">
            <div style={{ fontSize: 28, fontWeight: 800 }}>{fmtMoney(currentMonth.pdg)}</div>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>Ejecución: {fmtPct(currentMonth.ejecutado)}</div>
          </Card>

          <Card title="Acumulado al mes">
            <div style={{ fontSize: 28, fontWeight: 800, color: "#dc2626" }}>{fmtMoney(consumedToDate)}</div>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>PDG acumulado: {fmtMoney(pdgToDate)}</div>
          </Card>

          <Card title="Lectura rápida">
            <div
              style={{
                display: "inline-block",
                background: reading.tone,
                color: reading.text,
                padding: "8px 12px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {reading.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 14 }}>
              <AlertTriangle size={16} color="#f59e0b" />
              {selectedMonth === "Mar" ? "Cierre crítico del ejercicio" : "Seguimiento mensual del desvío"}
            </div>
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          }}
        >
          <Card title="Avance del ejercicio">
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>Tiempo transcurrido</span>
                <span>{fmtPct(timeProgress)}</span>
              </div>
              <div style={{ width: "100%", height: 16, background: "#e2e8f0", borderRadius: 999 }}>
                <div
                  style={{
                    width: `${timeProgress}%`,
                    height: "100%",
                    background: "#2563eb",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>PDG ejecutado sobre partida total</span>
                <span>{fmtPct(pdgProgress)}</span>
              </div>
              <div style={{ width: "100%", height: 16, background: "#e2e8f0", borderRadius: 999 }}>
                <div
                  style={{
                    width: `${Math.min(pdgProgress, 100)}%`,
                    height: "100%",
                    background: "#dc2626",
                    borderRadius: 999,
                  }}
                />
              </div>
              <div style={{ marginTop: 8, color: "#64748b", fontSize: 12 }}>
                Comparación contra la partida anual total: {fmtMoney(totalPartida)}
              </div>
            </div>
          </Card>

          <Card title={`Qué mirar en ${currentMonth.fullMonth}`}>
            <p style={{ marginTop: 0, color: "#334155", lineHeight: 1.65 }}>
              {currentBreakdown?.summary || "Sin lectura ejecutiva cargada para este mes."}
            </p>
            <p style={{ marginBottom: 0, color: "#64748b", lineHeight: 1.65 }}>
              {selectedMonth === "Mar"
                ? "En este corte final se ve con claridad que el problema no fue un solo rubro, sino la combinación de obras, reposiciones técnicas y demanda interna variable."
                : "El objetivo es mostrar rápido qué explicó el consumo del mes y si se trató de algo puntual o de una tendencia más estructural."}
            </p>
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          }}
        >
          <Card title="PDG vs Consumo mensual">
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visibleMonthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
                  <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                  <Legend />
                  <ReferenceLine x={selectedMonth} stroke="#0f172a" strokeDasharray="4 4" />
                  <Bar dataKey="pdg" name="PDG" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="consumo" name="Consumo" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Ing. Clínica vs Mantenimiento y otros">
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleClients}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
                  <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                  <Legend />
                  <ReferenceLine x={selectedMonth} stroke="#0f172a" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="ing" name="Ing. Clínica" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="mant" name="Mant. y otros" stroke="#ef4444" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          <Card title={`Consumo por cliente interno · ${currentMonth.fullMonth}`}>
            {sectorShare.length ? (
              <>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorShare}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={85}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2563eb" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                    <div style={{ fontWeight: 700 }}>Ingeniería Clínica</div>
                    <div style={{ color: "#64748b", marginTop: 4 }}>{fmtMoney(currentClients.ing || 0)}</div>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                    <div style={{ fontWeight: 700 }}>Mantenimiento y otros</div>
                    <div style={{ color: "#64748b", marginTop: 4 }}>{fmtMoney(currentClients.mant || 0)}</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "#64748b" }}>Sin información de clientes internos para este mes.</div>
            )}
          </Card>

          <Card title={`${currentMonth.fullMonth} · ranking de egresos más relevantes`}>
            {currentBreakdown?.topItems ? (
              <div style={{ display: "grid", gap: 12 }}>
                {currentBreakdown.topItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: 14,
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.note}</div>
                    </div>
                    <div style={{ fontWeight: 800 }}>{fmtMoney(item.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>Sin ranking cargado para este mes.</div>
            )}
          </Card>

          <Card title={`Qué explicó ${currentMonth.fullMonth}`}>
            {currentBreakdown?.grouped ? (
              <div style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentBreakdown.grouped}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={130}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentBreakdown.grouped.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmtMoney(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>Sin agrupación cargada para este mes.</div>
            )}
          </Card>
        </div>

        <Card title="Conclusión sugerida para presentar">
          <p style={{ margin: 0, lineHeight: 1.8, color: "#334155" }}>{currentConclusion}</p>
        </Card>
      </div>
    </div>
  );
}

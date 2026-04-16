import DashboardConsumoInteractivo from "../dashboard";

export const metadata = {
  title: "Dashboard del Ejercicio Económico | Depósito de Materiales SJ",
  description: "Visualización ejecutiva para contrastar PDG, consumo real y ranking de egresos.",
};

export default function Page() {
  return <DashboardConsumoInteractivo />;
}

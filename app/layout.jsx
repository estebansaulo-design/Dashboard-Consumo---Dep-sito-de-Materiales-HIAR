export const metadata = {
  title: "Dashboard Consumo",
  description: "Informe interactivo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
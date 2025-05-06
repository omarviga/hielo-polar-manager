import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Dashboard } from './pages/Dashboard';  // Cambiado a named import
import Clientes from './pages/Clientes';    // Cambiado a default import
import Conservadores from './pages/Conservadores';
import { MantenimientoPage } from './pages/Mantenimiento';
import { Reportes } from './pages/Reportes';
import QRCode from './pages/QRCode';
import Reparaciones from './pages/Repairs'; // Cambiado a default import
import { EstadisticasPage } from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/conservadores" element={<Conservadores />} />
            <Route path="/mantenimiento" element={<MantenimientoPage />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
            <Route path="/reparaciones" element={<Reparaciones />} />
            <Route path="/qr" element={<QRCode />} />
          </Route>
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
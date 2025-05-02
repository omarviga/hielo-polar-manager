import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Dashboard } from '@/pages/Dashboard'
import { ClientesPage } from '@/pages/ClientesPage'
import { ConservadoresPage } from '@/pages/ConservadoresPage'
import { OrdenesServicioPage } from '@/pages/OrdenesServicioPage'
import { MantenimientoPage } from '@/pages/MantenimientoPage'
import { ReportesPage } from '@/pages/ReportesPage'
import QRCode from '@/pages/QRCode';
import { EstadisticasPage } from '@/pages/EstadisticasPage'
import { ConfiguracionPage } from '@/pages/ConfiguracionPage'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/conservadores" element={<ConservadoresPage />} />
            <Route path="/ordenes-servicio" element={<OrdenesServicioPage />} />
            <Route path="/mantenimiento" element={<MantenimientoPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
            <Route path="/qr" element={<QRCode />} /> {/* Nueva ruta */}
          </Route>
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
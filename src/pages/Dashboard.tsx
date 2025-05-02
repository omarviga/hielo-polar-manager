
import { Package, Users, Tool, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { LocationMap } from "@/components/dashboard/LocationMap";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Conservadores"
          value="120"
          description="En servicio actualmente"
          icon={Package}
          iconColor="text-hielo-600"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Clientes"
          value="42"
          description="Con conservadores asignados"
          icon={Users}
          iconColor="text-hielo-700"
        />
        <StatsCard
          title="Mantenimientos"
          value="8"
          description="Pendientes este mes"
          icon={Tool}
          iconColor="text-amber-500"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Rendimiento"
          value="93.5%"
          description="Promedio de eficiencia"
          icon={TrendingUp}
          iconColor="text-green-600"
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentActivity />
        <div className="space-y-4">
          <StatusChart />
          <LocationMap />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Activos", value: 85, color: "#0ea5e9" },
  { name: "Mantenimiento", value: 10, color: "#f59e0b" },
  { name: "Inactivos", value: 5, color: "#ef4444" },
];

export function StatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Conservadores</CardTitle>
        <CardDescription>Distribución actual de conservadores por estado</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} conservadores`, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

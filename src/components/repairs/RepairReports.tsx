
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { toast } from "@/components/ui/use-toast";

const RepairReports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2025');

  // Monthly repair data for different years
  const repairData = {
    '2023': [
      { name: 'Ene', value: 10 },
      { name: 'Feb', value: 12 },
      { name: 'Mar', value: 15 },
      { name: 'Abr', value: 11 },
      { name: 'May', value: 14 },
      { name: 'Jun', value: 18 }
    ],
    '2024': [
      { name: 'Ene', value: 13 },
      { name: 'Feb', value: 15 },
      { name: 'Mar', value: 16 },
      { name: 'Abr', value: 19 },
      { name: 'May', value: 20 },
      { name: 'Jun', value: 24 }
    ],
    '2025': [
      { name: 'Ene', value: 15 },
      { name: 'Feb', value: 20 },
      { name: 'Mar', value: 18 },
      { name: 'Abr', value: 25 },
      { name: 'May', value: 22 },
      { name: 'Jun', value: 30 }
    ]
  };

  // Repair type data is consistent across years
  const repairTypeData = [
    { name: 'Fuga de gas', value: 35 },
    { name: 'Motor', value: 28 },
    { name: 'Temperatura', value: 20 },
    { name: 'Puertas', value: 15 },
    { name: 'Otros', value: 12 }
  ];

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    toast({
      title: "Año actualizado",
      description: `Mostrando datos del año ${year}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reparaciones por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72">
              <AreaChart
                data={repairData[selectedYear as keyof typeof repairData]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} órdenes`, 'Cantidad']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reparaciones por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72">
              <BarChart
                data={repairTypeData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} órdenes`, 'Cantidad']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">85</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Órdenes Completadas
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">18</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Órdenes Pendientes
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">3.5</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Promedio días por reparación
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepairReports;

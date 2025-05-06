
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, Clock, CheckCircle } from "lucide-react";
import NewRepairOrder from '@/components/repairs/NewRepairOrder';
import ActiveRepairOrders from '@/components/repairs/ActiveRepairOrders';
import Technicians from '@/components/repairs/Technicians';
import RepairReports from '@/components/repairs/RepairReports';

const Repairs: React.FC = () => {
  const [showNewOrderForm, setShowNewOrderForm] = React.useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reparaciones</h1>
        <Button
          onClick={() => setShowNewOrderForm(true)}
          className="bg-polar-600 hover:bg-polar-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      <Tabs defaultValue="active-orders" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="active-orders">Órdenes Activas</TabsTrigger>
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="active-orders">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Activas</CardTitle>
              <CardDescription>
                Visualice y gestione las órdenes de reparación activas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  <TabsTrigger value="in-progress">En Progreso</TabsTrigger>
                  <TabsTrigger value="completed">Terminadas</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <ActiveRepairOrders status="pending" />
                </TabsContent>

                <TabsContent value="in-progress">
                  <ActiveRepairOrders status="in-progress" />
                </TabsContent>

                <TabsContent value="completed">
                  <ActiveRepairOrders status="completed" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <CardTitle>Técnicos</CardTitle>
              <CardDescription>
                Gestione los técnicos y su disponibilidad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Technicians />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>
                Reportes y estadísticas de reparaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepairReports />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Reparaciones</CardTitle>
              <CardDescription>
                Consulte el historial completo de reparaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveRepairOrders status="all" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showNewOrderForm && (
        <NewRepairOrder onClose={() => setShowNewOrderForm(false)} />
      )}
    </div>
  );
};

export default Repairs;

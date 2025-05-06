
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, User, Eye } from "lucide-react";

interface ActiveRepairOrdersProps {
  status: 'pending' | 'in-progress' | 'completed' | 'all';
}

const ActiveRepairOrders: React.FC<ActiveRepairOrdersProps> = ({ status }) => {
  // Mock data - in a real app, this would come from an API
  const orders = [
    {
      id: 'REP-20250401-0001',
      clientName: 'Restaurante Los Sabores',
      equipmentType: 'Conservador',
      dateCreated: '2025-04-01',
      status: 'pending',
      priority: 'high',
      technician: null
    },
    {
      id: 'REP-20250331-0002',
      clientName: 'Hotel Marina Bay',
      equipmentType: 'Refrigerador Industrial',
      dateCreated: '2025-03-31',
      status: 'in-progress',
      priority: 'medium',
      technician: 'Carlos Mendez'
    },
    {
      id: 'REP-20250330-0003',
      clientName: 'Supermercado Central',
      equipmentType: 'Conservador',
      dateCreated: '2025-03-30',
      status: 'completed',
      priority: 'low',
      technician: 'Ana Ruiz'
    },
    {
      id: 'REP-20250329-0004',
      clientName: 'Cafetería El Rincón',
      equipmentType: 'Refrigerador',
      dateCreated: '2025-03-29',
      status: 'pending',
      priority: 'medium',
      technician: null
    },
    {
      id: 'REP-20250328-0005',
      clientName: 'Heladería Frosty',
      equipmentType: 'Conservador',
      dateCreated: '2025-03-28',
      status: 'in-progress',
      priority: 'high',
      technician: 'Miguel Torres'
    }
  ];

  // Filter orders based on status prop
  const filteredOrders = status === 'all'
    ? orders
    : orders.filter(order => order.status === status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendiente</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Terminada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Media</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Baja</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar órdenes..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden #</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.equipmentType}</TableCell>
                  <TableCell>{order.dateCreated}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>
                    {order.technician || (
                      <Badge variant="outline" className="bg-gray-100">
                        Sin asignar
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!order.technician && (
                        <Button variant="ghost" size="icon">
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No hay órdenes de reparación para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActiveRepairOrders;

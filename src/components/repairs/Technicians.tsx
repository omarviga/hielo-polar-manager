
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash } from "lucide-react";

const Technicians: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const technicians = [
    {
      id: '1',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@example.com',
      phone: '555-1234',
      specialization: 'Conservadores',
      status: 'available',
      assignedOrders: 2,
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Ana Ruiz',
      email: 'ana.ruiz@example.com',
      phone: '555-5678',
      specialization: 'Refrigeración Industrial',
      status: 'busy',
      assignedOrders: 4,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Miguel Torres',
      email: 'miguel.torres@example.com',
      phone: '555-9012',
      specialization: 'Conservadores, Refrigeradores',
      status: 'unavailable',
      assignedOrders: 0,
      avatar: '/placeholder.svg'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Disponible</Badge>;
      case 'busy':
        return <Badge className="bg-yellow-500">Ocupado</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-500">No Disponible</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  return (
    <Tabs defaultValue="list">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="list">Registro</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
        </TabsList>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Técnico
        </Button>
      </div>

      <TabsContent value="list">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Técnico</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialización</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Órdenes Asignadas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((tech) => (
                <TableRow key={tech.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={tech.avatar} alt={tech.name} />
                        <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{tech.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{tech.email}</div>
                      <div>{tech.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{tech.specialization}</TableCell>
                  <TableCell>{getStatusBadge(tech.status)}</TableCell>
                  <TableCell>{tech.assignedOrders}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="availability">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <Card key={tech.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={tech.avatar} alt={tech.name} />
                    <AvatarFallback className="text-lg">{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{tech.name}</h3>
                  <p className="text-muted-foreground text-sm">{tech.specialization}</p>
                  <div className="mt-2">{getStatusBadge(tech.status)}</div>

                  <div className="mt-4 w-full">
                    <h4 className="font-medium text-sm mb-2">Órdenes Asignadas: {tech.assignedOrders}</h4>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Ver Órdenes</Button>
                      <Button size="sm" className="flex-1">
                        {tech.status === 'available' ? 'Asignar Orden' : 'Cambiar Estado'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Technicians;

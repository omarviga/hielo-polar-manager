
import React, { useState } from "react";
import { QrCodeGenerator } from "@/components/qr/QrCodeGenerator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanQrCode } from "lucide-react";

const QRCode = () => {
  const [conservadorId, setConservadorId] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleGenerate = () => {
    if (conservadorId) {
      // In a real app, this would include a proper URL to your application
      // For example: https://yourdomain.com/conservador/123
      setQrValue(`https://hielopolar.com/conservador/${conservadorId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Códigos QR</h1>
      </div>

      <Tabs defaultValue="generar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generar">Generar QR</TabsTrigger>
          <TabsTrigger value="lote">Generación por Lote</TabsTrigger>
        </TabsList>

        <TabsContent value="generar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generar Código QR</CardTitle>
                <CardDescription>
                  Ingrese el ID del conservador para generar un código QR único
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conservador-id">ID del Conservador</Label>
                  <Input
                    id="conservador-id"
                    placeholder="Ej. C1234"
                    value={conservadorId}
                    onChange={(e) => setConservadorId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={!conservadorId}
                >
                  Generar QR
                </Button>
              </CardContent>
            </Card>

            {qrValue && (
              <Card>
                <CardHeader>
                  <CardTitle>Código QR Generado</CardTitle>
                  <CardDescription>
                    Conservador #{conservadorId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <QrCodeGenerator value={qrValue} size={200} />
                  <div className="flex gap-2">
                    <Button onClick={() => window.print()}>Imprimir</Button>
                    <Button variant="outline" onClick={() => {
                      // In a real app, we would use a library to download the QR code as an image
                      alert("Funcionalidad de descarga implementada aquí");
                    }}>
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lote">
          <Card>
            <CardHeader>
              <CardTitle>Generación por Lote</CardTitle>
              <CardDescription>
                Genere códigos QR para múltiples conservadores a la vez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <ScanQrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Generación por Lote</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Esta funcionalidad permite generar códigos QR para múltiples conservadores a la vez.
                  </p>
                  <div className="mt-4">
                    <Button>Seleccionar Conservadores</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCode;

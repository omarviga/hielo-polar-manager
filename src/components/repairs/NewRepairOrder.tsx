
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface NewRepairOrderProps {
  onClose: () => void;
}

const NewRepairOrder: React.FC<NewRepairOrderProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    equipmentType: '',
    serialNumber: '',
    model: '',
    brand: '',
    problems: [] as string[],
    description: '',
    photos: [] as File[]
  });

  const commonProblems = [
    { id: 'gas-leak', label: 'Fuga de gas' },
    { id: 'motor-not-working', label: 'Motor no enciende' },
    { id: 'temperature-issues', label: 'Problemas de temperatura' },
    { id: 'door-issues', label: 'Problemas con la puerta' },
    { id: 'noise', label: 'Ruido excesivo' },
    { id: 'liquid-leak', label: 'Fuga de líquido' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProblemChange = (checked: boolean, problem: string) => {
    setFormData(prev => ({
      ...prev,
      problems: checked 
        ? [...prev.problems, problem]
        : prev.problems.filter(p => p !== problem)
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.equipmentType) {
        toast({
          title: "Información incompleta",
          description: "Por favor complete los campos obligatorios.",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = () => {
    // Here would go the API call to create the repair order
    toast({
      title: "Orden creada",
      description: "La orden de reparación ha sido creada exitosamente.",
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Reparación</DialogTitle>
          <DialogDescription>
            Complete los detalles para crear una nueva orden de reparación.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={`step-${step}`} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="step-1" 
              onClick={() => step > 1 && setStep(1)}
              disabled={false}
            >
              Datos del Cliente/Equipo
            </TabsTrigger>
            <TabsTrigger 
              value="step-2" 
              disabled={step < 2}
            >
              Detalles de Reparación
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="step-1" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <Input 
                    id="clientName" 
                    name="clientName" 
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Ingrese nombre del cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input 
                    id="clientPhone" 
                    name="clientPhone" 
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="Ingrese teléfono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input 
                  id="clientEmail" 
                  name="clientEmail" 
                  type="email" 
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="Ingrese email"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentType">Tipo de Equipo *</Label>
                  <Input 
                    id="equipmentType" 
                    name="equipmentType" 
                    value={formData.equipmentType}
                    onChange={handleChange}
                    placeholder="Ej: Conservador, Refrigerador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input 
                    id="brand" 
                    name="brand" 
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Marca del equipo"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input 
                    id="model" 
                    name="model" 
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Modelo del equipo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Número de Serie</Label>
                  <Input 
                    id="serialNumber" 
                    name="serialNumber" 
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="Número de serie del equipo"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="step-2" className="space-y-4 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Problemas Comunes</Label>
                <div className="grid grid-cols-2 mt-2 gap-2">
                  {commonProblems.map(problem => (
                    <div className="flex items-center space-x-2" key={problem.id}>
                      <Checkbox 
                        id={problem.id} 
                        checked={formData.problems.includes(problem.label)} 
                        onCheckedChange={(checked) => handleProblemChange(!!checked, problem.label)}
                      />
                      <label
                        htmlFor={problem.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {problem.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción Detallada</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describa el problema en detalle"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photos">Fotos del Equipo</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Input 
                    id="photos" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handlePhotoUpload}
                  />
                  {formData.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Preview ${index}`} 
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {step === 2 && (
            <Button variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
          {step === 1 ? (
            <Button onClick={nextStep}>Siguiente</Button>
          ) : (
            <Button onClick={handleSubmit}>Crear Orden</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRepairOrder;

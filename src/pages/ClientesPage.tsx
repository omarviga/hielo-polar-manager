import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Asegúrate de tener configurado Supabase

export function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener clientes desde Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from("clientes").select("*");
      if (error) {
        console.error("Error al obtener clientes:", error);
      } else {
        setClientes(data);
      }
    };
    fetchClientes();
  }, []);

  // Agregar un nuevo cliente
  const handleAddCliente = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .insert([{ nombre, email, telefono }]);
    setLoading(false);

    if (error) {
      console.error("Error al agregar cliente:", error);
    } else {
      setClientes((prev) => [...prev, ...data]);
      setNombre("");
      setEmail("");
      setTelefono("");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      {/* Formulario para agregar cliente */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddCliente}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Agregando..." : "Agregar Cliente"}
          </button>
        </div>
      </div>

      {/* Lista de clientes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="border border-gray-300 px-4 py-2">{cliente.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{cliente.email}</td>
                <td className="border border-gray-300 px-4 py-2">{cliente.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
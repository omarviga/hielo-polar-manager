
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-4">
        <div className="bg-hielo-100 p-6 rounded-full inline-flex items-center justify-center">
          <h1 className="text-6xl font-bold text-hielo-600">404</h1>
        </div>
        <h2 className="text-2xl font-bold">Página no encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">
            Regresar al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

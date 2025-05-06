
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | string | null;
  label: string;
  className?: string;
  variant?: "default" | "image";
  placeholder?: string;
}

export function FileUpload({
  accept = "*/*",
  onChange,
  value,
  label,
  className = "",
  variant = "default",
  placeholder = "Seleccionar archivo...",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [fileName, setFileName] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      
      if (variant === "image" && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFileName(null);
      setPreviewUrl(null);
    }
    
    onChange(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div>
        <p className="text-sm font-medium mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="flex-1"
          >
            {variant === "image" ? (
              <ImageIcon className="h-4 w-4 mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {fileName || (typeof value === "string" && value) 
              ? variant === "image" 
                ? "Cambiar imagen" 
                : "Cambiar archivo" 
              : placeholder}
          </Button>
          
          {(fileName || (typeof value === "string" && value)) && variant !== "image" && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => window.open(
                typeof value === "string" ? value : URL.createObjectURL(value as File), 
                "_blank"
              )}
            >
              <File className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {variant === "image" && previewUrl && (
          <div className="mt-2">
            <div className="rounded-md overflow-hidden border w-24 h-24">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {fileName && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
}

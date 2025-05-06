import React from "react";

interface FileInputProps {
  id: string;
  name: string;
  label: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  name,
  label,
  accept,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor={id} className="text-right">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={onChange}
        className="col-span-3"
      />
    </div>
  );
};
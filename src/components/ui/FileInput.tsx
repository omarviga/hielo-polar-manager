import React from "react";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, ...props }) => {
  return (
    <div className="file-input">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        {...props}
      />
    </div>
  );
};

export default FileInput;

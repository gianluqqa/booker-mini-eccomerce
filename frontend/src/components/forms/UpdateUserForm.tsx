"use client";

import React from "react";

export interface UpdateUserFormData {
  name: string;
  surname: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
}

interface UpdateUserFormProps {
  value: UpdateUserFormData;
  onChange: (data: UpdateUserFormData) => void;
  onSubmit: (data: UpdateUserFormData) => Promise<void> | void;
  onCancel: () => void;
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  errorMessage,
  isSubmitting,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: fieldValue } = event.target;
    onChange({ ...value, [name]: fieldValue });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={value.name}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Apellido</label>
          <input
            type="text"
            name="surname"
            value={value.surname}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={value.phone}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">País</label>
          <input
            type="text"
            name="country"
            value={value.country}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Ciudad</label>
          <input
            type="text"
            name="city"
            value={value.city}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Dirección</label>
          <input
            type="text"
            name="address"
            value={value.address}
            onChange={handleInputChange}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#f5efe1] mb-1">Biografía</label>
          <textarea
            name="bio"
            value={value.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-lg px-3 py-2 bg-white text-[#2e4b30] placeholder:text-[#9fb2a0] focus:outline-none focus:ring-2 focus:ring-[#f5efe1]"
          />
        </div>
      </div>
      {errorMessage && <p className="text-sm text-red-200">{errorMessage}</p>}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white text-[#2e4b30] font-semibold"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#f5efe1] text-[#2e4b30] font-semibold hover:bg-white transition-colors disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUserForm;

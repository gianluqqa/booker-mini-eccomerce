"use client";

import React, { useState } from "react";
import { IBook, IUpdateBook } from "@/types/Book";
import { updateBookAdmin } from "@/services/adminService";
import { Loader2, X } from "lucide-react";
import { AdminToast } from "../alerts/AdminToast";

interface UpdateBookProps {
  book: IBook;
  onClose: () => void;
  onUpdated: () => void;
}

const UpdateBook: React.FC<UpdateBookProps> = ({ book, onClose, onUpdated }) => {
  const [formData, setFormData] = useState<IUpdateBook>({
    id: book.id || "",
    title: book.title,
    author: book.author,
    price: book.price,
    stock: book.stock,
    image: book.image,
    genre: book.genre,
    intro: book.intro,
    description: book.description,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.id) {
      setError("El libro no tiene un ID válido");
      return;
    }

    const payload: IUpdateBook = {
      id: formData.id,
      title: formData.title?.trim(),
      author: formData.author?.trim(),
      image: formData.image?.trim(),
      genre: formData.genre,
      description: formData.description,
      intro: formData.intro,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      setSubmitting(true);
      const result = await updateBookAdmin(formData.id, payload);
      setSuccessMessage(result.message || "Libro actualizado correctamente.");
      await onUpdated();
      // Opcional: cerrar automáticamente después de un corto tiempo
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      let message = "No se pudo actualizar el libro";
      if (typeof err === "object" && err !== null) {
        const e = err as { message?: string; validationErrors?: string | string[] };
        if (e.validationErrors) {
          message = typeof e.validationErrors === "string"
            ? e.validationErrors
            : e.validationErrors.join(", ");
        } else if (e.message) {
          message = e.message;
        }
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#2e4b30]">Editar libro</h2>
            <p className="text-xs text-gray-600">Modifica los campos y guarda los cambios.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <AdminToast 
          type="error"
          title="Error al actualizar" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {successMessage && (
        <AdminToast 
          type="success"
          title="¡Éxito!" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="author">
              Autor
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author || ""}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="price">
              Precio (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="stock">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="image">
            URL de imagen
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image || ""}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="genre">
            Género
          </label>
          <input
            id="genre"
            name="genre"
            type="text"
            value={formData.genre || ""}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="intro">
            Introducción
          </label>
          <textarea
            id="intro"
            name="intro"
            value={formData.intro || ""}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2e4b30] focus:border-[#2e4b30] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-sm text-xs font-medium bg-[#2e4b30] text-[#f5efe1] hover:bg-[#1a3a1c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </span>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBook;

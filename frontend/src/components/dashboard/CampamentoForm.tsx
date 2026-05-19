import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Image as ImageIcon, Upload } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { campamentoService } from "../../services/campamento.service";
import { api } from "../../services/api";
import type {
  Campamento,
  CreateCampamentoDto,
  UpdateCampamentoDto,
} from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";
import RichTextEditor from "../ui/RichTextEditor";
import LocationAutocomplete from "../ui/LocationAutocomplete";
import { getThumbnailUrl } from "../../utils/imageUtils";

export default function CampamentoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateCampamentoDto>({
    name: "",
    description: "",
    images: [],
    startDate: "",
    endDate: "",
    price: 0,
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: campamento, execute: loadCampamento } = useApi<Campamento>();

  useEffect(() => {
    if (id) {
      loadCampamento(() => campamentoService.getById(parseInt(id)));
    }
  }, [id, loadCampamento]);

  useEffect(() => {
    if (campamento && isEditing) {
      setFormData({
        name: campamento.name,
        description: campamento.description || "",
        images: campamento.images || [],
        startDate: new Date(campamento.startDate).toISOString().split("T")[0],
        endDate: new Date(campamento.endDate).toISOString().split("T")[0],
        price: campamento.price,
        location: campamento.location,
      });
    }
  }, [campamento, isEditing]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Tipo de archivo no permitido" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "El archivo es demasiado grande (máx 5MB)" }));
      return;
    }

    setUploadingImage(true);
    setErrors((prev) => ({ ...prev, image: "" }));

    try {
      const result = await api.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), result.url],
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: "Error al subir la imagen" }));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es requerida";
      isValid = false;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate =
        "La fecha de fin debe ser posterior a la fecha de inicio";
      isValid = false;
    }

    if (formData.price < 0) {
      newErrors.price = "El precio no puede ser negativo";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (isEditing && id) {
        const updateDto: UpdateCampamentoDto = formData;
        await campamentoService.update(parseInt(id), updateDto);
      } else {
        await campamentoService.create(formData);
      }
      navigate("/dashboard");
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? "Editar Campamento" : "Crear Nuevo Campamento"}
          </h2>
          <p className="text-slate-600">
            {isEditing
              ? "Actualiza la información"
              : "Completa los detalles para crear un nuevo campamento"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              type="text"
              placeholder="Ej: Campamento de Verano 2026"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={loading}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripción
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Imágenes
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              {uploadingImage ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  Subiendo imagen...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Seleccionar imagen desde tu ordenador
                </>
              )}
            </button>
            {errors.image && (
              <p className="mt-1.5 text-sm text-red-600 mb-2">{errors.image}</p>
            )}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getThumbnailUrl(url)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300?text=Imagen+no+disponible";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {(!formData.images || formData.images.length === 0) && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg text-slate-400">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Agrega URLs de imágenes</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Fecha de inicio"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              disabled={loading}
              required
            />

            <Input
              label="Fecha de fin"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              disabled={loading}
              min={formData.startDate}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Precio (ARS)"
              type="number"
              placeholder="0.00"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              error={errors.price}
              disabled={loading}
              min="0"
              step="0.01"
              required
            />

            <LocationAutocomplete
              value={formData.location}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, location: value }))
              }
              error={errors.location}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 inline-flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              {isEditing ? "Guardar Cambios" : "Crear Campamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

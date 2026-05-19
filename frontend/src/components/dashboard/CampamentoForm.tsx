import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, ImageIcon, Upload, ChevronLeft, Tent } from "lucide-react";
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
    {children}
  </p>
);

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
    if (id) loadCampamento(() => campamentoService.getById(parseInt(id)));
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
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((p) => ({ ...p, image: "Tipo de archivo no permitido" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        image: "El archivo es demasiado grande (máx 5MB)",
      }));
      return;
    }
    setUploadingImage(true);
    setErrors((p) => ({ ...p, image: "" }));
    try {
      const result = await api.uploadFile(file);
      setFormData((p) => ({ ...p, images: [...(p.images || []), result.url] }));
    } catch {
      setErrors((p) => ({ ...p, image: "Error al subir la imagen" }));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) =>
    setFormData((p) => ({
      ...p,
      images: p.images?.filter((_, i) => i !== index),
    }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3)
      e.name = "Mínimo 3 caracteres";
    if (!formData.startDate) e.startDate = "Requerido";
    if (!formData.endDate) e.endDate = "Requerido";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    )
      e.endDate = "Debe ser posterior a la fecha de inicio";
    if (formData.price < 0) e.price = "No puede ser negativo";
    if (!formData.location.trim()) e.location = "Requerido";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing && id)
        await campamentoService.update(
          parseInt(id),
          formData as UpdateCampamentoDto,
        );
      else await campamentoService.create(formData);
      navigate("/dashboard");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Tent className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {isEditing ? "Editar" : "Nuevo campamento"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Editar campamento" : "Crear nuevo campamento"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isEditing
              ? "Actualizá la información del campamento"
              : "Completá los detalles para publicar un nuevo campamento"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── BASIC INFO ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SectionLabel>Información básica</SectionLabel>
            <div className="space-y-5">
              <Input
                label="Nombre del campamento"
                type="text"
                placeholder="Ej: Campamento de Verano 2026"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                disabled={loading}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((p) => ({ ...p, description: value }))
                  }
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── DATES & PRICE ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SectionLabel>Fechas y precio</SectionLabel>
            <div className="grid md:grid-cols-2 gap-5">
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
                  setFormData((p) => ({ ...p, location: value }))
                }
                error={errors.location}
                disabled={loading}
              />
            </div>
          </div>

          {/* ── IMAGES ── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SectionLabel>Imágenes</SectionLabel>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full py-5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-2 mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadingImage ? (
                <>
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  <span className="text-sm font-medium">
                    Subiendo imagen...
                  </span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">
                      Seleccionar imagen
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JPG, PNG o WebP · Máx 5MB
                    </p>
                  </div>
                </>
              )}
            </button>

            {errors.image && (
              <p className="text-sm text-red-600 mb-3">{errors.image}</p>
            )}

            {/* Image grid */}
            {formData.images && formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100"
                  >
                    <img
                      src={getThumbnailUrl(url)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300?text=Error";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                <ImageIcon className="h-6 w-6 mb-1.5" />
                <p className="text-xs">Aún no hay imágenes</p>
              </div>
            )}
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
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
              <Save className="h-4 w-4" />
              {isEditing ? "Guardar cambios" : "Publicar campamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

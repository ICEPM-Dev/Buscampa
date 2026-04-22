import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { campamentoService } from "../../services/campamento.service";
import type {
  Campamento,
  CreateCampamentoDto,
  UpdateCampamentoDto,
} from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CampamentoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateCampamentoDto>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    price: 0,
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
        startDate: new Date(campamento.startDate).toISOString().split("T")[0],
        endDate: new Date(campamento.endDate).toISOString().split("T")[0],
        price: campamento.price,
        location: campamento.location,
      });
    }
  }, [campamento, isEditing]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    <div className="max-w-3xl mx-auto">
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
            <textarea
              name="description"
              placeholder="Describe las actividades, requisitos, detalles importantes..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none disabled:bg-slate-50 disabled:cursor-not-allowed placeholder:text-slate-400"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.description}
              </p>
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

            <Input
              label="Ubicación"
              type="text"
              placeholder="Ej: Mar del Plata, Buenos Aires"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              disabled={loading}
              required
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

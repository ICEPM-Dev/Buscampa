import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { inscriptionService } from "../../services/inscription.service";
import type { CreateInscriptionDto } from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { showToast } from "../ui/Toast";

export default function InscripcionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateInscriptionDto>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: "",
      }));
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
      isValid = false;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
      isValid = false;
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "El teléfono debe tener al menos 10 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!id) return;

    setLoading(true);

    try {
      await inscriptionService.create(parseInt(id), formData);
      setSuccess(true);
      showToast.success("¡Inscripción completada exitosamente!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al inscribirse";

      if (
        error.response?.status === 409 ||
        errorMessage.includes("inscripto")
      ) {
        showToast.error("Ya estás inscripto en este campamento");
        setTimeout(() => navigate(`/campamentos/${id}`), 2000);
      } else {
        showToast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ¡Inscripción Exitosa!
            </h2>
            <p className="text-slate-600 mb-6">
              Te has inscripto correctamente en el campamento.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/inscripciones")}
                className="w-full"
              >
                Ver Mis Inscripciones
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/campamentos")}
                className="w-full"
              >
                Volver a Campamentos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Inscribirse en Campamento
            </h2>
            <p className="text-slate-600">
              Completa el formulario para inscribirte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              disabled
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="+54 11 1234 5678"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="Mínimo 10 caracteres"
              disabled={loading}
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              {loading ? "Procesando..." : "Inscribirse"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

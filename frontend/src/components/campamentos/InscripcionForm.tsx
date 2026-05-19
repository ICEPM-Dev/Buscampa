import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Tent, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { inscriptionService } from "../../services/inscription.service";
import type { CreateInscriptionDto } from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function InscripcionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateInscriptionDto>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user)
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.fullName.trim() || !formData.email.trim()) return;
    setLoading(true);
    try {
      await inscriptionService.create(parseInt(id), formData);
      setSuccess(true);
    } catch (error: any) {
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("inscripto")
      ) {
        setTimeout(() => navigate(`/campamentos/${id}`), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS STATE ── */
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-5">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1.5">
              ¡Inscripción exitosa!
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Te inscribiste correctamente en el campamento.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button
                onClick={() => navigate("/inscripciones")}
                className="w-full"
              >
                Ver mis inscripciones
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/campamentos")}
                className="w-full"
              >
                Volver a campamentos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Tent className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Inscripción
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inscribirse en campamento
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Notice */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <Lock className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Tus datos están precargados desde tu cuenta. Solo el teléfono
              puede editarse si no lo tenés cargado.
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
              disabled={loading}
              required
            />

            <div className="pt-1">
              <Button type="submit" fullWidth loading={loading}>
                {loading ? "Procesando..." : "Confirmar inscripción"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

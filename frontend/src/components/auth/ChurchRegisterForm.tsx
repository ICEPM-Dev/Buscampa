import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterChurchDto } from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ChurchRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [denomination, setDenomination] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    denomination?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { registerChurch } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    if (!name) {
      newErrors.name = "El nombre de la iglesia es requerido";
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    if (!denomination) {
      newErrors.denomination = "La denominación es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (field: string) => {
    setErrors({ ...errors, [field]: "" });
    setSubmitError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const dto: RegisterChurchDto = { name, email, password, denomination };
      await registerChurch(dto);
      navigate("/");
    } catch (error: any) {
      console.error("Register church error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al registrar la iglesia. Por favor, intenta nuevamente.";
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      <Input
        label="Nombre de la iglesia"
        type="text"
        placeholder="Iglesia Central"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleFieldChange("name");
        }}
        error={errors.name}
        disabled={loading}
      />

      <Input
        label="Denominación"
        type="text"
        placeholder="Bautista, Pentecostés, etc."
        value={denomination}
        onChange={(e) => {
          setDenomination(e.target.value);
          handleFieldChange("denomination");
        }}
        error={errors.denomination}
        disabled={loading}
      />

      <Input
        label="Email"
        type="email"
        placeholder="iglesia@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleFieldChange("email");
        }}
        error={errors.email}
        disabled={loading}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          handleFieldChange("password");
        }}
        error={errors.password}
        helperText="Mínimo 6 caracteres"
        disabled={loading}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          handleFieldChange("confirmPassword");
        }}
        error={errors.confirmPassword}
        disabled={loading}
      />

      <Button type="submit" fullWidth loading={loading}>
        {loading ? "Registrando iglesia..." : "Registrar Iglesia"}
      </Button>

      <div className="text-center pt-4">
        <p className="text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </form>
  );
}

/**
 * Página de registro de usuario.
 * Muestra formulario de registro con opciones de Google OAuth y email.
 */
import { UserPlus } from "lucide-react";
import EmailRegisterForm from "../components/auth/EmailRegisterForm";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Crea tu cuenta
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Google OAuth - Opción principal */}
          <div className="space-y-3">
            <p className="text-sm text-center text-slate-600">
              Conecta Buscampa con:
            </p>
          </div>
          
          {/* Botón de Google */}
          <div className="mb-6">
            <GoogleLoginButton />
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">O regístrate con email</span>
            </div>
          </div>
          
          {/* Formulario tradicional */}
          <div>
            <EmailRegisterForm />
          </div>

          {/* Enlace a login */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-600">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Al registrarte, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
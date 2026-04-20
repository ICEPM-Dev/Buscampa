/**
 * Página de autenticación unificada.
 * Iniciar sesión con una red social también crea la cuenta si no existe.
 */
import { Church } from "lucide-react";
import SocialButton from "../components/auth/SocialButtons";

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Church className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido a Buscampa
          </h1>
          <p className="text-slate-600">
            Conecta con tu red social favorita
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <SocialButton provider="google" />
          <SocialButton provider="facebook" />
          <SocialButton provider="x" />
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
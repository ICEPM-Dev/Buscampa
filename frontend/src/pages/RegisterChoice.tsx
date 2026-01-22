/**
 * Página de selección de tipo de registro.
 * Permite elegir entre registro como usuario o iglesia.
 */
import { Link } from "react-router-dom";
import { User, Church, ArrowRight } from "lucide-react";

export default function RegisterChoice() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ¿Cómo quieres registrarte?
          </h1>
          <p className="text-lg text-slate-600">
            Elige el tipo de cuenta que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link
            to="/register/user"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <User className="h-10 w-10 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Como Usuario
              </h2>

              <p className="text-slate-600 mb-6">
                Explora campamentos cristianos, inscríbete fácilmente y vive
                experiencias de fe inolvidables
              </p>

              <ul className="text-left space-y-3 mb-8 w-full">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">
                    Ver todos los campamentos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">Inscribirte en eventos</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">
                    Gestionar tus inscripciones
                  </span>
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Registrarse como Usuario</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link
            to="/register/church"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Church className="h-10 w-10 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Como Iglesia
              </h2>

              <p className="text-slate-600 mb-6">
                Publica tus campamentos, gestiona inscripciones y conecta con
                más personas de la comunidad
              </p>

              <ul className="text-left space-y-3 mb-8 w-full">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">Crear campamentos</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">
                    Gestionar inscripciones
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-700">Dashboard completo</span>
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Registrarse como Iglesia</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

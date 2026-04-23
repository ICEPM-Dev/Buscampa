/**
 * Página de inicio de la aplicación.
 * Muestra contenido diferente para usuarios autenticados vs no autenticados.
 * Incluye secciones de hero, características y footer.
 */
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  Church,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Home() {
  const { isAuthenticated, user, isUser, isChurch } = useAuth();

  return (
    <>
      <SEO />
      <div className="min-h-screen">
      <section className="bg-linear-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            {isAuthenticated ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  ¡Hola, {user?.name}! 👋
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  {isUser
                    ? "Explora los campamentos disponibles y encuentra el perfecto para ti."
                    : "Gestiona tus campamentos y revisa las inscripciones de tu comunidad."}
                </p>
                <div className="flex flex-wrap gap-4">
                  {isUser && (
                    <Link
                      to="/campamentos"
                      className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Ver Campamentos
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  )}
                  {isChurch && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Ir al Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  ¡Encuentra campamentos en Argentina ahora!
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Conecta con iglesias y participa en experiencias de fe
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/campamentos"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Ver Campamentos
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Qué es Buscampa?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              La plataforma para conectar a iglesias con personas que buscan
              experiencias de fe y comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Church className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Para Iglesias
              </h3>
              <p className="text-slate-600">
                Publica tus campamentos, gestiona inscripciones y conecta con
                más personas
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Para Usuarios
              </h3>
              <p className="text-slate-600">
                Encuentra campamentos cristianos, inscríbete fácilmente y vive
                experiencias inolvidables
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Fácil de Usar
              </h3>
              <p className="text-slate-600">
                Interfaz simple e intuitiva para que todos puedan participar
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Características principales
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Campamentos en todo el país
                </h3>
                <p className="text-slate-600">
                  Encuentra campamentos en diferentes regiones de Argentina
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Calendar className="h-6 w-6 text-blue-600 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Fácil inscripción
                </h3>
                <p className="text-slate-600">
                  Regístrate en segundos con un proceso simple y seguro
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Church className="h-6 w-6 text-blue-600 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Diversas denominaciones
                </h3>
                <p className="text-slate-600">
                  Iglesias de diferentes tradiciones cristianas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Comunidad activa
                </h3>
                <p className="text-slate-600">
                  Forma parte de una comunidad de fe vibrante
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Únete hoy y descubre campamentos cristianos increíbles
          </p>
          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Crear Cuenta
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}

import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Política de Privacidad
            </h1>
          </div>

          <p className="text-slate-600 mb-8">
            Última actualización: 21 de abril de 2026
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Introducción
              </h2>
              <p className="text-slate-700">
                En Buscampa, respetamos tu privacidad y nos comprometemos a proteger
                tus datos personales. Esta política describe cómo recopilamos,
                usamos y protegemos tu información cuando utilizas nuestra
                plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Información que Recopilamos
              </h2>
              <p className="text-slate-700 mb-2">
                Recopilamos los siguientes tipos de información:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>
                  <strong>Datos de registro:</strong> Nombre, correo
                  electrónico y contraseña.
                </li>
                <li>
                  <strong>Datos de perfil:</strong> Número de teléfono
                  (opcional).
                </li>
                <li>
                  <strong>Datos de iglesia:</strong> Nombre, denominación
                  y teléfono de la organización.
                </li>
                <li>
                  <strong>Datos de inscripción:</strong> Nombre completo,
                  correo electrónico y teléfono del participante.
                </li>
                <li>
                  <strong>Datos de uso:</strong> Información sobre
                  cómo interactúas con la plataforma.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Cómo Usamos tu Información
              </h2>
              <p className="text-slate-700 mb-2">Utilizamos tu información para:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>Crear y gestionar tu cuenta de usuario</li>
                <li>Conectarte con iglesias y campamentos</li>
                <li>Procesar inscripciones a campamentos</li>
                <li>Comunicarte con la iglesia organizadora</li>
                <li>Mejorar nuestros servicios</li>
                <li>Enviarte información relevante sobre tu actividad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Compartición de Información
              </h2>
              <p className="text-slate-700 mb-2">
                Tu información puede ser compartida en los siguientes casos:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>
                  <strong>Con iglesias:</strong> Tus datos de inscripción se
                  comparten con la iglesia organizadora del campamento.
                </li>
                <li>
                  <strong>Servicios externos:</strong> Utilizamos
                  servicios de terceros como Google OAuth para la
                  autenticación.
                </li>
                <li>
                  <strong>Cumplimiento legal:</strong> Cuando sea
                  requerido por ley o autoridad competente.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Seguridad de Datos
              </h2>
              <p className="text-slate-700">
                Implementamos medidas de seguridad técnicas y organizativas
                para proteger tu información, incluyendo:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>Encriptación de contraseñas con bcrypt</li>
                <li>Uso de tokens JWT para autenticación segura</li>
                <li>Protección de datos en tránsito con HTTPS</li>
                <li>Acceso restringido a datos personales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Retención de Datos
              </h2>
              <p className="text-slate-700">
                Conservamos tu información mientras tu cuenta esté activa o
                según sea necesario para proporcionar servicios. Los datos de
                inscripción se conservan por un período razonable para tu
                referencia. Puedes solicitar la eliminación de tus datos en
                cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Tus Derechos
              </h2>
              <p className="text-slate-700">Tienes derecho a:</p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información incorrecta</li>
                <li>Solicitar la eliminación de tu cuenta y datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Exportar tus datos en formato legible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Cookies y Tecnologías
              </h2>
              <p className="text-slate-700">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>Mantener tu sesión iniciada</li>
                <li>Recordar tus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
              </ul>
              <p className="text-slate-700 mt-4">
                Puede gestionar las cookies a través de la configuración de
                tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Análisis (Vercel Analytics)
              </h2>
              <p className="text-slate-700">
                Utilizamos Vercel Analytics para recopilar información
                anónima sobre el uso de la plataforma. Esta información nos
                ayuda a mejorar nuestros servicios y la experiencia del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Autenticación con Google
              </h2>
              <p className="text-slate-700">
                Si utilizas Google para autenticarte, recopilamos tu correo
                electrónico y nombre de perfil. Estos datos se utilizan
                exclusivamente para la autenticación y no se comparten con terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                11. Menores de Edad
              </h2>
              <p className="text-slate-700">
                Buscampa no está dirigido a menores de 18 años. No recopilamos
                deliberadamente información de menores. Si detectamos que
                hemos recopilado información de un menor, la eliminaremos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                12. Cambios a esta Política
              </h2>
              <p className="text-slate-700">
                Podemos actualizar esta política periódicamente. Los cambios
                significativos serán notificados a través de la plataforma. Te
                recomendamos revisar esta página regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                13. Eliminación de Cuenta
              </h2>
              <p className="text-slate-700">
                Puedes eliminar tu cuenta en cualquier momento a través de la opción
                "Eliminar Cuenta" en tu perfil. Al hacerlo, se eliminará toda
                tu información personal, excepto los datos de inscripciones
                activas que puedan ser necesarios para el cumplimiento de
                obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                14. Responsable del Tratamiento
              </h2>
              <p className="text-slate-700">
                El responsable del tratamiento de tus datos personales es
                Buscampa. Si tienes preguntas sobre esta política o sobre el
                tratamiento de tus datos, puedes contactarnos a través de la
                plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
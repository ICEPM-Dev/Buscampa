import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Términos y Condiciones
            </h1>
          </div>

          <p className="text-slate-600 mb-8">
            Última actualización: 21 de abril de 2026
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p className="text-slate-700">
                Al acceder y utilizar Buscampa, aceptas cumplir con estos
                Términos de Uso en su totalidad. Si no estás de acuerdo con
                alguno de estos términos, te solicitamos que no utilices la
                plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="text-slate-700">
                Buscampa es una plataforma web que conecta iglesias con personas
                interesadas en campamentos cristianos en Argentina. La plataforma
                permite a las iglesias publicar campamentos y a los usuarios
                inscribirse en ellos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Registro y Cuentas
              </h2>
              <p className="text-slate-700">
                Para utilizar ciertos servicios de Buscampa, debes crear una
                cuenta. Eres responsable de:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                <li>Todas las actividades realizadas bajo tu cuenta</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                <li>Proporcionar información veraz y actualizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Tipos de Usuarios
              </h2>
              <p className="text-slate-700 mb-2">
                La plataforma cuenta con dos tipos de usuarios:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>
                  <strong>Usuarios:</strong> Personas que buscan y se
                  inscriben en campamentos.
                </li>
                <li>
                  <strong>Iglesias:</strong> Organizaciones que publican y
                  gestionan campamentos.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Publicación de Campamentos
              </h2>
              <p className="text-slate-700">
                Las iglesias son responsables del contenido publicado,
                incluyendo la veracidad de la información del campamento. La
                iglesia organizadora es la única responsable de:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>La seguridad y bienestar de los participantes</li>
                <li>El cumplimiento de las fechas y condiciones publicadas</li>
                <li>La organización logística del campamento</li>
                <li>Cualquier incidente durante el evento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Inscripciones
              </h2>
              <p className="text-slate-700">
                Al inscribirte en un campamento, aceptas que:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>
                  La información proporcionada sea correcta y veraz
                </li>
                <li>Te comunicarás directamente con la iglesia organizadora</li>
                <li>
                  Seguirás las normas y reglas establecidas por el campamento
                </li>
                <li>
                  Asumiras la responsabilidad por tu asistencia y participación
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Uso Apropiado
              </h2>
              <p className="text-slate-700">Te comprometes a:</p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>No utilizar la plataforma para fines ilegales</li>
                <li>No publicar contenido falso o engañoso</li>
                <li>No interferir con el funcionamiento de la plataforma</li>
                <li>Respetar a otros usuarios y su privacidad</li>
                <li>No realizar spam o inscripciones falsas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Propiedad Intelectual
              </h2>
              <p className="text-slate-700">
                Todo el contenido, diseño y código de Buscampa está protegido
                por derechos de propiedad intelectual. No está permitido copiar,
                modificar o distribuir contenido de la plataforma sin
                autorización.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Limitación de Responsabilidad
              </h2>
              <p className="text-slate-700">
                Buscampa actúa únicamente como intermediario entre iglesias y
                usuarios. No somos responsables por:
              </p>
              <ul className="list-disc list-inside text-slate-700 mt-2 space-y-1">
                <li>Incidentes ocurridos durante los campamentos</li>
                <li>La cancelación o modificación de eventos por las iglesias</li>
                <li>Conflicts entre participantes y organizaciones</li>
                <li>La veracidad de la información publicada por terceros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Modificaciones
              </h2>
              <p className="text-slate-700">
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Los cambios entrarán en vigor inmediatamente
                después de su publicación. Es tu responsabilidad revisar
                periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                11. Terminación
              </h2>
              <p className="text-slate-700">
                Podemos suspender o terminate tu cuenta si incumples estos términos o
                por cualquier otra razón a nuestra discreción. Puedes eliminar tu
                cuenta en cualquier momento a través de la configuración de tu
                perfil.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                12. Ley Aplicable
              </h2>
              <p className="text-slate-700">
                Estos términos se rigen por las leyes de la República Argentina.
                Cualquier disputa será resuelta en los tribunales competentes de
                Argentina.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                13. Contacto
              </h2>
              <p className="text-slate-700">
                Si tienes preguntas sobre estos Términos de Uso, puedes
                contactarnos a través de la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
import { FileText } from "lucide-react";

const TSection = ({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-baseline gap-2.5 mb-3">
      <span className="text-xs font-bold text-blue-600 tabular-nums">{n}</span>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
    <div className="text-sm text-slate-600 leading-relaxed space-y-2">
      {children}
    </div>
  </section>
);

export function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Términos y Condiciones
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Última actualización: 21 de abril de 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 sm:p-10 space-y-8 divide-y divide-slate-100">
          {[
            {
              n: "1.",
              title: "Aceptación de los Términos",
              body: (
                <p>
                  Al acceder y utilizar Buscampa, aceptás cumplir con estos
                  Términos de Uso en su totalidad. Si no estás de acuerdo, te
                  pedimos que no utilices la plataforma.
                </p>
              ),
            },
            {
              n: "2.",
              title: "Descripción del Servicio",
              body: (
                <p>
                  Buscampa conecta iglesias con personas interesadas en
                  campamentos cristianos en Argentina. Las iglesias publican
                  campamentos y los usuarios pueden inscribirse en ellos.
                </p>
              ),
            },
            {
              n: "3.",
              title: "Registro y Cuentas",
              body: (
                <>
                  <p>
                    Para acceder a ciertos servicios, debés crear una cuenta.
                    Sos responsable de:
                  </p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>Mantener la confidencialidad de tus credenciales</li>
                    <li>Todas las actividades bajo tu cuenta</li>
                    <li>
                      Notificar inmediatamente cualquier uso no autorizado
                    </li>
                    <li>Proporcionar información veraz y actualizada</li>
                  </ul>
                </>
              ),
            },
            {
              n: "4.",
              title: "Tipos de Usuarios",
              body: (
                <>
                  <p>La plataforma tiene dos tipos:</p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>
                      <strong className="text-slate-800">Usuarios:</strong>{" "}
                      Buscan y se inscriben en campamentos.
                    </li>
                    <li>
                      <strong className="text-slate-800">Iglesias:</strong>{" "}
                      Publican y gestionan campamentos.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              n: "5.",
              title: "Publicación de Campamentos",
              body: (
                <>
                  <p>
                    Las iglesias son responsables del contenido publicado,
                    incluyendo la veracidad de la información. La iglesia
                    organizadora es la única responsable de:
                  </p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>La seguridad y bienestar de los participantes</li>
                    <li>El cumplimiento de las fechas y condiciones</li>
                    <li>La organización logística del campamento</li>
                    <li>Cualquier incidente durante el evento</li>
                  </ul>
                </>
              ),
            },
            {
              n: "6.",
              title: "Inscripciones",
              body: (
                <>
                  <p>Al inscribirte en un campamento, aceptás que:</p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>La información proporcionada es correcta y veraz</li>
                    <li>
                      Te comunicarás directamente con la iglesia organizadora
                    </li>
                    <li>Seguirás las normas establecidas por el campamento</li>
                    <li>Asumís la responsabilidad por tu asistencia</li>
                  </ul>
                </>
              ),
            },
            {
              n: "7.",
              title: "Uso Apropiado",
              body: (
                <>
                  <p>Te comprometés a:</p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>No utilizar la plataforma para fines ilegales</li>
                    <li>No publicar contenido falso o engañoso</li>
                    <li>
                      No interferir con el funcionamiento de la plataforma
                    </li>
                    <li>Respetar a otros usuarios y su privacidad</li>
                    <li>No realizar spam o inscripciones falsas</li>
                  </ul>
                </>
              ),
            },
            {
              n: "8.",
              title: "Propiedad Intelectual",
              body: (
                <p>
                  Todo el contenido, diseño y código de Buscampa está protegido
                  por derechos de propiedad intelectual. No está permitido
                  copiar, modificar o distribuir contenido sin autorización.
                </p>
              ),
            },
            {
              n: "9.",
              title: "Limitación de Responsabilidad",
              body: (
                <>
                  <p>
                    Buscampa actúa únicamente como intermediario. No somos
                    responsables por:
                  </p>
                  <ul className="ml-4 list-disc mt-2 space-y-1">
                    <li>Incidentes ocurridos durante los campamentos</li>
                    <li>
                      La cancelación o modificación de eventos por las iglesias
                    </li>
                    <li>Conflictos entre participantes y organizaciones</li>
                    <li>
                      La veracidad de la información publicada por terceros
                    </li>
                  </ul>
                </>
              ),
            },
            {
              n: "10.",
              title: "Modificaciones",
              body: (
                <p>
                  Nos reservamos el derecho de modificar estos términos en
                  cualquier momento. Los cambios entran en vigor al ser
                  publicados. Es tu responsabilidad revisarlos periódicamente.
                </p>
              ),
            },
            {
              n: "11.",
              title: "Terminación",
              body: (
                <p>
                  Podemos suspender tu cuenta si incumplís estos términos. Podés
                  eliminar tu cuenta en cualquier momento desde la configuración
                  de tu perfil.
                </p>
              ),
            },
            {
              n: "12.",
              title: "Ley Aplicable",
              body: (
                <p>
                  Estos términos se rigen por las leyes de la República
                  Argentina. Cualquier disputa será resuelta en los tribunales
                  competentes de Argentina.
                </p>
              ),
            },
            {
              n: "13.",
              title: "Contacto",
              body: (
                <p>
                  Si tenés preguntas sobre estos Términos de Uso, podés
                  contactarnos a través de la plataforma.
                </p>
              ),
            },
          ].map(({ n, title, body }, i) => (
            <div key={n} className={i === 0 ? "" : "pt-8"}>
              <TSection n={n} title={title}>
                {body}
              </TSection>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Terms;

import { Shield } from "lucide-react";

const Section = ({
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

export function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Política de Privacidad
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
          <Section n="1." title="Introducción">
            <p>
              En Buscampa, respetamos tu privacidad y nos comprometemos a
              proteger tus datos personales. Esta política describe cómo
              recopilamos, usamos y protegemos tu información cuando utilizás
              nuestra plataforma.
            </p>
          </Section>

          <div className="pt-8">
            <Section n="2." title="Información que Recopilamos">
              <p>Recopilamos los siguientes tipos de información:</p>
              <ul className="space-y-1 mt-2 ml-4 list-disc">
                <li>
                  <strong className="text-slate-800">Datos de registro:</strong>{" "}
                  Nombre, correo electrónico y contraseña.
                </li>
                <li>
                  <strong className="text-slate-800">Datos de perfil:</strong>{" "}
                  Número de teléfono (opcional).
                </li>
                <li>
                  <strong className="text-slate-800">Datos de iglesia:</strong>{" "}
                  Nombre y teléfono de la organización.
                </li>
                <li>
                  <strong className="text-slate-800">
                    Datos de inscripción:
                  </strong>{" "}
                  Nombre completo, correo electrónico y teléfono del
                  participante.
                </li>
                <li>
                  <strong className="text-slate-800">Datos de uso:</strong>{" "}
                  Información sobre cómo interactuás con la plataforma.
                </li>
              </ul>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="3." title="Cómo Usamos tu Información">
              <p>Utilizamos tu información para:</p>
              <ul className="space-y-1 mt-2 ml-4 list-disc">
                <li>Crear y gestionar tu cuenta de usuario</li>
                <li>Conectarte con iglesias y campamentos</li>
                <li>Procesar inscripciones a campamentos</li>
                <li>Comunicarte con la iglesia organizadora</li>
                <li>Mejorar nuestros servicios</li>
                <li>Enviarte información relevante sobre tu actividad</li>
              </ul>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="4." title="Compartición de Información">
              <p>
                Tu información puede ser compartida en los siguientes casos:
              </p>
              <ul className="space-y-1 mt-2 ml-4 list-disc">
                <li>
                  <strong className="text-slate-800">Con iglesias:</strong> Tus
                  datos de inscripción se comparten con la iglesia organizadora
                  del campamento.
                </li>
                <li>
                  <strong className="text-slate-800">
                    Servicios externos:
                  </strong>{" "}
                  Utilizamos Google OAuth para la autenticación.
                </li>
                <li>
                  <strong className="text-slate-800">
                    Cumplimiento legal:
                  </strong>{" "}
                  Cuando sea requerido por ley o autoridad competente.
                </li>
              </ul>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="5." title="Seguridad de Datos">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas:
              </p>
              <ul className="space-y-1 mt-2 ml-4 list-disc">
                <li>Encriptación de contraseñas con bcrypt</li>
                <li>Tokens JWT para autenticación segura</li>
                <li>Protección en tránsito con HTTPS</li>
                <li>Acceso restringido a datos personales</li>
              </ul>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="6." title="Retención de Datos">
              <p>
                Conservamos tu información mientras tu cuenta esté activa o
                según sea necesario para brindar los servicios. Podés solicitar
                la eliminación de tus datos en cualquier momento.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="7." title="Tus Derechos">
              <p>Tenés derecho a:</p>
              <ul className="space-y-1 mt-2 ml-4 list-disc">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información incorrecta</li>
                <li>Solicitar la eliminación de tu cuenta y datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Exportar tus datos en formato legible</li>
              </ul>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="8." title="Cookies y Tecnologías">
              <p>
                Utilizamos cookies para mantener tu sesión, recordar
                preferencias y analizar el uso de la plataforma. Podés
                gestionarlas desde la configuración de tu navegador.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="9." title="Análisis (Vercel Analytics)">
              <p>
                Utilizamos Vercel Analytics para recopilar información anónima
                sobre el uso de la plataforma, lo que nos ayuda a mejorar la
                experiencia del usuario.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="10." title="Autenticación con Google">
              <p>
                Si usás Google para autenticarte, recopilamos tu correo
                electrónico y nombre de perfil, usados exclusivamente para la
                autenticación y no compartidos con terceros.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="11." title="Menores de Edad">
              <p>
                Buscampa no está dirigido a menores de 18 años. Si detectamos
                que hemos recopilado información de un menor, la eliminaremos de
                inmediato.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="12." title="Cambios a esta Política">
              <p>
                Podemos actualizar esta política periódicamente. Los cambios
                significativos serán notificados a través de la plataforma.
                Recomendamos revisar esta página regularmente.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="13." title="Eliminación de Cuenta">
              <p>
                Podés eliminar tu cuenta desde la opción "Eliminar Cuenta" en tu
                perfil. Se eliminará toda tu información personal, excepto datos
                de inscripciones activas necesarios por obligaciones legales.
              </p>
            </Section>
          </div>

          <div className="pt-8">
            <Section n="14." title="Responsable del Tratamiento">
              <p>
                El responsable del tratamiento es Buscampa. Si tenés preguntas,
                podés contactarnos a través de la plataforma.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;

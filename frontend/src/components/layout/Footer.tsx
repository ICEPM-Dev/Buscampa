import { Link } from "react-router-dom";
import { FileText, Shield, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
<Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Buscampa" className="h-8 w-8" />
              <span className="text-xl font-bold">Buscampa</span>
            </Link>
            <p className="text-slate-400 mb-4 max-w-md">
              La plataforma para conectar iglesias con personas interesadas en
              campamentos cristianos en Argentina.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:contacto@buscampa.com"
                className="text-slate-400 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/campamentos"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Campamentos
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <p className="text-slate-500 text-center">
            © {new Date().getFullYear()} Buscampa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
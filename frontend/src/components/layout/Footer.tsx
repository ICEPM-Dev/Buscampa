/**
 * Footer rediseñado — moderno, paleta slate/blue original
 */
import { Link } from "react-router-dom";
import { FileText, Shield, Mail } from "lucide-react";
import logo from "../../assets/logo.svg";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .bc-footer {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .bc-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2563eb55, #2563eb99, #2563eb55, transparent);
        }

        .bc-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 2rem;
        }

        .bc-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        @media (max-width: 768px) {
          .bc-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .bc-footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .bc-footer-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Brand */
        .bc-footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 1rem;
        }

        .bc-footer-logo img {
          height: 30px;
          width: 30px;
          filter: brightness(1.1);
        }

        .bc-footer-logo-text {
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.03em;
        }

        .bc-footer-logo-text span {
          color: #60a5fa;
        }

        .bc-footer-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 300px;
          margin-bottom: 1.5rem;
        }

        .bc-footer-contact {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #475569;
          text-decoration: none;
          transition: color 0.15s;
        }

        .bc-footer-contact:hover {
          color: #60a5fa;
        }

        /* Columns */
        .bc-footer-col h4 {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 1.25rem;
        }

        .bc-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bc-footer-col a {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s, transform 0.15s;
        }

        .bc-footer-col a:hover {
          color: #e2e8f0;
          transform: translateX(3px);
        }

        /* Bottom bar */
        .bc-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 1.75rem;
          border-top: 1px solid #1e293b;
        }

        .bc-footer-copy {
          font-size: 0.8rem;
          color: #334155;
        }

        .bc-footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #334155;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid #1e293b;
        }

        .bc-footer-badge svg {
          color: #2563eb;
        }
      `}</style>

      <footer className="bc-footer">
        <div className="bc-footer-inner">
          <div className="bc-footer-grid">
            {/* Brand */}
            <div className="bc-footer-brand">
              <Link to="/" className="bc-footer-logo">
                <img src={logo} alt="Buscampa" />
                <span className="bc-footer-logo-text">
                  Bus<span>campa</span>
                </span>
              </Link>
              <p className="bc-footer-desc">
                La plataforma que conecta iglesias con personas que buscan
                experiencias de fe y comunidad en toda Argentina.
              </p>
              <a
                href="mailto:contacto@buscampa.com.ar"
                className="bc-footer-contact"
              >
                <Mail size={13} />
                contacto@buscampa.com.ar
              </a>
            </div>

            {/* Nav */}
            <div className="bc-footer-col">
              <h4>Navegación</h4>
              <ul>
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/campamentos">Campamentos</Link>
                </li>
                <li>
                  <Link to="/auth">Registrarse</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="bc-footer-col">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link to="/terms-conditions">
                    <FileText size={13} />
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy">
                    <Shield size={13} />
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="bc-footer-bottom">
            <p className="bc-footer-copy">
              © {new Date().getFullYear()} Buscampa. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

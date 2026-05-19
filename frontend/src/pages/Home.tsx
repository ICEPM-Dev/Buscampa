/**
 * Página de inicio rediseñada — paleta azul/slate original, estética moderna.
 */
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  Church,
  MapPin,
  Calendar,
  Users,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Home() {
  const { isAuthenticated, user, isUser, isChurch } = useAuth();

  return (
    <>
      <SEO />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .home-page {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: url('/banner2.jpg') center/cover no-repeat;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(15, 23, 42, 0.82) 0%,
            rgba(15, 23, 42, 0.55) 55%,
            rgba(37, 99, 235, 0.18) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          padding-top: 4rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(37, 99, 235, 0.2);
          border: 1px solid rgba(96, 165, 250, 0.35);
          color: #93c5fd;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          backdrop-filter: blur(8px);
          opacity: 0;
          animation: fadeUp 0.7s ease 0.15s forwards;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25);
          animation: pulse-dot 2s ease infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(96,165,250,0.25); }
          50% { box-shadow: 0 0 0 5px rgba(96,165,250,0.1); }
        }

        .hero-title {
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 1.5rem;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.3s forwards;
        }

        .hero-title .accent {
          color: #60a5fa;
        }

        .hero-sub {
          font-size: 1.1rem;
          color: rgba(203, 213, 225, 0.85);
          max-width: 480px;
          line-height: 1.75;
          font-weight: 400;
          margin-bottom: 2.5rem;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.45s forwards;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.6s forwards;
        }

        .btn-blue {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #2563eb;
          color: #fff;
          padding: 0.8rem 1.75rem;
          border-radius: 10px;
          font-size: 0.925rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37,99,235,0.4);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .btn-blue:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.5);
        }

        .btn-white-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          color: #fff;
          padding: 0.8rem 1.75rem;
          border-radius: 10px;
          font-size: 0.925rem;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.15s;
        }

        .btn-white-outline:hover {
          background: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }

        /* Scroll hint */
        .scroll-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0;
          animation: fadeIn 1s ease 1.2s forwards;
        }

        .scroll-hint span {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(148,163,184,0.6);
        }

        .scroll-line {
          width: 1px;
          height: 2.5rem;
          background: linear-gradient(to bottom, rgba(96,165,250,0.7), transparent);
          animation: scrollAnim 2s ease infinite;
        }

        @keyframes scrollAnim {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.05); }
        }

        /* ── STATS ── */
        .stats-bar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }

        .stat-item {
          text-align: center;
          padding: 0.5rem;
        }

        .stat-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e40af;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-top: 0.2rem;
          font-weight: 500;
        }

        /* ── SECTIONS ── */
        .section-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2563eb;
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-size: clamp(1.85rem, 3.5vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #0f172a;
          line-height: 1.15;
          margin-bottom: 1.25rem;
        }

        .section-lead {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.75;
          max-width: 500px;
        }

        /* ── WHAT IS ── */
        .what-section {
          padding: 7rem 2rem;
          background: #f8fafc;
        }

        .what-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .what-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .what-header .section-lead {
          margin: 0 auto;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem 2rem 2.25rem;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.07);
          border-color: #bfdbfe;
        }

        .card-icon-wrap {
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
        }

        .card-text {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.7;
        }

        /* ── FEATURES ── */
        .features-section {
          padding: 7rem 2rem;
          background: #fff;
        }

        .features-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .features-inner { grid-template-columns: 1fr; gap: 3rem; }
        }

        .features-sticky {
  position: sticky;
  top: 5.5rem;
}

@media (max-width: 768px) {
  .features-sticky {
    position: static;
    margin-bottom: 2rem;
  }
}

        .features-sticky .section-lead {
          margin-bottom: 2.5rem;
        }

        .feature-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          transition: padding-left 0.25s;
        }

        .feature-item:last-child { border-bottom: none; }

        .feature-item:hover { padding-left: 0.35rem; }

        .feature-icon {
          flex-shrink: 0;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 8px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          margin-top: 0.1rem;
        }

        .feature-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.3rem;
        }

        .feature-text {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.65;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 7rem 2rem;
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 580px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 1.25rem;
        }

        .cta-sub {
          font-size: 1rem;
          color: rgba(219, 234, 254, 0.85);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .btn-white {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          color: #1d4ed8;
          padding: 0.85rem 1.85rem;
          border-radius: 10px;
          font-size: 0.925rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          transition: transform 0.15s, box-shadow 0.2s;
        }

        .btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.22);
        }

        .btn-blue-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #fff;
          padding: 0.85rem 1.85rem;
          border-radius: 10px;
          font-size: 0.925rem;
          font-weight: 600;
          text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.4);
          transition: background 0.2s, transform 0.15s;
        }

        .btn-blue-outline:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div className="home-page">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            {isAuthenticated ? (
              <>
                <h1 className="hero-title">
                  ¡Hola, <span className="accent">{user?.name}</span>!
                </h1>
                <p className="hero-sub">
                  {isUser
                    ? "Explora los campamentos disponibles y encontrá el perfecto para vos."
                    : "Gestioná tus campamentos y revisá las inscripciones de tu comunidad."}
                </p>
                <div className="hero-ctas">
                  {isUser && (
                    <Link to="/campamentos" className="btn-blue">
                      Ver Campamentos <ArrowRight size={17} />
                    </Link>
                  )}
                  {isChurch && (
                    <Link to="/dashboard" className="btn-blue">
                      Ir al Dashboard <ArrowRight size={17} />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="hero-title">
                  Encontrá tu próximo
                  <br />
                  <span className="accent">campamento</span>
                  <br />
                  de fe
                </h1>
                <p className="hero-sub">
                  Conectá con iglesias de toda Argentina y viví experiencias de
                  comunidad que te van a transformar.
                </p>
                <div className="hero-ctas">
                  <Link to="/campamentos" className="btn-blue">
                    Explorar Campamentos <ArrowRight size={17} />
                  </Link>
                  <Link to="/auth" className="btn-white-outline">
                    Crear Cuenta
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── WHAT IS ── */}
        <section className="what-section">
          <div className="what-inner">
            <div className="what-header">
              <span className="section-tag">¿Qué es Buscampa?</span>
              <h2 className="section-title">
                La plataforma que une iglesias y personas
              </h2>
              <p className="section-lead">
                Un espacio pensado para que las iglesias publiquen sus
                campamentos y las personas encuentren experiencias de fe
                auténticas.
              </p>
            </div>

            <div className="cards-grid">
              {[
                {
                  icon: <Church size={22} />,
                  bg: "#eff6ff",
                  color: "#2563eb",
                  title: "Para Iglesias",
                  text: "Publicá tus campamentos, gestioná inscripciones y conectá con más personas de tu región.",
                },
                {
                  icon: <Users size={22} />,
                  bg: "#f0fdf4",
                  color: "#16a34a",
                  title: "Para Usuarios",
                  text: "Encontrá campamentos cristianos, inscribite fácilmente y viví experiencias que no olvidarás.",
                },
                {
                  icon: <Compass size={22} />,
                  bg: "#faf5ff",
                  color: "#7c3aed",
                  title: "Fácil de Usar",
                  text: "Interfaz intuitiva para que todos puedan participar sin complicaciones.",
                },
              ].map((c) => (
                <div className="card" key={c.title}>
                  <div
                    className="card-icon-wrap"
                    style={{ background: c.bg, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <h3 className="card-title">{c.title}</h3>
                  <p className="card-text">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section">
          <div className="features-inner">
            <div className="features-sticky">
              <span className="section-tag">Características</span>
              <h2 className="section-title">
                Todo lo que necesitás en un solo lugar
              </h2>
              <p className="section-lead">
                Diseñado para hacer la búsqueda y organización de campamentos lo
                más simple posible para todos.
              </p>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  className="btn-blue"
                  style={{ width: "fit-content" }}
                >
                  Comenzar gratis <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div>
              {[
                {
                  icon: <MapPin size={16} />,
                  title: "Campamentos en todo el país",
                  text: "Encontrá campamentos en diferentes regiones de Argentina, cerca tuyo o donde quieras explorar.",
                },
                {
                  icon: <Calendar size={16} />,
                  title: "Fácil inscripción",
                  text: "Registrate en segundos con un proceso simple y seguro. Sin formularios largos.",
                },
                {
                  icon: <Church size={16} />,
                  title: "Diversas denominaciones",
                  text: "Iglesias de diferentes tradiciones cristianas, todas con el mismo espíritu de comunidad.",
                },
                {
                  icon: <Users size={16} />,
                  title: "Comunidad activa",
                  text: "Formá parte de una red de fe que crece en toda Argentina.",
                },
              ].map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-text">{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        {!isAuthenticated && (
          <section className="cta-section">
            <div className="cta-inner">
              <span className="section-tag" style={{ color: "#93c5fd" }}>
                Sumate hoy
              </span>
              <h2 className="cta-title">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="cta-sub">
                Creá tu cuenta en minutos y empezá a descubrir campamentos
                cristianos increíbles.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <Link to="/auth" className="btn-white">
                  Crear Cuenta Gratis <ArrowRight size={17} />
                </Link>
                <Link to="/campamentos" className="btn-blue-outline">
                  Ver Campamentos
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

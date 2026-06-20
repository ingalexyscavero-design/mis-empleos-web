import { useEffect, useState } from "react";
import { IBriefcase } from "./icons";

// ============================================================
//  SPLASH — bienvenida premium coreografiada.
//  Secuencia: fondo respira → logo se ensambla con anillo que
//  lo traza → barrido de luz → destellos que irradian → nombre
//  con letras escalonadas → salida con zoom-fade hacia la app.
// ============================================================
const NOMBRE = "Empleos AC";

export default function Splash({ onListo }) {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), 2300);
    const t2 = setTimeout(() => onListo?.(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onListo]);

  return (
    <div className={`splash-wrap ${saliendo ? "splash-out" : ""}`}>
      {/* Fondo que respira */}
      <div className="splash-bg" />

      {/* Destellos que irradian desde el centro */}
      <div className="splash-rayos">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="splash-rayo" style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${0.6 + i * 0.03}s` }} />
        ))}
      </div>

      {/* Anillos que se expanden */}
      <span className="splash-ring" style={{ animationDelay: "0.2s" }} />
      <span className="splash-ring" style={{ animationDelay: "0.8s" }} />

      {/* Logo con anillo trazador + barrido de luz */}
      <div className="splash-logo-zona">
        <svg className="splash-traza" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="47" />
        </svg>
        <div className="splash-logo">
          <div className="splash-caja btn-acento sombra-marca">
            <IBriefcase className="w-12 h-12" />
            <span className="splash-shine" />
          </div>
        </div>
      </div>

      {/* Nombre con letras escalonadas */}
      <div className="splash-nombre">
        <h1 className="text-[28px] font-extrabold tracking-tight flex">
          {NOMBRE.split("").map((ch, i) => (
            <span key={i} className={`splash-letra ${ch === "A" || ch === "C" ? "text-marca" : "text-[color:var(--txt)]"}`}
              style={{ animationDelay: `${1.1 + i * 0.045}s` }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
        <p className="splash-tagline text-[12.5px] text-[color:var(--txt-2)] mt-1.5 font-medium tracking-[.04em]">
          Tu próximo trabajo, organizado
        </p>
      </div>
    </div>
  );
}

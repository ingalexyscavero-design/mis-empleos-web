import { useState, useEffect } from "react";
import { ILock, IDelete, IBriefcase } from "./icons";

// ============================================================
//  LOGIN — clave numérica de 3 dígitos (852)
//  Teclado en pantalla propio (numérico siempre, también en PC)
//  + input oculto type=tel para que en celular salga el teclado
//  numérico si tocan los puntos. Recuerda sesión vía onEntrar().
// ============================================================
const CLAVE = "852";
const MAX = 3;

export default function Login({ onEntrar }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const teclear = (d) => {
    if (error) setError(false);
    setPin((p) => (p.length < MAX ? p + d : p));
  };
  const borrar = () => { if (error) setError(false); setPin((p) => p.slice(0, -1)); };

  // Cuando completa los 3 dígitos, verifica.
  useEffect(() => {
    if (pin.length < MAX) return;
    const t = setTimeout(() => {
      if (pin === CLAVE) onEntrar?.();
      else { setError(true); setPin(""); }
    }, 180);
    return () => clearTimeout(t);
  }, [pin, onEntrar]);

  // Permitir teclear con teclado físico (PC).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") teclear(e.key);
      else if (e.key === "Backspace") borrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col items-center justify-center px-8 animate-fade">
      {/* Logo + título */}
      <div className="flex flex-col items-center animate-subir">
        <div className="w-[68px] h-[68px] rounded-[22px] flex items-center justify-center btn-acento sombra-marca">
          <IBriefcase className="w-9 h-9" />
        </div>
        <h1 className="text-[22px] font-extrabold tracking-tight mt-5">Empleos <span className="text-marca">AC</span></h1>
        <p className="text-[13px] text-[color:var(--txt-2)] mt-1.5 flex items-center gap-1.5 font-medium">
          <ILock className="w-3.5 h-3.5" /> Ingresa tu clave
        </p>
      </div>

      {/* Puntos del PIN */}
      <div className={`flex gap-4 my-9 ${error ? "animate-sacudir" : ""}`}>
        {[0, 1, 2].map((i) => {
          const lleno = i < pin.length;
          return (
            <span key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200
                ${error ? "bg-[color:var(--rojo)]"
                  : lleno ? "bg-[color:var(--acento)] scale-110 shadow-[0_0_12px_rgba(232,199,137,.6)]"
                  : "bg-[color:var(--bg-3)] border border-[color:var(--linea-2)]"}`} />
          );
        })}
      </div>
      <div className={`h-4 text-[13px] font-semibold mb-3 transition-opacity ${error ? "opacity-100 text-[color:var(--rojo)]" : "opacity-0"}`}>
        Clave incorrecta
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-3 gap-3.5 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <Tecla key={d} onClick={() => teclear(String(d))}>{d}</Tecla>
        ))}
        <span />
        <Tecla onClick={() => teclear("0")}>0</Tecla>
        <Tecla onClick={borrar} tenue><IDelete className="w-6 h-6" /></Tecla>
      </div>
    </div>
  );
}

function Tecla({ children, onClick, tenue }) {
  return (
    <button onClick={onClick}
      className={`aspect-square rounded-2xl text-[24px] font-bold tap flex items-center justify-center
        active:scale-90 transition-transform
        ${tenue ? "text-[color:var(--txt-2)]" : "tarjeta text-[color:var(--txt)] hover:border-[color:var(--linea-2)]"}`}>
      {children}
    </button>
  );
}

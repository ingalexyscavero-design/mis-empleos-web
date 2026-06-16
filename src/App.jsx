import { useState, useEffect, useCallback } from "react";
import { api, API_CONFIGURADA } from "./api";

// ---- Presentación de cada categoría ----
const CATS = {
  A: { nombre: "Categoría A", desc: "Tu carrera · tecnología", icono: "💻", grad: "grad-a", chip: "bg-indigo-100 text-indigo-700" },
  B: { nombre: "Categoría B", desc: "Buen sueldo", icono: "💼", grad: "grad-b", chip: "bg-emerald-100 text-emerald-700" },
  C: { nombre: "Categoría C", desc: "Respaldo", icono: "🧩", grad: "grad-c", chip: "bg-amber-100 text-amber-700" },
};

export default function App() {
  const [tab, setTab] = useState("inicio");
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((txt) => {
    setToast(txt);
    setTimeout(() => setToast(null), 1900);
  }, []);

  if (!API_CONFIGURADA) return <SinConfigurar />;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[84px] relative">
      <div key={tab}>
        {tab === "inicio" && <Inicio irA={setTab} toast={mostrarToast} />}
        {tab === "vacantes" && <Vacantes toast={mostrarToast} />}
        {tab === "historial" && <Historial />}
        {tab === "stats" && <Stats />}
      </div>

      <TabBar tab={tab} setTab={setTab} />

      {toast && (
        <div className="fixed bottom-[98px] left-1/2 -translate-x-1/2 grad-marca text-white
          px-5 py-3 rounded-2xl text-sm font-bold z-[100] glow-marca whitespace-nowrap animate-pop">
          {toast}
        </div>
      )}
    </div>
  );
}

// ======================= TAB BAR =======================
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "inicio", ic: "🏠", tx: "Inicio" },
    { id: "vacantes", ic: "💼", tx: "Vacantes" },
    { id: "historial", ic: "✅", tx: "Historial" },
    { id: "stats", ic: "📊", tx: "Stats" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50
      bg-white/80 backdrop-blur-xl border-t border-white/60 flex px-2 pt-2 pb-3
      shadow-[0_-4px_20px_-8px_rgba(109,40,217,.18)]">
      {tabs.map((t) => {
        const on = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center gap-1 py-1 transition-all">
            <span className={`text-[22px] transition-transform duration-300 ${on ? "scale-110" : "scale-100 opacity-50"}`}>{t.ic}</span>
            <span className={`text-[10px] font-bold transition-colors ${on ? "text-marca" : "text-gray-400"}`}>{t.tx}</span>
            {on && <span className="w-1.5 h-1.5 rounded-full grad-marca" />}
          </button>
        );
      })}
    </div>
  );
}

// ======================= INICIO =======================
function Inicio({ irA, toast }) {
  const [s, setS] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(() => {
    api.stats().then(setS).catch(() => setS({ pendientes: 0, postuladas: 0, descartadas: 0, porCat: {} }));
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const buscar = async () => {
    setCargando(true);
    try {
      const r = await api.actualizar();
      toast(r.nuevas > 0 ? `📥 ${r.nuevas} vacantes nuevas` : "Sin nuevas por ahora");
      cargar();
    } catch { toast("⚠️ Error al buscar"); }
    setCargando(false);
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const fecha = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* Cabecera con degradado */}
      <div className="grad-header text-white px-5 pt-9 pb-16 rounded-b-[34px] relative overflow-hidden">
        <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-white/10 animate-flotar" />
        <div className="absolute top-16 -left-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="relative animate-slideIn">
          <div className="text-white/80 text-sm font-medium capitalize">{fecha}</div>
          <div className="text-white/70 text-[15px] mt-3">{saludo} 👋</div>
          <h1 className="text-[30px] font-extrabold tracking-tight leading-tight">Hola, Alexys</h1>
        </div>
      </div>

      {/* Tarjeta de resumen flotante (encima del degradado) */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-4 shadow-[0_12px_40px_-12px_rgba(109,40,217,.3)] grid grid-cols-3 gap-2 animate-pop">
          <Mini num={s?.pendientes} lbl="Pendientes" c="text-marca" />
          <div className="border-x border-gray-100"><Mini num={s?.postuladas} lbl="Postuladas" c="text-emerald-600" /></div>
          <Mini num={s?.descartadas} lbl="Descartadas" c="text-rose-500" />
        </div>
      </div>

      <div className="px-4 pt-6">
        <SeccionTitulo>Elige una categoría</SeccionTitulo>
        {["A", "B", "C"].map((c, i) => (
          <div key={c} style={{ animationDelay: `${i * 80}ms` }} className="animate-aparecer">
            <CardCategoria cat={c} n={s ? (s.porCat?.[c] || 0) : null} onClick={() => irA("vacantes")} />
          </div>
        ))}

        <button onClick={buscar} disabled={cargando}
          className="w-full mt-2 p-4 rounded-2xl bg-white border-2 border-marca-claro text-marca
            font-bold text-[15px] active:scale-[.97] transition disabled:opacity-60 flex items-center justify-center gap-2">
          <span className={cargando ? "animate-spin" : ""}>🔄</span>
          {cargando ? "Buscando en tu correo…" : "Buscar nuevas en mi correo"}
        </button>
      </div>
    </div>
  );
}

function Mini({ num, lbl, c }) {
  return (
    <div className="text-center px-1">
      <div className={`text-[26px] font-extrabold leading-none ${c}`}>
        {num === null || num === undefined ? <span className="inline-block w-7 h-6 rounded skeleton animate-shimmer" /> : num}
      </div>
      <div className="text-[11px] text-gray-400 mt-1.5 font-bold">{lbl}</div>
    </div>
  );
}

function CardCategoria({ cat, n, onClick }) {
  const c = CATS[cat];
  return (
    <button onClick={onClick}
      className="w-full bg-white rounded-3xl p-4 flex items-center gap-4 mb-3 text-left
        shadow-[0_6px_24px_-12px_rgba(0,0,0,.18)] active:scale-[.97] transition-all duration-200
        hover:shadow-[0_12px_30px_-12px_rgba(109,40,217,.3)]">
      <div className={`w-14 h-14 rounded-2xl ${c.grad} flex items-center justify-center text-[26px] shrink-0 shadow-lg`}>
        {c.icono}
      </div>
      <div className="flex-1">
        <div className="text-[17px] font-extrabold">{c.nombre}</div>
        <div className="text-[13px] text-gray-400 mt-0.5 font-medium">{c.desc}</div>
      </div>
      {n === null ? (
        <span className="w-9 h-9 rounded-2xl skeleton animate-shimmer" />
      ) : (
        <div className={`min-w-[40px] h-9 px-2.5 rounded-2xl flex items-center justify-center text-base font-extrabold
          ${n === 0 ? "bg-gray-100 text-gray-300" : `${c.grad} text-white shadow-md`}`}>
          {n}
        </div>
      )}
    </button>
  );
}

// ======================= VACANTES =======================
function Vacantes({ toast }) {
  const [cat, setCat] = useState(null);
  if (cat) return <DetalleCategoria cat={cat} volver={() => setCat(null)} toast={toast} />;

  return (
    <div>
      <Encabezado titulo="Vacantes" sub="Elige una categoría para postular" emoji="💼" />
      <div className="px-4 pt-5">
        {["A", "B", "C"].map((c, i) => (
          <div key={c} style={{ animationDelay: `${i * 80}ms` }} className="animate-aparecer">
            <CardCategoriaSel cat={c} onClick={() => setCat(c)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardCategoriaSel({ cat, onClick }) {
  const [c, setC] = useState(null);
  useEffect(() => { api.contadores(cat).then(setC).catch(() => setC({ pendientes: 0, respondidos: 0 })); }, [cat]);
  const info = CATS[cat];
  return (
    <button onClick={onClick}
      className="w-full bg-white rounded-3xl p-4 flex items-center gap-4 mb-3 text-left
        shadow-[0_6px_24px_-12px_rgba(0,0,0,.18)] active:scale-[.97] transition-all">
      <div className={`w-14 h-14 rounded-2xl ${info.grad} flex items-center justify-center text-[26px] shrink-0 shadow-lg`}>
        {info.icono}
      </div>
      <div className="flex-1">
        <div className="text-[17px] font-extrabold">{info.nombre}</div>
        <div className="text-[13px] text-gray-400 mt-0.5 font-medium">
          {c ? <>
            <span className="text-marca font-bold">{c.pendientes}</span> pendientes ·{" "}
            <span className="text-gray-500 font-bold">{c.respondidos}</span> hechas
          </> : "Cargando…"}
        </div>
      </div>
      <span className="text-gray-300 text-2xl">›</span>
    </button>
  );
}

function DetalleCategoria({ cat, volver, toast }) {
  const [filtro, setFiltro] = useState("pendientes");
  const [pagina, setPagina] = useState(1);
  const [data, setData] = useState(null);
  const [cont, setCont] = useState({ pendientes: 0, respondidos: 0 });

  const cargar = useCallback(() => {
    setData(null);
    api.vacantes(cat, filtro, pagina).then(setData).catch(() => setData({ items: [], total: 0, totalPaginas: 1 }));
  }, [cat, filtro, pagina]);
  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { api.contadores(cat).then(setCont).catch(() => {}); }, [cat]);

  const cambiarFiltro = (f) => { if (f !== filtro) { setFiltro(f); setPagina(1); } };

  const responder = async (codigo, tipo) => {
    setData((d) => ({ ...d, items: d.items.map((v) => v.codigo === codigo ? { ...v, _resuelto: tipo } : v) }));
    toast(tipo === "postular" ? "✅ Guardado en tu hoja" : "❌ Descartada");
    try { await api.accion(codigo, tipo); } catch {}
    api.contadores(cat).then(setCont).catch(() => {});
  };

  const info = CATS[cat];
  return (
    <div>
      {/* Cabecera de categoría con su degradado */}
      <div className={`${info.grad} text-white px-5 pt-9 pb-12 rounded-b-[30px] relative overflow-hidden`}>
        <div className="absolute -top-8 -right-6 w-36 h-36 rounded-full bg-white/15" />
        <button onClick={volver} className="relative text-white/90 text-sm font-bold mb-3 inline-flex items-center gap-1">‹ Volver</button>
        <div className="relative flex items-center gap-3 animate-slideIn">
          <span className="text-4xl">{info.icono}</span>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">{info.nombre}</h1>
            <div className="text-white/80 text-sm">{info.desc}</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {/* Pestañas */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)] mb-5">
          <SubTab activa={filtro === "pendientes"} onClick={() => cambiarFiltro("pendientes")} texto="Pendientes" cnt={cont.pendientes} />
          <SubTab activa={filtro === "respondidos"} onClick={() => cambiarFiltro("respondidos")} texto="Respondidos" cnt={cont.respondidos} />
        </div>

        {!data ? <SkeletonLista /> : data.total === 0 ? (
          <Vacio emoji={filtro === "pendientes" ? "📭" : "📋"} texto={filtro === "pendientes"
            ? "No hay vacantes pendientes aquí. Pulsa “Buscar nuevas” en Inicio."
            : "Todavía no has respondido vacantes de esta categoría."} />
        ) : (
          <>
            {data.items.map((v, i) => (
              <div key={v.codigo} style={{ animationDelay: `${i * 60}ms` }} className="animate-aparecer">
                {filtro === "respondidos" ? <FilaRespondida v={v} /> : <TarjetaVacante v={v} responder={responder} />}
              </div>
            ))}
            <Paginador actual={data.pagina} total={data.totalPaginas} ir={setPagina} />
          </>
        )}
      </div>
    </div>
  );
}

function SubTab({ activa, onClick, texto, cnt }) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all
        ${activa ? "grad-marca text-white shadow-md" : "text-gray-400"}`}>
      {texto}
      <span className={`text-[11px] font-extrabold rounded-full px-1.5 min-w-[20px]
        ${activa ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400"}`}>{cnt}</span>
    </button>
  );
}

function TarjetaVacante({ v, responder }) {
  if (v._resuelto) {
    const post = v._resuelto === "postular";
    return (
      <div className={`rounded-3xl p-5 mb-3 text-center font-extrabold text-white animate-pop
        ${post ? "grad-b glow-verde" : "bg-gradient-to-br from-rose-400 to-rose-500"}`}>
        {post ? "✅ ¡Postulado!" : "❌ Descartada"}
      </div>
    );
  }
  const ubic = v.ubicacion && v.ubicacion !== "Perú";
  return (
    <div className="bg-white rounded-3xl p-[18px] mb-3.5 shadow-[0_6px_24px_-14px_rgba(0,0,0,.25)]">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[11px] text-gray-300 font-bold tracking-wide">{v.codigo} · {v.portal}</span>
        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${CATS[v.categoria]?.chip}`}>{v.categoria}</span>
      </div>
      <h3 className="text-[17px] leading-snug mb-2.5 font-bold">{v.titulo}</h3>
      <div className="space-y-1">
        <Meta icono="🏢" txt={v.empresa} />
        {ubic && <Meta icono="📍" txt={v.ubicacion} />}
        {v.sueldo && <Meta icono="💰" txt={v.sueldo} />}
      </div>
      <div className="mt-3"><ModalidadTag m={v.modalidad} /></div>
      <div className="flex gap-2.5 mt-4">
        <a href={v.enlace} target="_blank" rel="noreferrer"
          className="flex-1 text-center py-3 rounded-2xl bg-gray-100 text-gray-700 text-sm font-bold active:scale-95 transition">🔍 Ver</a>
        <button onClick={() => responder(v.codigo, "descartar")}
          className="w-14 py-3 rounded-2xl bg-rose-50 text-rose-500 text-lg font-bold active:scale-90 transition">❌</button>
        <button onClick={() => responder(v.codigo, "postular")}
          className="flex-1 py-3 rounded-2xl grad-b text-white text-sm font-bold active:scale-95 transition shadow-md">✅ Postular</button>
      </div>
    </div>
  );
}

function Meta({ icono, txt }) {
  return <div className="text-[13.5px] text-gray-600 flex items-center gap-1.5"><span>{icono}</span><span>{txt}</span></div>;
}

function FilaRespondida({ v }) {
  const post = v.estado === "Postulado";
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 mb-2.5 flex items-center gap-3 shadow-[0_4px_18px_-12px_rgba(0,0,0,.25)]">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 text-white
        ${post ? "grad-b" : "bg-gradient-to-br from-rose-400 to-rose-500"}`}>
        {post ? "✓" : "✕"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{v.titulo}</div>
        <div className="text-xs text-gray-400">{v.empresa} · {post ? "Postulado" : "Descartado"}</div>
      </div>
      <a href={v.enlace} target="_blank" rel="noreferrer"
        className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-sm">🔍</a>
    </div>
  );
}

function ModalidadTag({ m }) {
  const t = (m || "").toLowerCase();
  let txt = "📌 Por confirmar", cls = "bg-gray-100 text-gray-500";
  if (t.includes("remoto")) { txt = "🏠 Remoto"; cls = "bg-emerald-50 text-emerald-600"; }
  else if (t.includes("hibrid") || t.includes("híbrid")) { txt = "🔄 Híbrido"; cls = "bg-violet-50 text-violet-600"; }
  else if (t.includes("presencial")) { txt = "🏢 Presencial"; cls = "bg-blue-50 text-blue-600"; }
  return <span className={`text-xs px-3 py-1.5 rounded-xl font-bold ${cls}`}>{txt}</span>;
}

// Paginador inteligente: ‹ 1 2 3 … 10 11 ›
function Paginador({ actual, total, ir }) {
  if (total <= 1) return null;
  const nums = [];
  if (total <= 7) for (let i = 1; i <= total; i++) nums.push(i);
  else if (actual <= 4) nums.push(1, 2, 3, 4, 5, "…", total);
  else if (actual >= total - 3) nums.push(1, "…", total - 4, total - 3, total - 2, total - 1, total);
  else nums.push(1, "…", actual - 1, actual, actual + 1, "…", total);

  const Btn = ({ children, onClick, on, disabled }) => (
    <button onClick={onClick} disabled={disabled}
      className={`min-w-[40px] h-10 rounded-2xl text-sm font-extrabold flex items-center justify-center px-1
        active:scale-90 transition disabled:opacity-30
        ${on ? "grad-marca text-white shadow-md" : "bg-white text-gray-600 shadow-[0_4px_14px_-8px_rgba(0,0,0,.2)]"}`}>
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap my-5 pb-2">
      <Btn onClick={() => ir(actual - 1)} disabled={actual === 1}>‹</Btn>
      {nums.map((n, i) => n === "…"
        ? <span key={i} className="min-w-[18px] text-center text-gray-300">…</span>
        : <Btn key={i} on={n === actual} onClick={() => ir(n)}>{n}</Btn>)}
      <Btn onClick={() => ir(actual + 1)} disabled={actual === total}>›</Btn>
    </div>
  );
}

// ======================= HISTORIAL =======================
function Historial() {
  const [data, setData] = useState(null);
  const [pagina, setPagina] = useState(1);
  const porPag = 12;

  useEffect(() => {
    setData(null);
    api.historial((pagina - 1) * porPag, porPag).then(setData).catch(() => setData({ items: [], total: 0 }));
  }, [pagina]);
  const totalPaginas = data ? Math.max(1, Math.ceil(data.total / porPag)) : 1;

  return (
    <div>
      <Encabezado titulo="Historial" sub={data ? `${data.total} respondidas` : "…"} emoji="✅" />
      <div className="px-4 pt-5">
        {!data ? <SkeletonLista /> : data.total === 0 ? (
          <Vacio emoji="📋" texto="Aún no has respondido vacantes. Empieza desde Vacantes." />
        ) : (
          <>
            {data.items.map((v, i) => (
              <div key={v.codigo} style={{ animationDelay: `${i * 40}ms` }} className="animate-aparecer">
                <FilaRespondida v={v} />
              </div>
            ))}
            <Paginador actual={pagina} total={totalPaginas} ir={setPagina} />
          </>
        )}
      </div>
    </div>
  );
}

// ======================= STATS =======================
function Stats() {
  const [s, setS] = useState(null);
  useEffect(() => { api.stats().then(setS).catch(() => {}); }, []);

  const respondidas = s ? s.postuladas + s.descartadas : 0;
  const pct = s && s.total ? Math.round((respondidas / s.total) * 100) : 0;

  return (
    <div>
      <Encabezado titulo="Estadísticas" sub="Tu progreso de postulación" emoji="📊" />
      <div className="px-4 pt-5">
        {!s ? <SkeletonLista /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard n={s.total} l="Total recibidas" grad="grad-a" />
              <StatCard n={s.pendientes} l="Pendientes" grad="grad-marca" />
              <StatCard n={s.postuladas} l="Postuladas" grad="grad-b" />
              <StatCard n={s.descartadas} l="Descartadas" grad="grad-c" />
            </div>

            <SeccionTitulo>Progreso general</SeccionTitulo>
            <div className="bg-white rounded-3xl p-5 shadow-[0_6px_24px_-14px_rgba(0,0,0,.25)]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-600">{respondidas} de {s.total} revisadas</span>
                <span className="text-2xl font-extrabold texto-grad">{pct}%</span>
              </div>
              <Barra pct={pct} grad="grad-marca" />
            </div>

            <SeccionTitulo>Pendientes por categoría</SeccionTitulo>
            {["A", "B", "C"].map((c) => {
              const n = s.porCat?.[c] || 0;
              const p = s.pendientes ? Math.round((n / s.pendientes) * 100) : 0;
              return (
                <div key={c} className="bg-white rounded-2xl p-4 shadow-[0_4px_18px_-12px_rgba(0,0,0,.2)] mb-2.5">
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span>{CATS[c].icono} {CATS[c].nombre}</span><span className="text-gray-400">{n}</span>
                  </div>
                  <Barra pct={p} grad={CATS[c].grad} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ n, l, grad }) {
  return (
    <div className={`${grad} rounded-3xl p-5 text-white shadow-lg animate-pop`}>
      <div className="text-[34px] font-extrabold leading-none">{n}</div>
      <div className="text-[13px] text-white/85 mt-1.5 font-bold">{l}</div>
    </div>
  );
}

function Barra({ pct, grad }) {
  return (
    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
      <div className={`h-full rounded-full ${grad} transition-all duration-700`} style={{ width: pct + "%" }} />
    </div>
  );
}

// ======================= COMPARTIDOS =======================
function Encabezado({ titulo, sub, emoji }) {
  return (
    <div className="grad-header text-white px-5 pt-9 pb-10 rounded-b-[30px] relative overflow-hidden">
      <div className="absolute -top-8 -right-6 w-36 h-36 rounded-full bg-white/10 animate-flotar" />
      <div className="relative animate-slideIn">
        <h1 className="text-[28px] font-extrabold">{emoji} {titulo}</h1>
        <div className="text-white/80 text-sm mt-1 capitalize">{sub}</div>
      </div>
    </div>
  );
}

function SeccionTitulo({ children }) {
  return <div className="text-[13px] font-extrabold text-gray-400 uppercase tracking-wider mt-7 mb-3 mx-1">{children}</div>;
}

function SkeletonLista() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-[18px] shadow-sm">
          <div className="h-3 w-20 rounded skeleton animate-shimmer mb-3" />
          <div className="h-4 w-3/4 rounded skeleton animate-shimmer mb-2" />
          <div className="h-3 w-1/2 rounded skeleton animate-shimmer mb-4" />
          <div className="flex gap-2"><div className="h-10 flex-1 rounded-2xl skeleton animate-shimmer" />
            <div className="h-10 flex-1 rounded-2xl skeleton animate-shimmer" /></div>
        </div>
      ))}
    </div>
  );
}

function Vacio({ emoji, texto }) {
  return (
    <div className="text-center text-gray-400 py-16 px-6 text-[15px] leading-relaxed animate-aparecer">
      <span className="text-[52px] block mb-3 animate-flotar">{emoji}</span>{texto}
    </div>
  );
}

function SinConfigurar() {
  return (
    <div className="max-w-[480px] mx-auto p-8 text-center pt-24">
      <div className="text-6xl mb-4 animate-flotar">⚙️</div>
      <h1 className="text-xl font-extrabold mb-3 texto-grad">Falta configurar la API</h1>
      <p className="text-gray-500 text-sm leading-relaxed">
        Abre <code className="bg-gray-100 px-1.5 py-0.5 rounded">src/api.js</code> y pega la URL de tu Apps Script.
      </p>
    </div>
  );
}

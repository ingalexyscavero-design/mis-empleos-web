import { useState, useEffect, useCallback } from "react";
import { api, API_CONFIGURADA } from "./api";
import {
  IHome, IBriefcase, ICheck, IChart, ICode, ITrend, IPuzzle,
  IBuilding, IPin, IMoney, IExternal, IClose, IRefresh, IInbox,
  IList, IChevron, IArrowLeft, IHome2, IRemote, IHybrid, IClock,
  IHand, IGear,
} from "./icons";

// ---- Presentación de cada categoría (iconos SVG, sin emojis) ----
const CATS = {
  A: { nombre: "Categoría A", desc: "Tu carrera · tecnología", Icono: ICode, grad: "grad-a", chip: "bg-indigo-50 text-indigo-600" },
  B: { nombre: "Categoría B", desc: "Buen sueldo", Icono: ITrend, grad: "grad-b", chip: "bg-emerald-50 text-emerald-600" },
  C: { nombre: "Categoría C", desc: "Respaldo", Icono: IPuzzle, grad: "grad-c", chip: "bg-amber-50 text-amber-600" },
};

export default function App() {
  const [tab, setTab] = useState("inicio");
  // Categoría abierta directamente (al pulsar una card en Inicio o Vacantes)
  const [catAbierta, setCatAbierta] = useState(null);
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((txt, tipo = "ok") => {
    setToast({ txt, tipo });
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Abre una categoría: cambia a la pestaña Vacantes y entra directo a ella.
  const abrirCategoria = useCallback((cat) => {
    setCatAbierta(cat);
    setTab("vacantes");
  }, []);

  const irTab = useCallback((t) => {
    if (t === "vacantes" && tab === "vacantes") setCatAbierta(null); // re-toque = volver a lista
    setTab(t);
  }, [tab]);

  if (!API_CONFIGURADA) return <SinConfigurar />;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[88px] relative">
      <div key={tab + (catAbierta || "")} className="animate-fade">
        {tab === "inicio" && <Inicio abrir={abrirCategoria} toast={mostrarToast} />}
        {tab === "vacantes" && (
          catAbierta
            ? <DetalleCategoria cat={catAbierta} volver={() => setCatAbierta(null)} toast={mostrarToast} />
            : <Vacantes abrir={setCatAbierta} />
        )}
        {tab === "historial" && <Historial />}
        {tab === "stats" && <Stats />}
      </div>

      <TabBar tab={tab} setTab={irTab} />

      <Toast toast={toast} />
    </div>
  );
}

// ======================= TOAST =======================
function Toast({ toast }) {
  if (!toast) return null;
  const estilos = {
    ok: "grad-marca glow-marca",
    ko: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-[0_10px_30px_-8px_rgba(244,63,94,.5)]",
  };
  return (
    <div className={`fixed bottom-[104px] left-1/2 -translate-x-1/2 ${estilos[toast.tipo] || estilos.ok}
      text-white px-5 py-3 rounded-2xl text-sm font-semibold z-[100] whitespace-nowrap animate-pop
      flex items-center gap-2`}>
      {toast.txt}
    </div>
  );
}

// ======================= TAB BAR =======================
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "inicio", Ic: IHome, tx: "Inicio" },
    { id: "vacantes", Ic: IBriefcase, tx: "Vacantes" },
    { id: "historial", Ic: ICheck, tx: "Historial" },
    { id: "stats", Ic: IChart, tx: "Stats" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50
      glass border-t border-white/50 flex px-3 pt-2.5 pb-3
      shadow-[0_-8px_30px_-12px_rgba(109,40,217,.22)]">
      {tabs.map((t) => {
        const on = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center gap-1 py-1 tap relative">
            <span className={`relative flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-300
              ${on ? "grad-marca text-white sombra-marca" : "text-gray-400"}`}>
              <t.Ic className="w-[21px] h-[21px]" />
            </span>
            <span className={`text-[10px] font-bold transition-colors ${on ? "text-marca" : "text-gray-400"}`}>{t.tx}</span>
          </button>
        );
      })}
    </div>
  );
}

// ======================= INICIO =======================
function Inicio({ abrir, toast }) {
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
      toast(r.nuevas > 0 ? `${r.nuevas} vacantes nuevas` : "Sin nuevas por ahora");
      cargar();
    } catch { toast("Error al buscar", "ko"); }
    setCargando(false);
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const fecha = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* Cabecera con degradado + textura + brillo */}
      <div className="grad-header text-white px-5 pt-10 pb-20 rounded-b-[36px] relative overflow-hidden brillo-cabecera textura">
        <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-white/10 animate-flotar" />
        <div className="absolute top-20 -left-12 w-32 h-32 rounded-full bg-white/[.07]" />
        <div className="relative animate-slideIn">
          <div className="text-white/70 text-[13px] font-semibold capitalize tracking-wide">{fecha}</div>
          <div className="text-white/80 text-[15px] mt-3 flex items-center gap-1.5">
            {saludo} <IHand className="w-4 h-4" />
          </div>
          <h1 className="text-[31px] font-extrabold tracking-tight leading-tight mt-0.5">Hola, Alexys</h1>
        </div>
      </div>

      {/* Tarjeta de resumen flotante */}
      <div className="px-4 -mt-11 relative z-10">
        <div className="tarjeta rounded-[26px] p-4 grid grid-cols-3 gap-2 animate-subir">
          <Mini num={s?.pendientes} lbl="Pendientes" c="text-marca" />
          <div className="border-x border-gray-100"><Mini num={s?.postuladas} lbl="Postuladas" c="text-emerald-600" /></div>
          <Mini num={s?.descartadas} lbl="Descartadas" c="text-rose-500" />
        </div>
      </div>

      <div className="px-4 pt-7">
        <SeccionTitulo>Elige una categoría</SeccionTitulo>
        {["A", "B", "C"].map((c, i) => (
          <div key={c} style={{ animationDelay: `${i * 70}ms` }} className="animate-subir">
            <CardCategoria cat={c} n={s ? (s.porCat?.[c] || 0) : null} onClick={() => abrir(c)} />
          </div>
        ))}

        <button onClick={buscar} disabled={cargando}
          className="w-full mt-3 p-4 rounded-[20px] tarjeta text-marca font-bold text-[15px] tap
            disabled:opacity-60 flex items-center justify-center gap-2.5">
          <IRefresh className={`w-5 h-5 ${cargando ? "animate-spin" : ""}`} />
          {cargando ? "Buscando en tu correo…" : "Buscar nuevas en mi correo"}
        </button>
      </div>
    </div>
  );
}

function Mini({ num, lbl, c }) {
  const vacio = num === null || num === undefined;
  return (
    <div className="text-center px-1">
      <div className={`text-[27px] font-extrabold leading-none ${c}`}>
        {vacio ? <span className="inline-block w-7 h-6 rounded-lg skeleton animate-shimmer" /> : num}
      </div>
      <div className="text-[11px] text-gray-400 mt-1.5 font-bold">{lbl}</div>
    </div>
  );
}

function CardCategoria({ cat, n, onClick }) {
  const c = CATS[cat];
  return (
    <button onClick={onClick}
      className="group w-full tarjeta rounded-[24px] p-4 flex items-center gap-4 mb-3 text-left tap
        hover:shadow-[0_16px_40px_-16px_rgba(109,40,217,.4)]">
      <div className={`relative w-14 h-14 rounded-[18px] ${c.grad} flex items-center justify-center text-white shrink-0
        sombra-marca overflow-hidden`}>
        <c.Icono className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <div className="text-[17px] font-extrabold tracking-tight">{c.nombre}</div>
        <div className="text-[13px] text-gray-400 mt-0.5 font-medium">{c.desc}</div>
      </div>
      {n === null ? (
        <span className="w-9 h-9 rounded-xl skeleton animate-shimmer" />
      ) : (
        <div className={`min-w-[40px] h-9 px-2.5 rounded-xl flex items-center justify-center text-base font-extrabold
          ${n === 0 ? "bg-gray-100 text-gray-300" : `${c.grad} text-white sombra-marca`}`}>
          {n}
        </div>
      )}
      <IChevron className="w-5 h-5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

// ======================= VACANTES (lista de categorías) =======================
function Vacantes({ abrir }) {
  return (
    <div>
      <Encabezado titulo="Vacantes" sub="Elige una categoría para revisar" Icono={IBriefcase} />
      <div className="px-4 pt-6">
        {["A", "B", "C"].map((c, i) => (
          <div key={c} style={{ animationDelay: `${i * 70}ms` }} className="animate-subir">
            <CardCategoriaSel cat={c} onClick={() => abrir(c)} />
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
      className="group w-full tarjeta rounded-[24px] p-4 flex items-center gap-4 mb-3 text-left tap">
      <div className={`w-14 h-14 rounded-[18px] ${info.grad} flex items-center justify-center text-white shrink-0 sombra-marca`}>
        <info.Icono className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <div className="text-[17px] font-extrabold tracking-tight">{info.nombre}</div>
        <div className="text-[13px] text-gray-400 mt-0.5 font-medium">
          {c ? <>
            <span className="text-marca font-bold">{c.pendientes}</span> pendientes ·{" "}
            <span className="text-gray-500 font-bold">{c.respondidos}</span> hechas
          </> : "Cargando…"}
        </div>
      </div>
      <IChevron className="w-5 h-5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

// ======================= DETALLE DE CATEGORÍA =======================
// Sub-filtros: Pendientes · Postuladas · Rechazadas
const FILTROS = [
  { id: "pendientes", tx: "Pendientes" },
  { id: "postuladas", tx: "Postuladas" },
  { id: "descartadas", tx: "Rechazadas" },
];

function DetalleCategoria({ cat, volver, toast }) {
  const [filtro, setFiltro] = useState("pendientes");
  const [pagina, setPagina] = useState(1);
  const [data, setData] = useState(null);
  const [cont, setCont] = useState({ pendientes: 0, postuladas: 0, descartadas: 0, respondidos: 0 });

  const recargarCont = useCallback(() => {
    api.contadores(cat).then((c) => setCont({
      pendientes: c.pendientes || 0,
      postuladas: c.postuladas ?? 0,
      descartadas: c.descartadas ?? 0,
      respondidos: c.respondidos || 0,
    })).catch(() => {});
  }, [cat]);

  const cargar = useCallback(() => {
    setData(null);
    api.vacantes(cat, filtro, pagina).then(setData).catch(() => setData({ items: [], total: 0, totalPaginas: 1 }));
  }, [cat, filtro, pagina]);
  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { recargarCont(); }, [recargarCont]);

  const cambiarFiltro = (f) => { if (f !== filtro) { setFiltro(f); setPagina(1); } };

  const responder = async (codigo, tipo) => {
    setData((d) => ({ ...d, items: d.items.map((v) => v.codigo === codigo ? { ...v, _resuelto: tipo } : v) }));
    toast(tipo === "postular" ? "Guardada en tu hoja" : "Descartada", tipo === "postular" ? "ok" : "ko");
    try { await api.accion(codigo, tipo); } catch {}
    recargarCont();
  };

  const info = CATS[cat];
  const cnt = (id) => id === "pendientes" ? cont.pendientes : id === "postuladas" ? cont.postuladas : cont.descartadas;

  return (
    <div>
      {/* Cabecera de categoría con su degradado */}
      <div className={`${info.grad} text-white px-5 pt-10 pb-16 rounded-b-[34px] relative overflow-hidden brillo-cabecera textura`}>
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15" />
        <button onClick={volver}
          className="relative text-white/90 text-sm font-bold mb-4 inline-flex items-center gap-1.5 tap">
          <IArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="relative flex items-center gap-3.5 animate-slideIn">
          <span className="w-14 h-14 rounded-[18px] bg-white/15 flex items-center justify-center">
            <info.Icono className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">{info.nombre}</h1>
            <div className="text-white/80 text-sm">{info.desc}</div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        {/* Sub-pestañas (3 filtros) */}
        <div className="flex gap-1 tarjeta rounded-2xl p-1.5 mb-5">
          {FILTROS.map((f) => (
            <SubTab key={f.id} activa={filtro === f.id} onClick={() => cambiarFiltro(f.id)} texto={f.tx} cnt={cnt(f.id)} />
          ))}
        </div>

        {!data ? <SkeletonLista /> : data.total === 0 ? (
          <Vacio Icono={filtro === "pendientes" ? IInbox : IList} texto={
            filtro === "pendientes" ? "No hay vacantes pendientes aquí. Pulsa “Buscar nuevas” en Inicio."
            : filtro === "postuladas" ? "Aún no has postulado a vacantes de esta categoría."
            : "No has rechazado vacantes de esta categoría."} />
        ) : (
          <>
            {data.items.map((v, i) => (
              <div key={v.codigo} style={{ animationDelay: `${i * 55}ms` }} className="animate-subir">
                {filtro === "pendientes"
                  ? <TarjetaVacante v={v} responder={responder} />
                  : <FilaRespondida v={v} forzar={filtro === "postuladas" ? "Postulado" : "Descartado"} />}
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
      className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300
        ${activa ? "grad-marca text-white sombra-marca" : "text-gray-400 active:scale-95"}`}>
      {texto}
      <span className={`text-[11px] font-extrabold rounded-full px-1.5 min-w-[20px] transition-colors
        ${activa ? "bg-white/25 text-white" : "bg-gray-100 text-gray-400"}`}>{cnt}</span>
    </button>
  );
}

function TarjetaVacante({ v, responder }) {
  if (v._resuelto) {
    const post = v._resuelto === "postular";
    return (
      <div className={`rounded-[24px] p-5 mb-3 flex items-center justify-center gap-2 font-extrabold text-white animate-pop
        ${post ? "grad-b glow-verde" : "bg-gradient-to-br from-rose-400 to-rose-500"}`}>
        {post ? <ICheck className="w-5 h-5" /> : <IClose className="w-5 h-5" />}
        {post ? "¡Postulado!" : "Descartada"}
      </div>
    );
  }
  const ubic = v.ubicacion && v.ubicacion !== "Perú";
  return (
    <div className="tarjeta rounded-[24px] p-[18px] mb-3.5">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[11px] text-gray-300 font-bold tracking-wide">{v.codigo} · {v.portal}</span>
        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${CATS[v.categoria]?.chip}`}>{v.categoria}</span>
      </div>
      <h3 className="text-[17px] leading-snug mb-3 font-bold tracking-tight">{v.titulo}</h3>
      <div className="space-y-1.5">
        <Meta Icono={IBuilding} txt={v.empresa} />
        {ubic && <Meta Icono={IPin} txt={v.ubicacion} />}
        {v.sueldo && <Meta Icono={IMoney} txt={v.sueldo} />}
      </div>
      <div className="mt-3"><ModalidadTag m={v.modalidad} /></div>
      <div className="flex gap-2.5 mt-4">
        <a href={v.enlace} target="_blank" rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gray-100 text-gray-700 text-sm font-bold tap">
          <IExternal className="w-4 h-4" /> Ver
        </a>
        <button onClick={() => responder(v.codigo, "descartar")}
          className="w-14 inline-flex items-center justify-center py-3 rounded-2xl bg-rose-50 text-rose-500 tap">
          <IClose className="w-5 h-5" />
        </button>
        <button onClick={() => responder(v.codigo, "postular")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl grad-b text-white text-sm font-bold tap sombra-marca">
          <ICheck className="w-4 h-4" /> Postular
        </button>
      </div>
    </div>
  );
}

function Meta({ Icono, txt }) {
  return (
    <div className="text-[13.5px] text-gray-600 flex items-center gap-2">
      <Icono className="w-4 h-4 text-gray-400 shrink-0" /><span>{txt}</span>
    </div>
  );
}

function FilaRespondida({ v, forzar }) {
  const estado = forzar || v.estado;
  const post = estado === "Postulado";
  return (
    <div className="tarjeta rounded-[20px] px-4 py-3.5 mb-2.5 flex items-center gap-3 tap">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white
        ${post ? "grad-b" : "bg-gradient-to-br from-rose-400 to-rose-500"}`}>
        {post ? <ICheck className="w-5 h-5" /> : <IClose className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{v.titulo}</div>
        <div className="text-xs text-gray-400 truncate">{v.empresa} · {post ? "Postulado" : "Rechazado"}</div>
      </div>
      <a href={v.enlace} target="_blank" rel="noreferrer"
        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 tap shrink-0">
        <IExternal className="w-4 h-4" />
      </a>
    </div>
  );
}

function ModalidadTag({ m }) {
  const t = (m || "").toLowerCase();
  let txt = "Por confirmar", cls = "bg-gray-100 text-gray-500", Ic = IClock;
  if (t.includes("remoto")) { txt = "Remoto"; cls = "bg-emerald-50 text-emerald-600"; Ic = IRemote; }
  else if (t.includes("hibrid") || t.includes("híbrid")) { txt = "Híbrido"; cls = "bg-violet-50 text-violet-600"; Ic = IHybrid; }
  else if (t.includes("presencial")) { txt = "Presencial"; cls = "bg-blue-50 text-blue-600"; Ic = IHome2; }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold ${cls}`}>
      <Ic className="w-3.5 h-3.5" /> {txt}
    </span>
  );
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
      className={`min-w-[40px] h-10 rounded-2xl text-sm font-extrabold flex items-center justify-center px-1 tap
        disabled:opacity-30 ${on ? "grad-marca text-white sombra-marca" : "tarjeta text-gray-600"}`}>
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap my-5 pb-2">
      <Btn onClick={() => ir(actual - 1)} disabled={actual === 1}><IChevron className="w-4 h-4 rotate-180" /></Btn>
      {nums.map((n, i) => n === "…"
        ? <span key={i} className="min-w-[18px] text-center text-gray-300">…</span>
        : <Btn key={i} on={n === actual} onClick={() => ir(n)}>{n}</Btn>)}
      <Btn onClick={() => ir(actual + 1)} disabled={actual === total}><IChevron className="w-4 h-4" /></Btn>
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
      <Encabezado titulo="Historial" sub={data ? `${data.total} respondidas` : "…"} Icono={ICheck} />
      <div className="px-4 pt-6">
        {!data ? <SkeletonLista /> : data.total === 0 ? (
          <Vacio Icono={IList} texto="Aún no has respondido vacantes. Empieza desde Vacantes." />
        ) : (
          <>
            {data.items.map((v, i) => (
              <div key={v.codigo} style={{ animationDelay: `${i * 35}ms` }} className="animate-subir">
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
      <Encabezado titulo="Estadísticas" sub="Tu progreso de postulación" Icono={IChart} />
      <div className="px-4 pt-6">
        {!s ? <SkeletonLista /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard n={s.total} l="Total recibidas" grad="grad-a" />
              <StatCard n={s.pendientes} l="Pendientes" grad="grad-marca" />
              <StatCard n={s.postuladas} l="Postuladas" grad="grad-b" />
              <StatCard n={s.descartadas} l="Descartadas" grad="grad-c" />
            </div>

            <SeccionTitulo>Progreso general</SeccionTitulo>
            <div className="tarjeta rounded-[24px] p-5">
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-sm font-bold text-gray-600">{respondidas} de {s.total} revisadas</span>
                <span className="text-2xl font-extrabold texto-grad">{pct}%</span>
              </div>
              <Barra pct={pct} grad="grad-marca" />
            </div>

            <SeccionTitulo>Pendientes por categoría</SeccionTitulo>
            {["A", "B", "C"].map((c) => {
              const n = s.porCat?.[c] || 0;
              const p = s.pendientes ? Math.round((n / s.pendientes) * 100) : 0;
              const Ic = CATS[c].Icono;
              return (
                <div key={c} className="tarjeta rounded-[20px] p-4 mb-2.5">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg ${CATS[c].grad} text-white flex items-center justify-center`}>
                        <Ic className="w-4 h-4" />
                      </span>
                      {CATS[c].nombre}
                    </span>
                    <span className="text-gray-400">{n}</span>
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
    <div className={`${grad} rounded-[24px] p-5 text-white sombra-marca animate-subir relative overflow-hidden textura`}>
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
function Encabezado({ titulo, sub, Icono }) {
  return (
    <div className="grad-header text-white px-5 pt-10 pb-12 rounded-b-[34px] relative overflow-hidden brillo-cabecera textura">
      <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/10 animate-flotar" />
      <div className="relative animate-slideIn flex items-center gap-3">
        {Icono && (
          <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
            <Icono className="w-6 h-6" />
          </span>
        )}
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">{titulo}</h1>
          <div className="text-white/80 text-sm capitalize">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function SeccionTitulo({ children }) {
  return <div className="text-[12px] font-extrabold text-gray-400 uppercase tracking-[.12em] mt-7 mb-3 mx-1">{children}</div>;
}

function SkeletonLista() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="tarjeta rounded-[24px] p-[18px]">
          <div className="h-3 w-20 rounded-lg skeleton animate-shimmer mb-3" />
          <div className="h-4 w-3/4 rounded-lg skeleton animate-shimmer mb-2" />
          <div className="h-3 w-1/2 rounded-lg skeleton animate-shimmer mb-4" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 rounded-2xl skeleton animate-shimmer" />
            <div className="h-10 flex-1 rounded-2xl skeleton animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Vacio({ Icono, texto }) {
  return (
    <div className="text-center text-gray-400 py-16 px-6 text-[15px] leading-relaxed animate-fade">
      <span className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white tarjeta mb-4 animate-flotar text-marca/60">
        <Icono className="w-9 h-9" />
      </span>
      <p>{texto}</p>
    </div>
  );
}

function SinConfigurar() {
  return (
    <div className="max-w-[480px] mx-auto p-8 text-center pt-24">
      <span className="inline-flex items-center justify-center w-20 h-20 rounded-3xl tarjeta mb-5 animate-flotar text-marca">
        <IGear className="w-10 h-10" />
      </span>
      <h1 className="text-xl font-extrabold mb-3 texto-grad">Falta configurar la API</h1>
      <p className="text-gray-500 text-sm leading-relaxed">
        Abre <code className="bg-gray-100 px-1.5 py-0.5 rounded">src/api.js</code> y pega la URL de tu Apps Script.
      </p>
    </div>
  );
}

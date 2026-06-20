import { useState, useEffect, useCallback } from "react";
import { api, API_CONFIGURADA } from "./api";
import Splash from "./Splash";
import Login from "./Login";
import {
  IHome, IBriefcase, ICheck, IChart, ICode, ITrend, IPuzzle,
  IBuilding, IPin, IMoney, IExternal, IClose, IRefresh, IInbox,
  IList, IChevron, IArrowLeft, IHome2, IRemote, IHybrid, IClock,
  IHand, IGear, IPencil, ILogout, ISpark,
} from "./icons";

const SESION_KEY = "empleos_ac_sesion";

// ---- Presentación de cada categoría (iconos SVG, sin emojis) ----
// En el tema oscuro, A/B/C se distinguen por un tono frío y apagado cada una.
const CATS = {
  A: { nombre: "Categoría A", desc: "Tu carrera · tecnología", Icono: ICode,   grad: "grad-a", chip: "cat-a" },
  B: { nombre: "Categoría B", desc: "Buen sueldo",            Icono: ITrend,  grad: "grad-b", chip: "cat-b" },
  C: { nombre: "Categoría C", desc: "Respaldo",               Icono: IPuzzle, grad: "grad-c", chip: "cat-c" },
};

export default function App() {
  const [splash, setSplash] = useState(true);
  const [auth, setAuth] = useState(() => localStorage.getItem(SESION_KEY) === "ok");
  const [tab, setTab] = useState("inicio");
  const [catAbierta, setCatAbierta] = useState(null);
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((txt, tipo = "ok") => {
    setToast({ txt, tipo });
    setTimeout(() => setToast(null), 2000);
  }, []);

  const entrar = useCallback(() => {
    localStorage.setItem(SESION_KEY, "ok");
    setAuth(true);
  }, []);

  const salir = useCallback(() => {
    if (!window.confirm("¿Cerrar sesión?")) return;
    localStorage.removeItem(SESION_KEY);
    setAuth(false);
    setTab("inicio");
    setCatAbierta(null);
  }, []);

  const abrirCategoria = useCallback((cat) => {
    setCatAbierta(cat);
    setTab("vacantes");
  }, []);

  const irTab = useCallback((t) => {
    if (t === "vacantes" && tab === "vacantes") setCatAbierta(null);
    setTab(t);
  }, [tab]);

  // 1) Splash siempre al abrir
  if (splash) return <Splash onListo={() => setSplash(false)} />;
  // 2) Login si no hay sesión guardada
  if (!auth) return <Login onEntrar={entrar} />;
  // 3) App
  if (!API_CONFIGURADA) return <SinConfigurar />;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[88px] relative">
      <div key={tab + (catAbierta || "")} className="animate-fade">
        {tab === "inicio" && <Inicio abrir={abrirCategoria} irTab={setTab} toast={mostrarToast} salir={salir} />}
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
    ok: "btn-acento",
    ko: "bg-[color:var(--rojo)] text-[#2a0a10] shadow-[0_10px_30px_-8px_rgba(242,120,138,.45)]",
  };
  return (
    <div className={`fixed bottom-[104px] left-1/2 -translate-x-1/2 ${estilos[toast.tipo] || estilos.ok}
      px-5 py-3 rounded-2xl text-sm font-bold z-[100] whitespace-nowrap animate-pop
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
      glass flex px-3 pt-2.5 pb-3">
      {tabs.map((t) => {
        const on = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center gap-1 py-1 tap relative">
            {on && <span className="absolute top-0 w-8 h-[3px] rounded-full bg-[color:var(--acento)]" />}
            <span className={`relative flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-300
              ${on ? "text-marca bg-[rgba(232,199,137,.10)]" : "text-[color:var(--txt-3)]"}`}>
              <t.Ic className="w-[21px] h-[21px]" />
            </span>
            <span className={`text-[10px] font-semibold transition-colors ${on ? "text-marca" : "text-[color:var(--txt-3)]"}`}>{t.tx}</span>
          </button>
        );
      })}
    </div>
  );
}

// ======================= INICIO (dashboard del día) =======================
function Inicio({ irTab, toast, salir }) {
  const [s, setS] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(() => {
    api.stats().then(setS).catch(() => setS({ total: 0, pendientes: 0, postuladas: 0, descartadas: 0, porCat: {} }));
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

  const respondidas = s ? s.postuladas + s.descartadas : 0;
  const pct = s && s.total ? Math.round((respondidas / s.total) * 100) : 0;
  const hayPendientes = s && s.pendientes > 0;

  return (
    <div>
      {/* Cabecera: saludo + cerrar sesión */}
      <div className="grad-header px-5 pt-12 pb-16 relative overflow-hidden">
        <button onClick={salir} type="button"
          className="absolute top-12 right-5 z-20 w-10 h-10 rounded-xl tarjeta-2 flex items-center justify-center text-[color:var(--txt-2)] tap active:text-[color:var(--rojo)]"
          title="Cerrar sesión" aria-label="Cerrar sesión">
          <ILogout className="w-[19px] h-[19px]" />
        </button>
        <div className="relative animate-slideIn">
          <div className="inline-flex items-center gap-2 text-[color:var(--txt-3)] text-[12px] font-semibold uppercase tracking-[.16em]">
            <span className="w-5 h-px bg-[color:var(--acento)] opacity-60" />
            {fecha}
          </div>
          <h1 className="text-[30px] font-bold tracking-tight leading-tight mt-3">{saludo},</h1>
          <h1 className="text-[34px] font-extrabold tracking-tight leading-none">
            <span className="text-marca">Alexys</span> <IHand className="inline w-6 h-6 -mt-1 text-marca" />
          </h1>
        </div>
      </div>

      {/* Estado del día: cuántas esperan */}
      <div className="px-4 relative z-10">
        <div className="tarjeta p-5 animate-subir">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[13px] text-[color:var(--txt-2)] font-medium">Vacantes esperándote</div>
              <div className="text-[40px] font-extrabold leading-none mt-1 text-marca">
                {s ? s.pendientes : <span className="inline-block w-12 h-9 rounded-lg skeleton animate-shimmer" />}
              </div>
            </div>
            <button onClick={() => irTab("vacantes")} disabled={!hayPendientes}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-acento text-[13px] font-bold tap disabled:opacity-40">
              Revisar <IChevron className="w-4 h-4" />
            </button>
          </div>

          {/* Resumen en 3 */}
          <div className="grid grid-cols-3 mt-5 pt-4 border-t border-[color:var(--linea)]">
            <Mini num={s?.pendientes} lbl="Pendientes" c="text-marca" />
            <Mini num={s?.postuladas} lbl="Postuladas" c="text-[color:var(--verde)]" borde />
            <Mini num={s?.descartadas} lbl="Descartadas" c="text-[color:var(--rojo)]" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-2">
        {/* Botón protagonista: buscar nuevas */}
        <button onClick={buscar} disabled={cargando}
          className="w-full mt-3 py-4 rounded-2xl btn-acento font-bold text-[15px] tap
            disabled:opacity-60 flex items-center justify-center gap-2.5 animate-subir">
          <IRefresh className={`w-5 h-5 ${cargando ? "animate-spin" : ""}`} />
          {cargando ? "Buscando en tu correo…" : "Buscar nuevas en mi correo"}
        </button>

        {/* Progreso general */}
        <SeccionTitulo>Tu progreso</SeccionTitulo>
        <div className="tarjeta p-5 animate-subir">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[13px] font-semibold text-[color:var(--txt-2)]">
              {respondidas} de {s ? s.total : "—"} revisadas
            </span>
            <span className="text-[22px] font-extrabold text-marca leading-none">{pct}%</span>
          </div>
          <Barra pct={pct} />
          <div className="flex items-center gap-2 mt-4 text-[12.5px] text-[color:var(--txt-2)]">
            <ISpark className="w-4 h-4 text-marca shrink-0" />
            {hayPendientes
              ? <span>Tienes <b className="text-marca">{s.pendientes}</b> por revisar. ¡Sigue así!</span>
              : <span>¡Todo al día! Pulsa “Buscar nuevas” para más.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ num, lbl, c, borde }) {
  const vacio = num === null || num === undefined;
  return (
    <div className={`text-center px-1 ${borde ? "border-x border-[color:var(--linea)]" : ""}`}>
      <div className={`text-[30px] font-extrabold leading-none tracking-tight ${c}`}>
        {vacio ? <span className="inline-block w-8 h-7 rounded-lg skeleton animate-shimmer" /> : num}
      </div>
      <div className="text-[10.5px] text-[color:var(--txt-3)] mt-2 font-bold uppercase tracking-wider">{lbl}</div>
    </div>
  );
}

// ======================= VACANTES (lista de categorías) =======================
function Vacantes({ abrir }) {
  return (
    <div>
      <Encabezado titulo="Vacantes" sub="Elige una categoría para revisar" Icono={IBriefcase} />
      <div className="px-4 pt-5">
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
      className="group w-full tarjeta p-4 flex items-center gap-4 mb-3 text-left tap
        hover:border-[color:var(--linea-2)]">
      <div className={`w-[52px] h-[52px] rounded-2xl ${info.grad} flex items-center justify-center shrink-0`}>
        <info.Icono className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[16px] font-bold tracking-tight">{info.nombre}</div>
        <div className="text-[12.5px] text-[color:var(--txt-2)] mt-0.5 font-medium">{info.desc}</div>
      </div>
      {!c ? (
        <span className="w-12 h-12 rounded-2xl skeleton animate-shimmer" />
      ) : (
        <div className="flex flex-col items-end shrink-0">
          <span className={`text-[22px] font-extrabold leading-none ${c.pendientes === 0 ? "text-[color:var(--txt-3)]" : "text-marca"}`}>{c.pendientes}</span>
          <span className="text-[10px] text-[color:var(--txt-3)] font-semibold uppercase tracking-wide mt-1">{c.respondidos} hechas</span>
        </div>
      )}
      <IChevron className="w-5 h-5 text-[color:var(--txt-3)] group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

// ======================= DETALLE DE CATEGORÍA =======================
const FILTROS = [
  { id: "pendientes", tx: "Pendientes" },
  { id: "postuladas", tx: "Postuladas" },
  { id: "descartadas", tx: "Rechazadas" },
];

function DetalleCategoria({ cat, volver, toast }) {
  const [filtro, setFiltro] = useState("pendientes");
  const [modalidad, setModalidad] = useState("todas");
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
    api.vacantes(cat, filtro, pagina, 6, modalidad)
      .then(setData).catch(() => setData({ items: [], total: 0, totalPaginas: 1 }));
  }, [cat, filtro, pagina, modalidad]);
  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { recargarCont(); }, [recargarCont]);

  const cambiarFiltro = (f) => { if (f !== filtro) { setFiltro(f); setPagina(1); } };
  const cambiarModalidad = (m) => { if (m !== modalidad) { setModalidad(m); setPagina(1); } };

  const responder = async (codigo, tipo) => {
    setData((d) => ({ ...d, items: d.items.map((v) => v.codigo === codigo ? { ...v, _resuelto: tipo } : v) }));
    toast(tipo === "postular" ? "Guardada en tu hoja" : "Descartada", tipo === "postular" ? "ok" : "ko");
    try { await api.accion(codigo, tipo); } catch {}
    recargarCont();
  };

  // Corregir un clic equivocado: mover una vacante respondida a otro estado.
  const mover = async (codigo, estado) => {
    setData((d) => ({ ...d, items: d.items.filter((v) => v.codigo !== codigo), total: d.total - 1 }));
    const txt = estado === "Postulado" ? "Movida a Postuladas"
      : estado === "Descartada" ? "Movida a Rechazadas" : "Devuelta a Pendientes";
    toast(txt, estado === "Descartada" ? "ko" : "ok");
    try { await api.mover(codigo, estado); } catch {}
    recargarCont();
  };

  const info = CATS[cat];
  const cnt = (id) => id === "pendientes" ? cont.pendientes : id === "postuladas" ? cont.postuladas : cont.descartadas;

  return (
    <div>
      {/* Cabecera de categoría */}
      <div className="cabecera px-5 pt-12 pb-7 relative overflow-hidden">
        <button onClick={volver}
          className="relative text-[color:var(--txt-2)] text-[13px] font-bold mb-5 inline-flex items-center gap-1.5 tap hover:text-[color:var(--txt)]">
          <IArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="relative flex items-center gap-3.5 animate-slideIn">
          <span className={`w-14 h-14 rounded-2xl ${info.grad} flex items-center justify-center shrink-0`}>
            <info.Icono className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-[25px] font-extrabold leading-tight tracking-tight">{info.nombre}</h1>
            <div className="text-[color:var(--txt-2)] text-sm">{info.desc}</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-1 relative z-10">
        {/* Sub-pestañas (3 filtros) */}
        <div className="flex gap-1 tarjeta-2 rounded-2xl p-1.5 mb-3.5">
          {FILTROS.map((f) => (
            <SubTab key={f.id} activa={filtro === f.id} onClick={() => cambiarFiltro(f.id)} texto={f.tx} cnt={cnt(f.id)} />
          ))}
        </div>

        {/* Filtro por modalidad (chips deslizables) */}
        <FiltroModalidad valor={modalidad} cambiar={cambiarModalidad} />

        {!data ? <SkeletonLista /> : data.total === 0 ? (
          <Vacio Icono={filtro === "pendientes" ? IInbox : IList} texto={
            modalidad !== "todas"
              ? "Ninguna vacante con esa modalidad aquí. Prueba con “Todas”."
              : filtro === "pendientes" ? "No hay vacantes pendientes aquí. Pulsa “Buscar nuevas” en Inicio."
              : filtro === "postuladas" ? "Aún no has postulado a vacantes de esta categoría."
              : "No has rechazado vacantes de esta categoría."} />
        ) : (
          <>
            {data.items.map((v, i) => (
              <div key={v.codigo} style={{ animationDelay: `${i * 55}ms` }} className="animate-subir">
                {filtro === "pendientes"
                  ? <TarjetaVacante v={v} responder={responder} />
                  : <FilaRespondida v={v} forzar={filtro === "postuladas" ? "Postulado" : "Descartado"} mover={mover} />}
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
        ${activa ? "btn-acento" : "text-[color:var(--txt-2)] active:scale-95"}`}>
      {texto}
      <span className={`text-[11px] font-extrabold rounded-full px-1.5 min-w-[20px] transition-colors
        ${activa ? "bg-[rgba(32,24,10,.18)] text-[#20180a]" : "bg-[color:var(--bg-3)] text-[color:var(--txt-3)]"}`}>{cnt}</span>
    </button>
  );
}

// Chips para filtrar por modalidad dentro de una categoría.
const MODALIDADES = [
  { id: "todas", tx: "Todas", Ic: null },
  { id: "remoto", tx: "Remoto", Ic: IRemote },
  { id: "presencial", tx: "Presencial", Ic: IHome2 },
  { id: "hibrido", tx: "Híbrido", Ic: IHybrid },
  { id: "sin", tx: "No indicada", Ic: IClock },
];

function FiltroModalidad({ valor, cambiar }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1 no-scrollbar">
      {MODALIDADES.map((m) => {
        const on = valor === m.id;
        return (
          <button key={m.id} onClick={() => cambiar(m.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold tap transition-all duration-200 border
              ${on
                ? "border-[color:var(--acento)] text-marca bg-[rgba(232,199,137,.10)]"
                : "border-[color:var(--linea)] text-[color:var(--txt-2)] bg-[color:var(--bg-2)]"}`}>
            {m.Ic && <m.Ic className="w-3.5 h-3.5" />}
            {m.tx}
          </button>
        );
      })}
    </div>
  );
}

function TarjetaVacante({ v, responder }) {
  if (v._resuelto) {
    const post = v._resuelto === "postular";
    return (
      <div className={`rounded-[22px] p-5 mb-3 flex items-center justify-center gap-2 font-extrabold animate-pop
        ${post ? "bg-[color:var(--verde)] text-[#0a261b]" : "bg-[color:var(--rojo)] text-[#2a0a10]"}`}>
        {post ? <ICheck className="w-5 h-5" /> : <IClose className="w-5 h-5" />}
        {post ? "¡Postulado!" : "Descartada"}
      </div>
    );
  }
  const ubic = v.ubicacion && v.ubicacion !== "Perú";
  return (
    <div className="tarjeta p-5 mb-3.5">
      {/* Línea superior: código + chip categoría + modalidad */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10.5px] text-[color:var(--txt-3)] font-bold tracking-[.08em] uppercase">{v.codigo}</span>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${CATS[v.categoria]?.chip}`}>{v.categoria}</span>
        <span className="ml-auto"><ModalidadTag m={v.modalidad} small /></span>
      </div>

      <h3 className="text-[18px] leading-snug font-bold tracking-tight">{v.titulo}</h3>

      <div className="mt-2.5 space-y-1.5">
        <Meta Icono={IBuilding} txt={v.empresa} />
        {ubic && <Meta Icono={IPin} txt={v.ubicacion} />}
        {v.sueldo && <Meta Icono={IMoney} txt={v.sueldo} />}
      </div>

      {/* Pie: fuente + acciones */}
      <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-[color:var(--linea)]">
        <a href={v.enlace} target="_blank" rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl tarjeta-2 text-[color:var(--txt-2)] text-[13px] font-bold tap">
          <IExternal className="w-4 h-4" /> Ver
        </a>
        <button onClick={() => responder(v.codigo, "descartar")}
          className="w-11 h-[42px] inline-flex items-center justify-center rounded-xl bg-[rgba(242,120,138,.12)] text-[color:var(--rojo)] tap">
          <IClose className="w-5 h-5" />
        </button>
        <button onClick={() => responder(v.codigo, "postular")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-[42px] rounded-xl bg-[color:var(--verde)] text-[#0a261b] text-[14px] font-bold tap glow-verde">
          <ICheck className="w-4 h-4" /> Postular
        </button>
      </div>
    </div>
  );
}

function Meta({ Icono, txt }) {
  return (
    <div className="text-[13.5px] text-[color:var(--txt)] flex items-center gap-2">
      <Icono className="w-4 h-4 text-[color:var(--txt-3)] shrink-0" /><span>{txt}</span>
    </div>
  );
}

function FilaRespondida({ v, forzar, mover }) {
  const estado = forzar || v.estado;
  const post = estado === "Postulado";
  const [menu, setMenu] = useState(false);

  const opciones = [
    { estado: "Postulado", tx: "Postulada", Ic: ICheck, cls: "text-[color:var(--verde)]" },
    { estado: "Descartada", tx: "Rechazada", Ic: IClose, cls: "text-[color:var(--rojo)]" },
    { estado: "Listo", tx: "Pendiente", Ic: IInbox, cls: "text-marca" },
  ].filter((o) => o.estado !== (post ? "Postulado" : "Descartada"));

  return (
    <div className="mb-2.5">
      <div className="tarjeta rounded-[18px] px-4 py-3.5 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${post ? "bg-[rgba(95,214,168,.14)] text-[color:var(--verde)]" : "bg-[rgba(242,120,138,.14)] text-[color:var(--rojo)]"}`}>
          {post ? <ICheck className="w-5 h-5" /> : <IClose className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate">{v.titulo}</div>
          <div className="text-xs text-[color:var(--txt-2)] truncate flex items-center gap-1.5">
            <span className="truncate">{v.empresa}</span>
            <ModalidadMini m={v.modalidad} />
          </div>
        </div>
        {mover && (
          <button onClick={() => setMenu((x) => !x)}
            className={`w-9 h-9 inline-flex items-center justify-center rounded-xl tap shrink-0 transition-colors
              ${menu ? "btn-acento" : "tarjeta-2 text-[color:var(--txt-2)]"}`}>
            <IPencil className="w-4 h-4" />
          </button>
        )}
        <a href={v.enlace} target="_blank" rel="noreferrer"
          className="w-9 h-9 inline-flex items-center justify-center rounded-xl tarjeta-2 text-[color:var(--txt-2)] tap shrink-0">
          <IExternal className="w-4 h-4" />
        </a>
      </div>

      {menu && mover && (
        <div className="tarjeta rounded-[16px] mt-1.5 p-2 flex gap-2 animate-pop">
          {opciones.map((o) => (
            <button key={o.estado}
              onClick={() => { setMenu(false); mover(v.codigo, o.estado); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl tarjeta-2 text-[12.5px] font-bold tap active:scale-95">
              <o.Ic className={`w-4 h-4 ${o.cls}`} /> {o.tx}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Modalidad compacta (puntito de color + texto) para filas respondidas.
function ModalidadMini({ m }) {
  const t = (m || "").toLowerCase();
  let txt = "Sin modalidad", color = "bg-[color:var(--txt-3)]";
  if (t.includes("remoto")) { txt = "Remoto"; color = "bg-[color:var(--verde)]"; }
  else if (t.includes("hibrid") || t.includes("híbrid")) { txt = "Híbrido"; color = "bg-[color:var(--violeta)]"; }
  else if (t.includes("presencial")) { txt = "Presencial"; color = "bg-[color:var(--azul)]"; }
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />{txt}
    </span>
  );
}

function ModalidadTag({ m, small }) {
  const t = (m || "").toLowerCase();
  let txt = "Por confirmar", cls = "tarjeta-2 text-[color:var(--txt-2)]", Ic = IClock;
  if (t.includes("remoto")) { txt = "Remoto"; cls = "bg-[rgba(95,214,168,.12)] text-[color:var(--verde)]"; Ic = IRemote; }
  else if (t.includes("hibrid") || t.includes("híbrid")) { txt = "Híbrido"; cls = "bg-[rgba(182,164,240,.14)] text-[color:var(--violeta)]"; Ic = IHybrid; }
  else if (t.includes("presencial")) { txt = "Presencial"; cls = "bg-[rgba(124,184,255,.12)] text-[color:var(--azul)]"; Ic = IHome2; }
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-lg ${cls}
      ${small ? "text-[11px] px-2 py-1" : "text-xs px-3 py-1.5"}`}>
      <Ic className={small ? "w-3 h-3" : "w-3.5 h-3.5"} /> {txt}
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
        disabled:opacity-30 ${on ? "btn-acento" : "tarjeta text-[color:var(--txt)]"}`}>
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap my-5 pb-2">
      <Btn onClick={() => ir(actual - 1)} disabled={actual === 1}><IChevron className="w-4 h-4 rotate-180" /></Btn>
      {nums.map((n, i) => n === "…"
        ? <span key={i} className="min-w-[18px] text-center text-[color:var(--txt-3)]">…</span>
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
              <StatCard n={s.total} l="Total recibidas" tono="a" />
              <StatCard n={s.pendientes} l="Pendientes" tono="marca" />
              <StatCard n={s.postuladas} l="Postuladas" tono="b" />
              <StatCard n={s.descartadas} l="Descartadas" tono="c" />
            </div>

            <SeccionTitulo>Progreso general</SeccionTitulo>
            <div className="tarjeta rounded-[22px] p-5">
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-sm font-bold text-[color:var(--txt)]">{respondidas} de {s.total} revisadas</span>
                <span className="text-2xl font-extrabold text-marca">{pct}%</span>
              </div>
              <Barra pct={pct} />
            </div>

            <SeccionTitulo>Pendientes por categoría</SeccionTitulo>
            {["A", "B", "C"].map((c) => {
              const n = s.porCat?.[c] || 0;
              const p = s.pendientes ? Math.round((n / s.pendientes) * 100) : 0;
              const Ic = CATS[c].Icono;
              return (
                <div key={c} className="tarjeta rounded-[18px] p-4 mb-2.5">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg ${CATS[c].grad} flex items-center justify-center`}>
                        <Ic className="w-4 h-4" />
                      </span>
                      {CATS[c].nombre}
                    </span>
                    <span className="text-[color:var(--txt-2)]">{n}</span>
                  </div>
                  <Barra pct={p} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ n, l, tono }) {
  const color = {
    a: "text-marca", marca: "text-marca",
    b: "text-[color:var(--verde)]", c: "text-[color:var(--rojo)]",
  }[tono] || "text-marca";
  const punto = {
    a: "bg-[color:var(--acento)]", marca: "bg-[color:var(--acento)]",
    b: "bg-[color:var(--verde)]", c: "bg-[color:var(--rojo)]",
  }[tono] || "bg-[color:var(--acento)]";
  return (
    <div className="tarjeta p-5 animate-subir relative overflow-hidden">
      <span className={`absolute top-5 right-5 w-2 h-2 rounded-full ${punto} opacity-70`} />
      <div className={`text-[36px] font-extrabold leading-none tracking-tight ${color}`}>{n}</div>
      <div className="text-[12.5px] mt-2 font-semibold text-[color:var(--txt-2)]">{l}</div>
    </div>
  );
}

function Barra({ pct }) {
  return (
    <div className="bg-[color:var(--bg-3)] rounded-full h-2.5 overflow-hidden">
      <div className="h-full rounded-full bg-[color:var(--acento)] transition-all duration-700" style={{ width: pct + "%" }} />
    </div>
  );
}

// ======================= COMPARTIDOS =======================
function Encabezado({ titulo, sub, Icono }) {
  return (
    <div className="grad-header px-5 pt-12 pb-7 relative overflow-hidden">
      <div className="relative animate-slideIn flex items-center gap-3.5">
        {Icono && (
          <span className="w-12 h-12 rounded-2xl tarjeta-2 flex items-center justify-center text-marca shrink-0">
            <Icono className="w-6 h-6" />
          </span>
        )}
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">{titulo}</h1>
          <div className="text-[color:var(--txt-2)] text-sm capitalize">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function SeccionTitulo({ children }) {
  return <div className="text-[12px] font-extrabold text-[color:var(--txt-3)] uppercase tracking-[.12em] mt-7 mb-3 mx-1">{children}</div>;
}

function SkeletonLista() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="tarjeta rounded-[22px] p-[18px]">
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
    <div className="text-center text-[color:var(--txt-2)] py-16 px-6 text-[15px] leading-relaxed animate-fade">
      <span className="inline-flex items-center justify-center w-20 h-20 rounded-3xl tarjeta mb-4 text-marca">
        <Icono className="w-9 h-9" />
      </span>
      <p>{texto}</p>
    </div>
  );
}

function SinConfigurar() {
  return (
    <div className="max-w-[480px] mx-auto p-8 text-center pt-24">
      <span className="inline-flex items-center justify-center w-20 h-20 rounded-3xl tarjeta mb-5 text-marca">
        <IGear className="w-10 h-10" />
      </span>
      <h1 className="text-xl font-extrabold mb-3 text-marca">Falta configurar la API</h1>
      <p className="text-[color:var(--txt-2)] text-sm leading-relaxed">
        Abre <code className="tarjeta-2 px-1.5 py-0.5 rounded">src/api.js</code> y pega la URL de tu Apps Script.
      </p>
    </div>
  );
}
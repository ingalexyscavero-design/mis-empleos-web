// ============================================================
//  Iconos SVG (stroke, estilo línea moderno tipo Lucide).
//  Reemplazan a los emojis para una estética de app profesional.
//  Todos heredan el color vía `currentColor` y aceptan className.
// ============================================================

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

function Svg({ children, className = "w-5 h-5", ...rest }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} {...base} {...rest}>
      {children}
    </svg>
  );
}

export const IHome = (p) => (
  <Svg {...p}><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></Svg>
);
export const IBriefcase = (p) => (
  <Svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></Svg>
);
export const ICheck = (p) => (
  <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>
);
export const IChart = (p) => (
  <Svg {...p}><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="13" y="7" width="3" height="10" rx="1" /></Svg>
);
export const ICode = (p) => (
  <Svg {...p}><path d="m8 6-6 6 6 6" /><path d="m16 6 6 6-6 6" /></Svg>
);
export const ITrend = (p) => (
  <Svg {...p}><path d="M3 17l6-6 4 4 7-7" /><path d="M17 8h4v4" /></Svg>
);
export const IPuzzle = (p) => (
  <Svg {...p}><path d="M9 4a2 2 0 0 1 4 0c0 .7.6 1.2 1.3 1H16a1 1 0 0 1 1 1v1.7c-.2.7.3 1.3 1 1.3a2 2 0 0 1 0 4c-.7 0-1.2.6-1 1.3V18a1 1 0 0 1-1 1h-2.7c-.7-.2-1.3.3-1.3 1a2 2 0 0 1-4 0c0-.7-.6-1.2-1.3-1H4a1 1 0 0 1-1-1v-2.7c.2-.7-.3-1.3-1-1.3a2 2 0 0 1 0-4c.7 0 1.2-.6 1-1.3V6a1 1 0 0 1 1-1h2.7C8.4 5.2 9 4.7 9 4Z" /></Svg>
);
export const IBuilding = (p) => (
  <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></Svg>
);
export const IPin = (p) => (
  <Svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const IMoney = (p) => (
  <Svg {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></Svg>
);
export const IExternal = (p) => (
  <Svg {...p}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></Svg>
);
export const IClose = (p) => (
  <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>
);
export const IRefresh = (p) => (
  <Svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></Svg>
);
export const IInbox = (p) => (
  <Svg {...p}><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5l2-8Z" /></Svg>
);
export const IList = (p) => (
  <Svg {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Svg>
);
export const IChevron = (p) => (
  <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
);
export const IArrowLeft = (p) => (
  <Svg {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></Svg>
);
export const IHome2 = (p) => (
  <Svg {...p}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" /></Svg>
);
export const IRemote = (p) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></Svg>
);
export const IHybrid = (p) => (
  <Svg {...p}><path d="M16 3h5v5" /><path d="M21 3 13 11" /><path d="M8 21H3v-5" /><path d="M3 21l8-8" /></Svg>
);
export const IClock = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
);
export const IHand = (p) => (
  <Svg {...p}><path d="M18 11V6a2 2 0 0 0-4 0M14 6V4a2 2 0 0 0-4 0v2M10 6.5V4a2 2 0 0 0-4 0v9" /><path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-7-4l-2.5-4.5a2 2 0 0 1 3.4-2L8 14" /></Svg>
);
export const IGear = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 15H4.5a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6V4.5a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-1.1 2.7v.1Z" /></Svg>
);

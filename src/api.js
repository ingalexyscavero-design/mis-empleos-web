// ============================================================
//  API · Habla con el Apps Script (el "cerebro" en Google)
// ------------------------------------------------------------
//  El Apps Script publica una URL .../exec que devuelve JSON.
//  Pega aquí TU URL (la que te dio "Implementar") y tu token.
//
//  NOTA CORS: Apps Script no manda cabeceras CORS en peticiones
//  normales. Para evitar el bloqueo, hacemos GET simples (sin
//  cabeceras especiales), que el navegador permite leer.
// ============================================================

// 👇 PEGA AQUÍ tu URL de Apps Script (termina en /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbw6Tf93b6yeslIix7R6kcJ91HAcK1gW4qZ1G0e15ZKvyaxw_X-CA9sycw9Du9GoNy13/exec";

// El mismo token que pusiste en Codigo.gs (TOKEN_WEB).
const TOKEN = "alexys-empleos-2026";

// Construye la URL con los parámetros.
function url(params) {
  const q = new URLSearchParams({ token: TOKEN, ...params });
  return `${API_URL}?${q.toString()}`;
}

// Hace la petición y devuelve el JSON.
async function pedir(params) {
  const r = await fetch(url(params), { method: "GET", redirect: "follow" });
  if (!r.ok) throw new Error("Error de red (" + r.status + ")");
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ===== Funciones que usa la app =====
export const api = {
  stats: () => pedir({ accion: "stats" }),
  contadores: (cat) => pedir({ accion: "contadores", cat }),
  vacantes: (cat, filtro, pagina, porPagina = 6) =>
    pedir({ accion: "vacantes", cat, filtro, pagina, porPagina }),
  historial: (desde = 0, cuantas = 12) =>
    pedir({ accion: "historial", desde, cuantas }),
  accion: (codigo, tipo) => pedir({ accion: "accion", codigo, tipo }),
  actualizar: () => pedir({ accion: "actualizar" }),
};

export const API_CONFIGURADA = !API_URL.includes("PEGA_AQUI");

# 🚀 Cómo publicar tu Web de Empleos (GitHub + Netlify)

Tu app tiene 2 partes:
- **El cerebro (Apps Script):** ya lo tienes en tu Google Sheets. Lee Gmail,
  Sheet y Gemini. Lo dejamos como API (devuelve datos en JSON).
- **La web bonita (esta carpeta):** React + Vite. Vive en Netlify.

---

## PARTE 1 — Publicar el Apps Script como API

1. Abre tu Sheet → **Extensiones → Apps Script**.
2. Pega el `Codigo.gs` actualizado (el de la carpeta `appscript/`).
3. **Implementar → Gestionar implementaciones → ✏️ Editar → Nueva versión → Implementar**.
4. En **"Quién tiene acceso"** elige **Cualquier usuario** (para que la web
   pueda leer la API). *Tranquilo: protegimos con un token secreto, nadie sin
   el token puede usarla.*
5. Copia la **URL** (termina en `/exec`).

---

## PARTE 2 — Conectar la web con tu API

1. Abre `web/src/api.js`.
2. En la línea `const API_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";`
   pega tu URL del `/exec`.
3. (Opcional) Cambia el `TOKEN` por uno tuyo — pero debe ser **el mismo**
   que pusiste en `Codigo.gs` (la constante `TOKEN_WEB`).

---

## PARTE 3 — Probar en tu PC (antes de publicar)

```bash
cd web
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Ábrela en el navegador. Si ves tus vacantes, ¡funciona! 🎉

---

## PARTE 4 — Subir a GitHub

```bash
cd web
git init
git add .
git commit -m "Web de empleos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mis-empleos-web.git
git push -u origin main
```

(O usa GitHub Desktop si te resulta más cómodo.)

---

## PARTE 5 — Desplegar en Netlify

1. Entra a **https://app.netlify.com** → inicia sesión con GitHub.
2. **Add new site → Import an existing project → GitHub**.
3. Elige tu repo `mis-empleos-web`.
4. Netlify detecta solo la configuración (gracias a `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy**. En ~1 minuto te da una URL tipo `https://tu-app.netlify.app`.

---

## PARTE 6 — Anclar en el celular 📱

1. Abre tu URL de Netlify en **Chrome del celular**.
2. Menú (⋮) → **Agregar a pantalla de inicio**.
3. ¡Listo! Tienes tu app de empleos como ícono. 🎯

---

## ¿Cómo se actualiza después?

Cada vez que cambies algo en la web y hagas `git push`, **Netlify la actualiza
sola** en ~1 minuto. No tienes que hacer nada más.

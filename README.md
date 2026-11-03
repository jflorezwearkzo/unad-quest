# 🎮 UNAD Quest

Mi carrera de **Ingeniería en Inteligencia Artificial y Ciencia de Datos (UNAD)** convertida en un juego, con agenda y cuadernos. PWA instalable en iPhone, iPad y Mac.

## Qué tiene
- **🗺️ Malla** — XP = créditos, niveles, logros, árbol de prerrequisitos y plan acelerado (21 cr + intersemestrales, inglés homologado).
- **📅 Agenda** — tareas por materia (enfocada en las que estoy cursando), semana, prioridades, vencidas.
- **📓 Cuadernos** — notas por materia en Markdown + tinta con Apple Pencil (presión, resaltador, borrador, papel rayado/cuadrícula/puntos, varias páginas, exportar PNG). Modo "solo lápiz": el dedo hace scroll.
- **Sync** — todo se guarda local (IndexedDB) y se sincroniza con Cloudflare D1. Funciona sin conexión.

## Arquitectura
- `public/` — app estática (HTML/JS, service worker, manifest).
- `src/worker.js` — Worker: sirve los assets y `/api/sync` (D1, last-write-wins). Valida el JWT de Cloudflare Access.
- Acceso protegido con **Cloudflare Access** (solo mi correo + WARP obligatorio).
- Despliegue automático con Workers Builds en cada push a `main`.

## Local
```bash
npm i
echo 'DEV_EMAIL=tu@correo' > .dev.vars
npx wrangler d1 migrations apply DB --local
npx wrangler dev
```

> Prerrequisitos interpretados a partir de las líneas de la malla oficial (Resolución 005287 de 2026). Confirmar con consejería antes de matricular.

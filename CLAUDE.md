# Instrucciones para agentes en este repo (UNAD Quest)

- Idioma del código y docs: español.
- Nunca push directo a `main`: rama de trabajo + PR (ver CONTRIBUTING.md). Merge a `main` = despliegue en Cloudflare (Workers Builds publica `unad.zylarion.io`).
- Commits en Conventional Commits. **No** agregues líneas `Co-Authored-By` ni `Claude-Session` a los commits.
- Antes de abrir un PR: `npm run ci` debe pasar.
- No pongas secretos ni datos personales en código, pruebas o logs. Los secretos van en variables de entorno o en el gestor de la plataforma, nunca en el repo.
- Worker de Cloudflare (`src/worker.js`) + estáticos en `public/` + D1 (`migrations/`). Acceso solo con Cloudflare Access: el worker verifica el JWT (firma, aud, iss, exp, alg) y la lista `ALLOWED_EMAILS`.
- `ACCESS_AUD` y `ACCESS_TEAM_DOMAIN` son identificadores públicos de Access, no secretos (permitidos en `.gitleaks.toml`). Secretos de verdad: `wrangler secret put`; en local, `.dev.vars` (ignorado por git).
- Cambios de esquema D1: archivo nuevo en `migrations/` (nunca editar uno aplicado).
- HTML generado en `public/app.js`: todo dato del usuario pasa por `esc()` (o `md()`, que escapa primero).

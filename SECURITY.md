# Seguridad

## Reportar una vulnerabilidad

Escribe a **security@zylarion.io**. No abras issues públicos. Respondemos en máximo 3 días hábiles.

## Modelo (resumen)

- Todo `/api/*` exige un JWT válido de Cloudflare Access (firma RS256 con las llaves del equipo, audiencia, emisor, expiración) y un correo de la lista permitida.
- Sin `workers.dev` ni URLs de vista previa: solo el dominio con Access.
- Datos del usuario escapados antes de ir al DOM.

## En el repositorio

- `security.yml`: gitleaks, `npm audit` y Semgrep en cada PR, en `main` y cada lunes.
- Actions fijadas por SHA; Dependabot con espera de 7 días para versiones nuevas.

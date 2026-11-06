## Qué cambia

<!-- Una o dos frases. -->

## Por qué

## Tipo

- [ ] feat · nueva funcionalidad
- [ ] fix · corrección
- [ ] security · endurecimiento o corrección de seguridad
- [ ] chore / docs / ci / refactor

## Checklist

- [ ] No hay secretos, tokens ni datos personales en el código, los logs ni las pruebas.
- [ ] Las rutas nuevas de `/api/*` pasan por `verifyAccess`.
- [ ] Todo dato del usuario que va a `innerHTML` pasa por `esc()`/`md()`.
- [ ] Cambios de D1 en una migración nueva.

## Cómo lo probé

- [ ] `npm run ci` pasa en local

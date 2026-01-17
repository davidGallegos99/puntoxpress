# Puntoxpress — Mini e-commerce (Angular 21)

## Requisitos
- Node.js 20+
- npm 10+

## Instalación y ejecución
```bash
npm install
npm run start
```

La aplicación usa un mock REST basado en `assets/products.json`.

## Decisiones técnicas
- **Angular 21 + standalone components** para reducir complejidad y mantener módulos livianos.
- **Signals + ChangeDetection OnPush + zoneless** (con `provideExperimentalZonelessChangeDetection`) para rendimiento y predictibilidad.
- **Arquitectura por capas**:
  - `domain`: contratos y modelos puros.
  - `data`: implementación de repositorios (HTTP).
  - `application`: orquestación de casos de uso y estado con signals.
  - `features`: componentes de UI por flujo.
  - `shared`: estilos/utilidades reutilizables.
- **Estado** centralizado en stores con signals y sin servicios monolíticos.

## Decisiones UI/UX
- Layout responsive con rejillas fluidas y tarjetas.
- Jerarquía visual: encabezado fijo, badges, llamadas a la acción claras.
- Accesibilidad básica: etiquetas en inputs, contrastes altos, foco visible del navegador.

## Pendientes conocidos
- Integrar API real con paginación.
- Pruebas unitarias/e2e.
- Persistencia del carrito en storage.

## Scripts útiles
- `npm run start` — desarrollo
- `npm run build` — producción

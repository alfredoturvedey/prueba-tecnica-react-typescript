# Prueba técnica — React + TypeScript

App que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com) para listar usuarios, ver sus publicaciones y crear nuevas.

---

## Cómo ejecutarlo

**Requisitos:** Node.js 18+

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo → http://localhost:5173
npm run dev

# Tests (modo CI, una sola ejecución)
npm run test:run

# Tests (modo watch)
npm run test

# Build de producción
npm run build
```

La variable de entorno ya está incluida en el repositorio (`.env` commiteado intencionalmente: la URL es una API pública sin credenciales). También se incluye `.env.example` como referencia para clonar el proyecto:

```
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

Si la variable está ausente, `api.ts` usa el mismo valor como fallback, por lo que el proyecto funciona incluso sin el `.env`.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── posts/       — PostCard, PostList, CreatePostForm, UserPostsView
│   ├── ui/          — Primitivos shadcn/ui (Button, Card, Input, Table, Tooltip…)
│   └── users/       — UserDataTable, columns
├── hooks/           — useUsers, usePosts  (fetch + estado local + retry)
├── services/        — api.ts  (capa de red; único punto de contacto con fetch)
├── store/           — useAppStore  (Zustand: solo selectedUserId)
├── test/            — setup.ts, fixtures.ts
└── types/           — api.ts  (User, Post y tipos relacionados)
```

---

## Stack

| Herramienta | Versión | Rol |
|---|---|---|
| Vite | 8 | Build tool |
| React | 19 | UI |
| TypeScript | 7 | Tipado estático |
| Tailwind CSS | 4 | Estilos |
| shadcn/ui | (nova/base-ui) | Componentes UI |
| TanStack Table | 8 | DataTable |
| React Hook Form + Zod | 7 / 4 | Formularios y validación |
| Zustand | 5 | Estado global |
| Lucide React | — | Iconografía |
| Sonner | — | Toast notifications |
| Vitest + Testing Library | 5 / 16 | Tests |

---

## Decisiones técnicas

### DataTable con TanStack Table en lugar de lista de cards
La lista de usuarios usa el DataTable de shadcn/ui (TanStack Table v8) en vez de cards personalizadas. Esto entrega filtrado global, sorting por columna y paginación sin código adicional, y escala mejor si en el futuro hay más columnas o más registros.

### React Hook Form + Zod como única fuente de verdad
El schema Zod se define primero y el tipo `PostFormValues` se deriva de él con `z.infer`. Esto garantiza que el tipado y la validación nunca se desincronicen. El `zodResolver` conecta ambas librerías sin código manual.

### Zustand con slice mínimo
El store solo guarda `selectedUserId`. El resto del estado (usuarios, posts, estado del formulario) vive en hooks y estado local de los componentes. Almacenar server state en Zustand sería duplicación; ese rol lo gestiona cada hook de fetch.

### Creación optimista de posts
Al crear un post, se llama a la API y el resultado se antepone a la lista local de inmediato, sin esperar un refetch. JSONPlaceholder siempre devuelve `id: 101` en los POSTs, por lo que se usa `Date.now()` como ID local para evitar colisiones de keys en React cuando el usuario crea varios posts.

### Cancellation flags en los hooks de fetch
Cada `useEffect` en `useUsers` y `usePosts` tiene un flag `cancelled`. Si el componente se desmonta antes de que la promesa resuelva, la actualización de estado se descarta. Esto evita el warning *"Can't perform a React state update on an unmounted component"*.

### Capa de servicio separada
`src/services/api.ts` centraliza todos los calls a `fetch`. Los hooks nunca importan `fetch` directamente. Esto hace que mockear la API en tests sea trivial (`vi.mock('@/services/api')`).

### Retry explícito en los hooks
`useUsers` y `usePosts` exponen una función `retry()` respaldada por un contador `attempt`. Incrementarlo re-dispara el `useEffect` sin desmontar el componente, permitiendo que el usuario reintente una carga fallida con un botón visible.

---

## Qué haría con más tiempo

- **TanStack Query** en lugar de hooks manuales: caching automático, deduplicación de peticiones, `staleTime`, `invalidateQueries` al crear posts y mejor manejo de background refetches.
- **Code splitting** con `React.lazy` + `Suspense` para las rutas, reduciendo el bundle inicial (actualmente ~540 kB minificado).
- **MSW (Mock Service Worker)** para los tests: mockear la red a nivel HTTP en vez de mockear el módulo `api.ts`, lo que da tests más cercanos a la realidad.
- **Tests E2E con Playwright** cubriendo flujos desde el navegador real (el test de integración de `App.test.tsx` cubre el flujo a nivel de componente, pero Playwright validaría la red y el CSS rendering reales).
- **Virtualización de listas** con `@tanstack/react-virtual` para soportar miles de filas sin degradación de rendimiento.
- **Rutas** con React Router: cada usuario tendría su propia URL (`/users/1/posts`), permitiendo compartir enlaces y usar el botón atrás del navegador de forma nativa.
- **Paginación server-side** de posts: JSONPlaceholder soporta `_page` y `_limit`; implementarlo evitaría cargar los 100 posts de golpe.
- **Accesibilidad avanzada**: ARIA live regions para anunciar nuevos posts al crear uno, foco gestionado al navegar entre vistas.

---

## Cómo usé la IA

Usé Claude como par de programación a lo largo de toda la implementación. Aquí el detalle honesto de qué pedí, qué acepté sin cambios y qué corregí.

### Qué le pedí

- Scaffoldear el proyecto con el stack completo (Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form + Zod, Zustand, Lucide React).
- Implementar cada feature de la prueba paso a paso, en commits separados para que el progreso sea legible.
- Crear una skill de mejores prácticas (`.claude/commands/best-practices.md`) con guías de arquitectura, performance y accesibilidad para que sirviera de referencia durante el desarrollo.
- Generar los tests de Vitest con Testing Library cubriendo distintos patrones: hooks asíncronos, validación de formularios e interacción con componentes.

### Qué acepté

- La estructura de carpetas propuesta (`components/users/`, `components/posts/`, `hooks/`, `services/`, `store/`, `types/`): limpia y sin sobreingeniería.
- El patrón de cancellation flags en los hooks de fetch, que es más simple que `AbortController` para este scope.
- La creación optimista con `Date.now()` como ID local: solución pragmática al quirk de JSONPlaceholder de devolver siempre `id: 101`.
- Usar `buttonVariants` directamente sobre `TooltipTrigger` para el botón de acción: evita el problema del `<button>` dentro de `<button>` que `asChild` requeriría (y que `@base-ui/react` no soporta).
- El patrón de factory function `createUserColumns(onSelectUser)` con `useMemo` para pasar callbacks a las columnas de TanStack Table.

### Qué corregí o pedí cambiar

- **Lista de usuarios**: la primera implementación usaba cards personalizadas (`UserCard`, `UserList`). Pedí reemplazarlas por el DataTable de shadcn con filtros, sorting y paginación integrados.
- **Botón de acción**: la primera versión tenía texto ("Gestionar publicaciones"). Pedí dejarlo solo con icono y agregar un tooltip.
- **Bug de shadcn en Windows**: la CLI de shadcn interpreta el alias `@` como un directorio literal en Windows, creando los archivos en `@/components/ui/` en vez de `src/components/ui/`. Se tuvo que mover manualmente en cada `npx shadcn add`.
- **TanStack Table v9**: npm instaló la v9 por defecto, cuya API cambió por completo (renombró `getCoreRowModel` a `createCoreRowModel`, etc.). Se hizo downgrade a v8 que es la que shadcn documenta y soporta.
- **Caché de Vite**: tras el downgrade de TanStack Table el navegador mostraba `SyntaxError: does not provide an export named 'getCoreRowModel'`. La causa era el caché de pre-bundling de Vite en `node_modules/.vite`. Se resolvió borrando ese directorio.
- **Cleanup de RTL en tests**: los primeros tests de `CreatePostForm` fallaban con "Found multiple elements" porque RTL no podía enganchar su `afterEach(cleanup)` automático sin `globals: true` en Vitest. Se añadió `afterEach(() => cleanup())` explícito en `src/test/setup.ts`.
- **`role="button"` en `<tr>`**: la primera implementación añadía `role="button"` a la fila de la tabla para hacerla clickeable. Ese antipatrón rompe la semántica ARIA (los `<td>` quedan huérfanos). Se eliminó el role; la fila sigue siendo navegable vía teclado con `tabIndex` y `onKeyDown`, y la acción principal la dispara el botón dedicado "Gestionar publicaciones".
- **Zod sin `.trim()`**: el schema original aceptaba strings de solo espacios (`" "`) como título o cuerpo válido. Se añadió `.trim()` antes de `.min(1, ...)` en ambos campos.
- **`createPost` sin `useCallback`**: la función `createPost` de `usePosts` y `handleCreatePost` de `UserPostsView` se envuelven ahora en `useCallback` con sus dependencias correctas, evitando recrearlas en cada render.

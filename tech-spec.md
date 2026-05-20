# Tech Spec — Semainier Pro

## Dépendances

| Package | Version | Rôle |
|---------|---------|------|
| `react` | ^19.1 | Framework UI |
| `react-dom` | ^19.1 | Rendu DOM |
| `vite` | ^6.3 | Bundler / dev server |
| `@vitejs/plugin-react` | ^4.5 | Plugin Vite pour React |
| `typescript` | ^5.8 | Typage statique |
| `@types/react` | ^19.1 | Types React |
| `@types/react-dom` | ^19.1 | Types ReactDOM |
| `tailwindcss` | ^4.1 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.1 | Integration Tailwind/Vite |
| `lucide-react` | ^0.469 | Icônes (design exige uniquement des icônes, pas d'emojis) |
| `zustand` | ^5.0 | State management + persistence localStorage |
| `gsap` | ^3.13 | Animations complexes (stagger timeline Journée type, progress bars KPI) |
| `react-countup` | ^6.5 | Animation des chiffres stats (compteurs progressifs) |

---

## Inventaire des Composants

### Layout (partagés)

| Composant | Source | Réutilisation |
|-----------|--------|---------------|
| `AppHeader` | Custom | Unique — sticky header avec tabs, notifs, theme toggle |
| `ToastContainer` | Custom | Unique — gestion de la pile de toasts (max 3) |

### Vues (routage par onglet, une seule visible à la fois)

| Composant | Description |
|-----------|-------------|
| `SemainierView` | Grille 7 colonnes + Journée type + filtres |
| `MoisView` | Grille calendrier mois par mois |
| `ListeView` | Tableau de tâches avec colonnes triables |
| `StatsView` | Dashboard stats globales + catégories + clients |
| `EquipeView` | Grille de cartes collaborateurs |
| `KpiView` | Grid de KPI cards par collaborateur |
| `AdminView` | Grid admin (clients, backup, stats, danger zone) + roadmap |

### Composants réutilisables

| Composant | Source | Utilisé par |
|-----------|--------|-------------|
| `Toolbar` | Custom | SemainierView, ListeView, EquipeView, KpiView |
| `FilterBar` | Custom | SemainierView, ListeView |
| `TaskCard` | Custom | SemainierView (drag source), MoisView (preview) |
| `CategoryBadge` | Custom | TaskCard, ListeView, StatsView |
| `PriorityDot` | Custom | TaskCard, ListeView |
| `StatusBadge` | Custom | ListeView |
| `StatsCard` | Custom | StatsView (×6), avec variantes Success/Warning/Highlight |
| `EmptyState` | Custom | Toutes les vues listes/vides |
| `CollaboratorCard` | Custom | EquipeView |
| `KpiCard` | Custom | KpiView |
| `FormModal` | Custom | Tous les modales (tâche, client, collaborateur, suggestions, notifs, confirmation) |
| `JourneeType` | Custom | SemainierView uniquement |
| `ConfirmModal` | Custom | AdminView (actions destructrices) |

### Composants shadcn/ui (à installer)

Aucun composant shadcn/ui nécessaire. Le design utilise un système de tokens custom (radius, shadows, couleurs spécifiques) qui ne mappe pas sur les patterns shadcn par défaut. Tous les composants (boutons, inputs, selects, modals, badges) ont des spécifications visuelles propres dans le design system (ex: radius 12px boutons, 16px cartes, couleurs catégorielles custom). Réimplémenter from scratch est plus simple que surcharger shadcn.

---

## Plan d'Implémentation des Animations

| Animation | Bibliothèque | Approche | Complexité |
|-----------|-------------|----------|------------|
| Cross-fade transition entre vues | CSS transitions | Classes CSS `opacity` + `visibility` avec délai stagger (out 150ms, in 250ms/50ms délai) | 🔒 Low |
| Toast slide-in / auto-dismiss | CSS keyframes + setTimeout | `translateX(120%→0)` 400ms, auto-dismiss 4000ms fade-out 300ms | 🔒 Low |
| Stagger Journée type items | GSAP `gsap.from()` | `translateY(10px)` + `opacity` avec stagger 60ms sur les 8 items, au mount du composant | 🔒 Low |
| KPI progress bars width | GSAP `gsap.fromTo()` | Animer `width` de 0→valeur% au mount (800ms, ease personnalisé) | 🔒 Low |
| Category breakdown bars | GSAP `gsap.fromTo()` | Animer `width` de 0→valeur% au mount (600ms) | 🔒 Low |
| Stats card number count-up | react-countup | `<CountUp>` wrapper sur les valeurs numériques, déclenché au mount avec IntersectionObserver | 🔒 Low |
| Drag & drop task cards | HTML5 DnD API natif | `dragstart`/`drop` natifs, styles visuels (opacity 0.5, rotation 2deg, shadow) via classes CSS toggle dans les event handlers | 🔒 Low |
| Modal open/close | CSS transitions | Scale 0.95→1 + opacity, 300ms `cubic-bezier(0.16,1,0.3,1)` | 🔒 Low |
| Dark mode transition | CSS transitions | `transition: background-color 400ms ease, color 400ms ease, border-color 400ms ease` sur les éléments tokenisés | 🔒 Low |
| Card hover (translateY + shadow) | CSS transitions | `transition: all 200ms ease` sur `:hover` | 🔒 Low |
| Autosave indicator | CSS transition | Texte "Sauvegarde..." → checkmark, opacity transition 200ms | 🔒 Low |
| Day column drop zone highlight | CSS transitions | Background + border transition 200ms au `dragover` | 🔒 Low |

---

## État et Logique

### Architecture : Zustand store unique

Un seul store Zustand gère l'ensemble de l'état applicatif. Pas besoin de React Context ni de séparation en sous-stores — l'application est un CRUD local avec des relations simples.

**Slices du store :**

- **`ui`** : vue active (onglet), état modals (type + données éditées), indicateur sauvegarde, toast queue
- **`data`** : tâches, clients, collaborateurs, notifications
- **`filters`** : search, filterCat, filterStatus, filterClient, filterCollab
- **`navigation`** : currentWeekStart, currentMonth (year+month)
- **`theme`** : darkMode

### Persistence localStorage

Middleware Zustand `persist` qui sérialise les slices `data`, `filters`, `navigation`, `theme`. Le slice `ui` (modals, toasts) n'est **pas** persisté. Intervalle d'auto-save : le middleware `persist` sauvegarde à chaque mutation + un `setInterval` 60s pour la résilience.

### Notifications / Toast

Système de toast géré dans le store Zustand : une queue d'objets `{id, message, type, createdAt}`. Le composant `ToastContainer` consomme cette queue. Un `useEffect` dans ToastContainer gère l'auto-dismiss (setTimeout par toast, max 3 visibles).

### Drag & Drop

HTML5 Drag and Drop API natif, **pas de bibliothèque externe**. Le DnD est limité à un seul cas : déplacer une tâche d'une colonne jour à une autre. Le store expose une action `moveTask(taskId, newDateKey)` appelée au `onDrop`. Aucun besoin de react-dnd-dnd pour ce scope.

### Confirmation modals

Les actions destructrices (AdminView) utilisent le FormModal générique avec un mode "confirmation" (message + boutons Oui/Non). Le type de modal dans le store est `confirmation` avec une callback `onConfirm` stockée dans le slice `ui`.

---

## Décisions Clés

1. **Pas de React Router** — L'application est une SPA avec 7 vues switchées par onglets. Un simple state `currentView` suffit. Le design ne mentionne pas d'URL routing.

2. **Pas de date-fns / dayjs** — Le design couvre une période fixe (juin 2026 → mai 2027) avec des opérations date basiques (addDays, startOfWeek, format). Les utilitaires date sont réimplémentés en ~100 lignes. Aucune locale complexe ni timezone.

3. **Pas de shadcn/ui** — Le design system définit des tokens visuels très spécifiques (radius custom par composant, couleurs catégorielles propres, palette terracotta/sage). Surcharger shadcn coûte plus cher que des composants custom Tailwind.

4. **Pas de react-dnd** — Un seul cas DnD (task card → colonne jour). HTML5 DnD natif avec les handlers `draggable`/`ondrop` sur les TaskCards et DayColumns suffit.

5. **GSAP pour les animations métier** — Les progress bars KPI et le stagger Journée type bénéficient du timing précis de GSAP. Le reste des animations (hover, modals, toasts, dark mode) reste en CSS pur.

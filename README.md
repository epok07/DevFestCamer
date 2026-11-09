# DevFestCamer

Application compagnon annuelle pour les DevFest du Cameroun. La première
édition couverte est le **DevFest Douala 2026 — Stand Alone Complex**
(samedi 28 novembre 2026, JFN Hightech University Institute, Bonamoussadi –
Santa Barbara).

L'application regroupe le programme, les intervenant·es, le plan interactif du
lieu, les ressources, l'annuaire des participant·es, les partenaires, les
témoignages et les contacts de l'équipe. Elle est pensée d'abord comme une PWA
légère, installable et utilisable hors-ligne, avec un portage Capacitor possible
ensuite.

## Stack

- Ionic 9 + Angular 22 (modules NgModule, composants non-standalone)
- État réactif basé sur les signals Angular
- Contenu 100 % statique, chargé depuis des fichiers JSON versionnés
- Thème sombre « terminal / cyber » par défaut, thème clair au choix
- SVG inline pour le plan du lieu, recoloré par les variables du thème
- Service worker et manifeste pour l'installation PWA

## Démarrer

```bash
npm install
npm start        # http://localhost:4200
```

Autres commandes :

```bash
npm run build    # build production dans www/
npm test         # tests unitaires (Vitest)
npm run lint
```

## Routes

| URL | Page |
| --- | --- |
| `/` | Redirige vers l'édition la plus récente publiée |
| `/:year/highlights` | Accueil de l'édition |
| `/:year/agenda` | Programme filtrable + export `.ics` |
| `/:year/speakers` | Liste des intervenant·es |
| `/:year/speakers/:id` | Fiche intervenant·e |
| `/:year/venue` | Lieu, plan interactif et accès |
| `/:year/more` | Menu des contenus secondaires |
| `/:year/more/materials` | Ressources et documents |
| `/:year/more/participants` | Annuaire des participant·es |
| `/:year/more/participants/:id` | Fiche participant·e |
| `/:year/more/sponsors` | Partenaires |
| `/:year/more/testimonials` | Témoignages |
| `/:year/more/team` | Équipe et contacts |
| `/:year/more/about` | Manifeste et informations sur l'app |

## Organisation des données

```text
src/assets/
├── data/
│   ├── editions.json   # index des années affichées dans le sélecteur
│   └── 2026.json       # contenu complet de l'édition 2026
├── img/
│   └── venue-2026.svg  # plan interactif (data-room par salle)
├── materials/          # documents téléchargeables
└── manifest.webmanifest
```

`editions.json` est la source de vérité pour le sélecteur d'année :

```json
{
  "year": 2026,
  "name": "DevFest Douala 2026",
  "city": "Douala",
  "theme": "Stand Alone Complex",
  "date": "2026-11-28",
  "dateLabel": "Samedi 28 novembre 2026",
  "status": "upcoming"
}
```

Le champ `status` accepte `upcoming`, `live`, `archive` ou `planned`. Une
édition `planned` reste visible dans le sélecteur mais désactivée ; une URL
`/:year/...` dont l'année n'est pas publiée renvoie vers la page 404.

Chaque fichier `{year}.json` contient : `stats`, `highlights`, `tracks`, `days`
(sessions), `speakers`, `venue` (salles, arrivée, transport), `materials`,
`participants`, `sponsors`, `testimonials`, `team` et `links`.

### Ajouter une nouvelle édition

1. Copier `src/assets/data/2026.json` vers `src/assets/data/2027.json`.
2. Mettre à jour `year`, `name`, `theme`, `date`, `dateLabel`, puis remplacer
   le contenu (programme, intervenant·es, lieu, partenaires…).
3. Ajouter l'entrée correspondante dans `src/assets/data/editions.json`.
4. Si le plan change, ajouter un SVG dans `src/assets/img/` et pointer
   `venue.svg` dessus. Les salles interactives utilisent l'attribut
   `data-room="<roomId>"`.
5. Si nécessaire, ajouter les documents dans `src/assets/materials/` et
   référencer leur URL dans `materials`.
6. Reconstruire : `npm run build`.

Tant qu'une année est `planned`, elle est désactivée et aucune requête vers un
fichier manquant n'est faite. Dès qu'elle passe en `upcoming` avec son JSON,
elle devient la cible de la route `/`.

### Données de démonstration

Le fichier 2026 porte `"demo": true`. Dans cette édition :

- l'annuaire des participant·es et les témoignages sont **fictifs** ;
- les liens des participant·es utilisent `https://example.com/...` ;
- les noms de certain·es intervenant·es et partenaires servent de gabarit.

Remplacez ces données par les informations réelles avant la mise en ligne, puis
retirez `demo` (ou passez-le à `false`) pour masquer les avertissements.

## PWA et hors-ligne

- `src/assets/manifest.webmanifest` définit le nom, les icônes et le mode
  standalone.
- `src/sw.js` est copié à la racine du build via `angular.json`.
- Le service worker n'est enregistré qu'en production (`environment.production`).
- Les navigations utilisent une stratégie réseau d'abord avec repli sur
  `index.html` ; les assets utilisent stale-while-revalidate.
- Après une modification importante du cache, incrémentez la constante
  `CACHE` dans `src/sw.js`.

En développement, le service worker n'est pas actif : un rechargement classique
suffit à voir les changements.

## Thèmes

L'interface suit le thème sombre par défaut. La page **Plus → Apparence**
propose un thème clair, mémorisé dans `localStorage`
(`devfestcamer.theme`). Tant qu'aucun choix n'a été fait, l'application suit la
préférence du système. Le thème est appliqué sur `<html>` via
`data-theme="light|dark"` et la classe `ion-palette-dark`; le script inline de
`src/index.html` évite un flash de mauvaise palette au premier rendu. Les
couleurs sont centralisées dans `src/theme/variables.scss` (`--df-*`, dont les
variables `--df-map-*` lues par le SVG du plan).

## Déploiement

Le build est généré dans `www/`. Pour un hébergement statique :

- servir `www/` en HTTPS (obligatoire pour le service worker) ;
- configurer un fallback SPA vers `index.html` pour toutes les routes ;
- si l'application n'est pas servie à la racine du domaine, ajuster
  `<base href="...">` dans `src/index.html` ainsi que `start_url` et `scope`
  dans le manifeste.

## Notes

Projet communautaire non officiel, inspiré de l'Ionic Conference App et
construit pour GDG Douala. Les marques et contenus cités appartiennent à leurs
détenteurs respectifs.

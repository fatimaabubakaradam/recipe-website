# FATIMA’S KITCHEN ✦ Good Food. Beautifully Discovered.

**Fatima’s Kitchen ✦** is an international recipe discovery platform that connects food enthusiasts with handpicked recipes dynamically sourced from **TheMealDB API**.

Engineered with pure **HTML5**, **CSS3 (Cyan & Indigo Spark Design System)**, and modern **Vanilla JavaScript (ES6+)**, Fatima’s Kitchen presents a cool-toned luxury visual experience with gradient typography, frosted glass search, ambient card hover physics, interactive recipe favoriting, asymmetric editorial cards, and quick-view detail modals.

---

## 🌟 Distinctive & Captivating Features

- **Refined Brand Identity**: `FATIMA’S KITCHEN ✦` featuring an electric indigo spark mark and tagline *"Good food. Beautifully discovered."*
- **Gradient Typography Accents**: Hero title featuring a multi-tone gradient overlay (*"GOOD FOOD. <span style="background: linear-gradient(135deg, #0b1329 0%, #0284c7 45%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">BEAUTIFULLY DISCOVERED.</span>"*).
- **Frosted Glass & Ambient Search Glow**: Glassmorphism search box (`backdrop-filter: blur(16px)`) with ambient backdrop radial glow on focus.
- **"Worth Making Tonight" Featured Section**: Asymmetric editorial layout formatting the top search result as a prominent 2-column featured hero card.
- **Category Discovery Destinations**: Visual category cards (*Pasta, Chicken, Seafood, Dessert, Beef, Vegetarian*) with 3D image scaling (`scale(1.1)`) and sliding arrow indicators.
- **Favorites & Bookmarking System**: Save favorite recipes with heart buttons (`♡` / `♥`), stored in `localStorage`, filterable via the "Saved" view tab.
- **Search Experience**:
  - Hero search bar ("🔍 What are you craving today? Search recipes, meals or ingredients...").
  - Instant query clearing button (`×`).
  - Search feedback toast notification (*"Recipe found — We found X delicious recipes for you."*).
- **Interactive Recipe Quick View Modal**:
  - High-res dish header image.
  - Interactive checkable ingredients checklist.
  - Step-by-step cooking instruction cards (`01`, `02`, `03`...).
  - Direct YouTube video tutorial button.
- **Tasteful Delayed Newsletter Modal**: Non-intrusive popup after 7 seconds delay, guarded with `sessionStorage` (`fatimas_kitchen_newsletter_dismissed`).
- **Cinematic Motion & Micro-Interactions**: Staggered card entrance animations and `IntersectionObserver` scroll reveals.
- **Responsive & Accessible**: Intentional layout across 320px to 1920px+ viewports with zero horizontal overflow.

---

## 📄 Footer Requirements

- **Branding**: Fatima’s Kitchen ✦
- **Author**: Made by Fatima
- **Contact Email**: fatimaabubakaradamg@gmail.com
- **Copyright**: © 2024 Fatima’s Kitchen

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document layout (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: CSS variables (`:root`), CSS Grid, Flexbox, media queries, keyframe animations, and `backdrop-filter`.
- **Vanilla JavaScript (ES6+)**: `async/await` API fetching, `localStorage` state management, `IntersectionObserver` scroll triggers, and dynamic DOM rendering.
- **API Endpoint**: [TheMealDB API](https://www.themealdb.com/api.php) (`https://www.themealdb.com/api/json/v1/1/search.php?s=`).
- **Typography**: Google Fonts (*Cormorant Garamond* serif headings + *Plus Jakarta Sans* UI body).

---

## 🚀 Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/fatimaabubakaradam/recipe-website.git
   cd recipe-website
   ```

2. **Launch in Browser:**
   ```bash
   # On Windows
   start index.html

   # On macOS
   open index.html
   ```

---

## 📁 Repository Files

```
recipe-website/
├── index.html      # Main HTML structure, hero, categories, & modals
├── style.css       # Design tokens, typography, grid, & animation system
├── script.js       # API fetching logic, favorites, modal logic, & observers
├── README.md       # Project documentation
└── LICENSE         # MIT License
```

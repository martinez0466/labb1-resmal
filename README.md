# Destinations – Lab 1 (HTML, CSS, JavaScript)

A simple responsive web app that lists travel destinations with **search, filter, sort, details**, and **favorites** (localStorage). Built with **semantic HTML5**, **vanilla CSS**, and **vanilla JS**.

## How to run
- Open the folder in Visual Studio Code.
- Install the “Live Server” extension.
- Right–click `index.html` → **Open with Live Server**.

## Project structure
.
├── README.md
├── assets
│   ├── banff.jpg
│   ├── capetown.jpg
│   ├── kyoto.jpg
│   ├── machupicchu.jpg
│   ├── queenstown.jpg
│   └── rome.jpg
├── css
│   └── style.css
├── index.html
└── js
    └── app.js



## Features
- Search (matches name, country, region, description)
- Filter by region
- Sort by name or rating
- Details dialog (native `<dialog>`)
- Favorites toggle (persists in `localStorage`)
- Responsive layout (CSS Grid)
- Accessibility: labels, `aria-*`, visible focus, keyboard-friendly

## How to replace the dataset
Open `js/app.js` → edit the `DESTINATIONS` array. Keep the same keys:
`id`, `name`, `country`, `region`, `rating`, `img`, `desc`, `link`.

## Wireframe (submission)
Include a simple wireframe (photo or Figma export) showing:
- Header with title
- Controls row (search, region, sort, reset)
- Card grid
- Details dialog

## Video (submission)
Record a 1–2 min demo: responsiveness (resize), search/filter/sort, open details, toggle favorite.

## Image credits
Images stored locally in `/assets`. Use your own or openly licensed sources (e.g., Wikimedia Commons, Unsplash). Add attribution if required.

## Wireframes
- [Desktop (PNG)](docs/wireframe-desktop.png)
- [Mobile (PNG)](docs/wireframe-mobile.png)

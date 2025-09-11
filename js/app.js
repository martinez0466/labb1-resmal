console.log('[labb1] app.js loaded');

let DESTINATIONS = [];

// Try fetch first (meets the requirement), then fall back to inline JSON if it fails.
async function loadData() {
    try {
        const res = await fetch('data/destinations.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        DESTINATIONS = await res.json();
        console.log('[labb1] data loaded via fetch:', DESTINATIONS.length);
    } catch (err) {
        console.warn('[labb1] fetch failed, using inline seed JSON', err);
        try {
            const seed = document.getElementById('seed-data');
            if (seed?.textContent) {
                DESTINATIONS = JSON.parse(seed.textContent);
                console.log('[labb1] data loaded via inline seed:', DESTINATIONS.length);
            }
        } catch (e) {
            console.error('[labb1] failed to parse inline seed JSON', e);
        }
    }
    update();
}

// Helpers
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function saveFavs(favs) { localStorage.setItem('favs', JSON.stringify(favs)); }
function loadFavs() { try { return JSON.parse(localStorage.getItem('favs')) ?? []; } catch { return []; } }

function applyFilters(items, { q, region, sort }) {
    let result = [...items];
    if (q) {
        const term = q.trim().toLowerCase();
        result = result.filter((x) =>
            [x.name, x.country, x.region, x.desc].some((v) => v.toLowerCase().includes(term))
        );
    }
    if (region) result = result.filter((x) => x.region === region);

    switch (sort) {
        case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'rating-desc': result.sort((a, b) => b.rating - a.rating); break;
        case 'rating-asc': result.sort((a, b) => a.rating - b.rating); break;
        case 'name-asc':
        default: result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
}

// State & render
let grid, count, form;
let favs = loadFavs();

function render(items) {
    grid.innerHTML = '';
    count.textContent = `${items.length} destination(s)`;

    for (const d of items) {
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
      <img class="thumb" src="${d.img}" alt="${d.name}" loading="lazy">
      <div class="card-body">
        <div class="pill" aria-label="Region">
          <span aria-hidden="true">🗺️</span><span>${d.region}</span>
        </div>
        <h3 class="card-title">${d.name}</h3>
        <p class="subtitle">${d.country} · Rating ${d.rating.toFixed(1)} / 5</p>
        <div class="actions">
          <a class="btn" href="details.html?id=${d.id}">Details</a>
          <button class="btn fav" data-id="${d.id}" aria-pressed="${favs.includes(d.id)}" aria-label="Save as favorite">★</button>
        </div>
      </div>
    `;
        grid.appendChild(card);
    }

    // Bind favorites on each render
    $$('.fav', grid).forEach((btn) => btn.addEventListener('click', toggleFav));
}

function stateFromForm() {
    const data = new FormData(form);
    return {
        q: data.get('q') ?? '',
        region: data.get('region') ?? '',
        sort: data.get('sort') ?? 'name-asc'
    };
}

function update() {
    const state = stateFromForm();
    const list = applyFilters(DESTINATIONS, state);
    render(list);
}

function toggleFav(e) {
    const id = e.currentTarget.dataset.id;
    if (favs.includes(id)) favs = favs.filter((x) => x !== id);
    else favs.push(id);
    saveFavs(favs);
    e.currentTarget.setAttribute('aria-pressed', String(favs.includes(id)));
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    grid = $('#grid');
    count = $('#count');
    form = $('#controls');
    document.getElementById('year').textContent = new Date().getFullYear();

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('reset', () => setTimeout(update, 0));

    loadData(); // fetch -> fallback seed
});
